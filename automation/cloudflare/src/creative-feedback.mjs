// Read-only, bounded Insights. Captions never leave the Worker; tokens never reach the runner.
const METRICS='views,reach,likes,saved,shares,ig_reels_avg_watch_time,reels_skip_rate';
export async function creativeFeedback(env,meta,now) {
 const base={captured_at:now,lookback_days:30,minimum_age_hours:72,returned_media:0,eligible_media:0,failed_media:0,reels:[]};
 let media;
 try {media=await meta(env,`${env.IG_USER_ID}/media`,'GET',{fields:'id,caption,timestamp,media_type',limit:'20'});}
 catch {return {status:'unavailable',...base};}
 base.returned_media=media.data?.length||0;
 const eligible=(media.data||[]).filter(m=>m.media_type==='VIDEO'&&/^\d+$/.test(m.id)&&Number.isFinite(Date.parse(m.timestamp))&&now-Date.parse(m.timestamp)/1000>=72*3600&&now-Date.parse(m.timestamp)/1000<=30*86400).slice(0,20);
 base.eligible_media=eligible.length;
 // Three requests at a time; at most 21 Graph subrequests in this handler.
 for(let i=0;i<eligible.length;i+=3) {
  await Promise.all(eligible.slice(i,i+3).map(async m=>{
   try {
    const response=await meta(env,`${m.id}/insights`,'GET',{metric:METRICS});
    const metrics={};for(const metric of response.data||[]) {const v=metric.values?.at(-1)?.value;if(typeof v==='number'&&Number.isFinite(v)&&v>=0)metrics[metric.name]=v;}
    const row={id:m.id,age_hours:Math.round((now-Date.parse(m.timestamp)/1000)/36)/100};
    const marker=String(m.caption||'').match(/\[SDCC:(lesson-(?:0[1-9]|[1-5][0-9]|60))\]/);if(marker)row.lesson=marker[1];
    for(const k of ['views','reach','likes','saved','shares'])if(metrics[k]!==undefined)row[k]=metrics[k];
    if(metrics.ig_reels_avg_watch_time!==undefined)row.average_watch_seconds=metrics.ig_reels_avg_watch_time/1000;
    if(metrics.reels_skip_rate!==undefined)row.skip_rate_pct=metrics.reels_skip_rate;
    if(!Object.keys(metrics).length)base.failed_media++;else base.reels.push(row);
   } catch {base.failed_media++;}
  }));
 }
 base.reels.sort((a,b)=>a.id.localeCompare(b.id));
 return {status:base.failed_media?(base.reels.length?'partial':'unavailable'):'available',...base};
}
