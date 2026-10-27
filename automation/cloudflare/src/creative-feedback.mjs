import {INSIGHT_METRICS,numericMetrics} from './insight-observations.mjs';
// Read-only Graph calls. Raw captions and tokens never leave the Worker.
export async function creativeFeedback(env,meta,now){
 const base={captured_at:now,lookback_days:30,minimum_age_hours:3,mature_minimum_age_hours:72,early_minimum_age_hours:3,returned_media:0,eligible_media:0,mature_media:0,early_media:0,failed_media:0,reels:[],early_reels:[],matched_age_observations:[]};
 let media;
 try{media=await meta(env,`${env.IG_USER_ID}/media`,'GET',{fields:'id,caption,timestamp,media_type',limit:'20'});}catch{return {status:'unavailable',...base};}
 base.returned_media=media.data?.length||0;
 const eligible=(media.data||[]).filter(m=>m.media_type==='VIDEO'&&/^\d+$/.test(m.id)&&Number.isFinite(Date.parse(m.timestamp))&&now-Date.parse(m.timestamp)/1000>=3*3600&&now-Date.parse(m.timestamp)/1000<=30*86400).slice(0,20);
 base.eligible_media=eligible.length;
 for(let i=0;i<eligible.length;i+=3){
  await Promise.all(eligible.slice(i,i+3).map(async m=>{
   try{
    const metrics=numericMetrics(await meta(env,`${m.id}/insights`,'GET',{metric:INSIGHT_METRICS}));
    if(!Object.keys(metrics).length){base.failed_media++;return;}
    const age=(now-Date.parse(m.timestamp)/1000)/3600;const row={id:m.id,age_hours:Math.round(age*100)/100,...metrics};
    const marker=String(m.caption||'').match(/\[SDCC:(lesson-(?:0[1-9]|[1-5][0-9]|60))\]/);if(marker)row.lesson=marker[1];
    if(age<72){base.early_media++;base.early_reels.push({...row,cohort:'early_provisional'});}else{base.mature_media++;base.reels.push(row);}
   }catch{base.failed_media++;}
  }));
 }
 base.reels.sort((a,b)=>a.id.localeCompare(b.id));base.early_reels.sort((a,b)=>a.id.localeCompare(b.id));
 if(env.DB){
  try{
   const all=[...base.reels,...base.early_reels];
   if(all.length)await env.DB.batch(all.map(row=>env.DB.prepare('INSERT OR IGNORE INTO insight_snapshots VALUES(?,?,?,?,?,?,?)').bind(row.id,now,row.lesson||null,row.age_hours,row.age_hours<72?'early_provisional':'mature',null,JSON.stringify(Object.fromEntries(Object.entries(row).filter(([k])=>!['id','lesson','age_hours','cohort'].includes(k)))))));
   const history=await env.DB.prepare('SELECT media_id,lesson_id,observed_at,age_hours,window_hours,metrics_json FROM insight_snapshots WHERE window_hours IS NOT NULL AND observed_at>=? ORDER BY observed_at DESC LIMIT 40').bind(now-30*86400).all();
   base.matched_age_observations=history.results.map(r=>({id:r.media_id,...(r.lesson_id?{lesson:r.lesson_id}:{}),captured_at:r.observed_at,age_hours:r.age_hours,window_hours:r.window_hours,...JSON.parse(r.metrics_json)}));
   base.history_status='available';
  }catch{base.history_status='unavailable';}
 }
 return {status:base.failed_media?((base.reels.length+base.early_reels.length)?'partial':'unavailable'):'available',...base};
}
