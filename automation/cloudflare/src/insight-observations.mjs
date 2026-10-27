// Numeric observations only. Collection has its own claims and never edits publishing state.
export const INSIGHT_METRICS='views,reach,likes,saved,shares,ig_reels_avg_watch_time,reels_skip_rate';
export function numericMetrics(response){
 const raw={};for(const metric of response.data||[]){const v=metric.values?.at(-1)?.value??metric.total_value?.value;if(typeof v==='number'&&Number.isFinite(v)&&v>=0)raw[metric.name]=v;}
 const row={};for(const k of ['views','reach','likes','saved','shares'])if(raw[k]!==undefined)row[k]=raw[k];
 if(raw.ig_reels_avg_watch_time!==undefined)row.average_watch_seconds=raw.ig_reels_avg_watch_time/1000;
 if(raw.reels_skip_rate!==undefined)row.skip_rate_pct=raw.reels_skip_rate;
 return row;
}
export async function captureDueObservation(env,meta,now){
 const row=await env.DB.prepare(`WITH windows(hours) AS (VALUES(24),(72),(168))
 SELECT l.id,l.post_id,l.published_at,w.hours FROM lessons l CROSS JOIN windows w
 LEFT JOIN insight_windows o ON o.media_id=l.post_id AND o.window_hours=w.hours
 WHERE l.course_id=? AND l.state='PUBLISHED' AND l.post_id IS NOT NULL AND l.published_at IS NOT NULL
 AND l.published_at+w.hours*3600 BETWEEN ? AND ?
 AND (o.media_id IS NULL OR (o.state='FAILED' AND o.retry_at<=? AND o.attempts<3) OR (o.state='CLAIMED' AND o.lease_until<=? AND o.attempts<3))
 ORDER BY l.published_at+w.hours*3600 LIMIT 1`).bind(env.COURSE_ID,now-900,now,now,now).first();
 if(!row)return {sampled:false};
 const token=crypto.randomUUID();const claim=await env.DB.prepare(`INSERT INTO insight_windows(media_id,window_hours,state,claim_token,lease_until,attempts)
 VALUES(?,?,'CLAIMED',?,?,1) ON CONFLICT(media_id,window_hours) DO UPDATE SET state='CLAIMED',claim_token=excluded.claim_token,lease_until=excluded.lease_until,attempts=insight_windows.attempts+1
 WHERE insight_windows.attempts<3 AND ((insight_windows.state='FAILED' AND insight_windows.retry_at<=?) OR (insight_windows.state='CLAIMED' AND insight_windows.lease_until<=?))`).bind(row.post_id,row.hours,token,now+180,now,now).run();
 if(!claim.meta.changes)return {sampled:false};
 try{
  const published=await meta(env,row.post_id,'GET',{fields:'timestamp'});const at=Date.parse(published.timestamp)/1000;
  if(!Number.isFinite(at)||at>now)throw new Error('Invalid media timestamp');
  const metrics=numericMetrics(await meta(env,`${row.post_id}/insights`,'GET',{metric:INSIGHT_METRICS}));
  if(!Object.keys(metrics).length)throw new Error('No numeric metrics');
  const age=Math.round((now-at)/36)/100;
  // Never present a missed historical observation as an on-time comparison.
  if(Math.abs(age-row.hours)>.3)throw new Error('Observation outside declared age window');
  await env.DB.batch([
   env.DB.prepare('INSERT OR IGNORE INTO insight_snapshots VALUES(?,?,?,?,?,?,?)').bind(row.post_id,now,row.id,age,row.hours===24?'early_provisional':'mature',row.hours,JSON.stringify(metrics)),
   env.DB.prepare("UPDATE insight_windows SET state='COMPLETE',observed_at=?,lease_until=0,claim_token=NULL WHERE media_id=? AND window_hours=? AND claim_token=?").bind(now,row.post_id,row.hours,token)
  ]);
  return {sampled:true,lesson:row.id,window_hours:row.hours};
 }catch{
  await env.DB.prepare("UPDATE insight_windows SET state='FAILED',retry_at=?,lease_until=0,claim_token=NULL WHERE media_id=? AND window_hours=? AND claim_token=?").bind(now+300,row.post_id,row.hours,token).run();
  return {sampled:false,unavailable:true};
 }
}
