import {captureDueObservation} from './insight-observations.mjs';
import {creativeFeedback} from './creative-feedback.mjs';
const json = (data, status=200) => new Response(JSON.stringify(data), {status, headers:{'Content-Type':'application/json'}});
export const late = (row, now) => now > row.publish_at + 1800;
export function validLessonId(id) { return /^lesson-(0[1-9]|[1-5][0-9]|60)$/.test(id); }
export function validateResult(body, cloudName) {
  if (!validLessonId(body.lesson_id)) throw new Error('Invalid lesson ID');
  for (const field of ['video_url','cover_url']) {
    const url = new URL(body[field]);
    if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com' || !cloudName || !url.pathname.startsWith(`/${cloudName}/`)) throw new Error('Unexpected media origin');
  }
  const v=body.validation;
  if (!v || !Number.isFinite(v.duration) || !Number.isFinite(v.audio_peak_db) || v.width !==1080 || v.height!==1920 || v.fps!==30 || !v.audio || v.duration<45 || v.duration>105 || v.check_passed!==true || v.audio_peak_db > -0.5) throw new Error('Video validation failed');
  if (!/^[a-f0-9]{64}$/.test(body.content_hash)) throw new Error('Invalid content hash');
  if(![2,3].includes(v.story_contract) || v.creative_review_passed!==true || !Number.isFinite(v.opening_result_seconds) || v.opening_result_seconds>3 || v.opening_result_seconds<0 || !/^[a-f0-9]{64}$/.test(v.creative_review_sha256||'') || !/^[a-f0-9]{64}$/.test(v.rendered_sha256||'')) throw new Error('Rendered story review required');
  if (typeof body.caption!=='string' || body.caption.length>2100) throw new Error('Invalid caption');
}
async function authorized(request, secret) {
  if (!secret) return false;
  const a=request.headers.get('Authorization')||'', b=`Bearer ${secret}`;
  const enc=new TextEncoder(); const dig = async t=>new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(t)));
  const [x,y]=await Promise.all([dig(a),dig(b)]);
  return x.reduce((v,n,i)=>v|(n^y[i]),0)===0;
}
const nowSeconds=()=>Math.floor(Date.now()/1000);
async function audit(env,id,event,detail='') { await env.DB.prepare('INSERT INTO audit(lesson_id,event,at,detail) VALUES (?,?,?,?)').bind(id,event,nowSeconds(),detail.slice(0,500)).run(); }
async function settings(env) {
 const result=await env.DB.prepare('SELECT key,value FROM settings').all();
 return Object.fromEntries(result.results.map(r=>[r.key,r.value==='true']));
}
async function setting(env,key,value) { await env.DB.prepare('INSERT INTO settings VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(key,String(value)).run(); }
async function body(request) {
 if (Number(request.headers.get('Content-Length')||0)>100000) throw new Error('Request too large');
 const raw=await request.text(); if (raw.length>100000) throw new Error('Request too large'); return JSON.parse(raw);
}
function requireEnv(env,names) { for(const name of names) if(!env[name]) throw new Error(`Missing ${name}`); }
export async function meta(env, path, method='GET', params={}) {
 requireEnv(env,['META_ACCESS_TOKEN','IG_USER_ID','GRAPH_API_VERSION']);
 if (!/^v\d+\.\d+$/.test(env.GRAPH_API_VERSION) || !/^\d+$/.test(env.IG_USER_ID)) throw new Error('Invalid Instagram configuration');
 const url=new URL(`https://graph.facebook.com/${env.GRAPH_API_VERSION}/${path}`);
 if(method==='GET') for(const [k,v] of Object.entries(params)) url.searchParams.set(k,v);
 const response=await fetch(url,{method,headers:{Authorization:`Bearer ${env.META_ACCESS_TOKEN}`},
   ...(method==='POST'?{body:new URLSearchParams(params)}:{}),signal:AbortSignal.timeout(12000)});
 const data=await response.json();
 if(!response.ok || data.error) throw new Error(`Meta request failed (${response.status}; code ${data.error?.code||'unknown'})`);
 return data;
}
async function hold(env,row,error) {
 await env.DB.prepare('UPDATE lessons SET state=?,error=? WHERE id=? AND state!=?').bind('HELD',error,row.id,'PUBLISHED').run();
 await audit(env,row.id,'HELD',error);
}
export async function dispatch(env,row,now) {
 requireEnv(env,['GITHUB_TOKEN','CALLBACK_TOKEN','SELF_URL']);
 const token=crypto.randomUUID();
 const claim=await env.DB.prepare(`UPDATE lessons SET state='GENERATING',job_token=?,lease_until=?,attempts=attempts+1,error=NULL WHERE id=? AND state IN ('PLANNED','RETRYABLE_FAILURE') AND attempts<3 AND next_retry_at<=?`).bind(token,now+3000,row.id,now).run();
 if(!claim.meta.changes) return false;
 // A lost dispatch response leaves the lease intact: avoid immediately creating another render.
 try {
  const response=await fetch(`https://api.github.com/repos/${env.GITHUB_REPOSITORY}/actions/workflows/reel-production.yml/dispatches`,{
    method:'POST',headers:{Authorization:`Bearer ${env.GITHUB_TOKEN}`,'Accept':'application/vnd.github+json','User-Agent':'reels-autopilot','Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28'},
    body:JSON.stringify({ref:env.GITHUB_REF||'main',inputs:{lesson_id:row.id,job_token:token,worker_url:env.SELF_URL,dry_run:'false'}}),signal:AbortSignal.timeout(12000)});
  if(!response.ok) {
    await env.DB.prepare("UPDATE lessons SET state='RETRYABLE_FAILURE',next_retry_at=?,error=? WHERE id=? AND job_token=? AND state='GENERATING'").bind(now+900,`GitHub dispatch rejected (${response.status})`,row.id,token).run();
  } else await audit(env,row.id,'DISPATCHED');
 } catch { await audit(env,row.id,'DISPATCH_UNKNOWN'); }
 return true;
}
export async function prepareMedia(env,row,now) {
 const claim=await env.DB.prepare("UPDATE lessons SET state='MEDIA_CREATING',lease_until=? WHERE id=? AND state='READY'").bind(now+120,row.id).run();
 if(!claim.meta.changes) return;
 try {
  const data=await meta(env,`${env.IG_USER_ID}/media`,'POST',{media_type:'REELS',video_url:row.video_url,cover_url:row.cover_url,caption:row.caption,share_to_feed:'true'});
  if(!data.id) throw new Error('No media container returned');
  await env.DB.prepare("UPDATE lessons SET state='MEDIA_PROCESSING',container_id=?,container_created_at=?,lease_until=NULL WHERE id=? AND state='MEDIA_CREATING'").bind(data.id,now,row.id).run();
  await audit(env,row.id,'MEDIA_CREATED');
 } catch { await hold(env,row,'Container creation failed or outcome unknown; inspect before retrying'); }
}
export async function publish(env,row,now) {
 const claim=await env.DB.prepare("UPDATE lessons SET state='PUBLISHING',publish_started_at=?,lease_until=? WHERE id=? AND state='MEDIA_READY'").bind(now,now+120,row.id).run();
 if(!claim.meta.changes) return;
 try {
  const data=await meta(env,`${env.IG_USER_ID}/media_publish`,'POST',{creation_id:row.container_id});
  if(!data.id) throw new Error('No post ID returned');
  await env.DB.prepare("UPDATE lessons SET state='PUBLISHED',post_id=?,published_at=?,lease_until=NULL,error=NULL WHERE id=? AND state='PUBLISHING'").bind(data.id,now,row.id).run();
  await audit(env,row.id,'PUBLISHED');
 } catch {
  await env.DB.prepare("UPDATE lessons SET state='PUBLISH_UNKNOWN',error=? WHERE id=? AND state='PUBLISHING'").bind('Publish result unknown; reconciliation required',row.id).run();
  await audit(env,row.id,'PUBLISH_UNKNOWN');
 }
}
export async function reconcile(env,row,now) {
 // Never send media_publish here. A timeout can conceal a successful post.
 let result;
 try { result=await meta(env,row.container_id,'GET',{fields:'status_code'}); }
 catch { if(late(row,now)) await hold(env,row,'Cannot reconcile publication; inspect before retrying'); return; }
 if(result.status_code==='PUBLISHED') {
  let postId=null;
  try {
   const marker=`[SDCC:${row.id}]`;
   const media=await meta(env,`${env.IG_USER_ID}/media`,'GET',{fields:'id,caption,timestamp',limit:'25'});
   postId=media.data?.find(x=>x.caption?.includes(marker)&&Math.abs(Date.parse(x.timestamp)/1000-row.publish_at)<86400)?.id||null;
  } catch { /* Container confirms publication even if media-list access is unavailable. */ }
  await env.DB.prepare("UPDATE lessons SET state='PUBLISHED',post_id=?,published_at=?,lease_until=NULL,error=? WHERE id=? AND state IN ('PUBLISHING','PUBLISH_UNKNOWN')").bind(postId,now,postId?null:'Container confirms published; post ID needs lookup',row.id).run();
  await audit(env,row.id,'PUBLISH_RECONCILED');
 } else if(late(row,now)) await hold(env,row,'Unknown publication outcome after deadline; do not republish automatically');
}
export async function tick(env,now=nowSeconds()) {
 const enabled=await settings(env);
 if(!enabled.generation_enabled && !enabled.publishing_enabled) return;
 // One ordered release frontier. A failed prerequisite stops later releases.
 const row=await env.DB.prepare("SELECT * FROM lessons WHERE course_id=? AND state!='PUBLISHED' ORDER BY ordinal LIMIT 1").bind(env.COURSE_ID).first();
 if(!row) return;
 if(row.state==='HELD') return;
 if(['PUBLISHING','PUBLISH_UNKNOWN'].includes(row.state)) {
  if(row.state==='PUBLISH_UNKNOWN'||row.lease_until<=now) await reconcile(env,row,now);
  return;
 }
 if(late(row,now)) { await hold(env,row,'Missed publication window'); return; }
 if(row.state==='GENERATING' && row.lease_until<=now) {
  await env.DB.prepare("UPDATE lessons SET state=?,next_retry_at=?,error=? WHERE id=? AND state='GENERATING' AND lease_until<=?").bind(row.attempts>=3?'HELD':'RETRYABLE_FAILURE',now+300,'Generation lease expired',row.id,now).run(); return;
 }
 if(enabled.generation_enabled&&['PLANNED','RETRYABLE_FAILURE'].includes(row.state)&&row.generate_at<=now&&row.next_retry_at<=now) {
  if(row.attempts>=3) await hold(env,row,'Generation attempts exhausted'); else await dispatch(env,row,now); return;
 }
 if(!enabled.publishing_enabled) return;
 if(row.state==='READY' && now>=row.publish_at-1800) await prepareMedia(env,row,now);
 else if(row.state==='MEDIA_CREATING'&&row.lease_until<=now) await hold(env,row,'Container creation interrupted; inspect before retrying');
 else if(row.state==='MEDIA_PROCESSING') {
  const status=await meta(env,row.container_id,'GET',{fields:'status_code'});
  if(status.status_code==='FINISHED') await env.DB.prepare("UPDATE lessons SET state='MEDIA_READY' WHERE id=? AND state='MEDIA_PROCESSING'").bind(row.id).run();
  else if(['ERROR','EXPIRED'].includes(status.status_code)) await hold(env,row,`Media status ${status.status_code}`);
 } else if(row.state==='MEDIA_READY'&&now>=row.publish_at) await publish(env,row,now);
}
async function fetchHandler(request,env) {
 const path=new URL(request.url).pathname;
 if(path==='/health') return json({service:'reels-autopilot',configured:!!env.DB});
 if(path.startsWith('/admin/')) {
  if(!await authorized(request,env.ADMIN_TOKEN)) return json({error:'Unauthorized'},401);
  if(path==='/admin/status'&&request.method==='GET') {
   const rows=await env.DB.prepare('SELECT id,title,publish_at,state,attempts,post_id,error FROM lessons ORDER BY ordinal').all();
   const pilots=await env.DB.prepare('SELECT run_id,lesson_id,completed_at FROM dry_runs ORDER BY completed_at DESC LIMIT 5').all();
   return json({settings:await settings(env),lessons:rows.results,dry_runs:pilots.results});
  }
  if(path==='/admin/pause'&&request.method==='POST') { await setting(env,'generation_enabled',false); await setting(env,'publishing_enabled',false); return json({paused:true}); }
  if(path==='/admin/import'&&request.method==='POST') {
   const rows=await body(request); if(!Array.isArray(rows)||rows.length!==60) throw new Error('Expected all 60 lessons');
   if(await env.DB.prepare('SELECT COUNT(*) AS n FROM lessons').first('n')) throw new Error('Queue already imported');
   const now=nowSeconds(); let previous=0;
   for(let i=0;i<rows.length;i++) {
    const r=rows[i];
    if(!validLessonId(r.id)||r.id!==`lesson-${String(i+1).padStart(2,'0')}`||r.ordinal!==i+1||r.course_id!==env.COURSE_ID||!Number.isInteger(r.publish_at)||r.publish_at<=previous||r.generate_at!==r.publish_at-21600||r.generate_at<=now||typeof r.title!=='string'||r.title.length>150) throw new Error('Invalid course schedule');
    previous=r.publish_at;
   }
   await env.DB.batch(rows.map(r=>env.DB.prepare('INSERT INTO lessons(id,course_id,ordinal,title,publish_at,generate_at) VALUES (?,?,?,?,?,?)').bind(r.id,r.course_id,r.ordinal,r.title,r.publish_at,r.generate_at)));
   return json({imported:rows.length,publishing_enabled:false});
  }
  if(path==='/admin/activate'&&request.method==='POST') {
   requireEnv(env,['GITHUB_TOKEN','CALLBACK_TOKEN','SELF_URL','META_ACCESS_TOKEN','IG_USER_ID','CLOUDINARY_CLOUD_NAME']);
   if(!await env.DB.prepare('SELECT COUNT(*) AS n FROM dry_runs').first('n')) throw new Error('A successful uploaded cloud dry run is required');
   const row=await env.DB.prepare('SELECT generate_at FROM lessons ORDER BY ordinal LIMIT 1').first();
   if(!row||row.generate_at<=nowSeconds()) throw new Error('Import a future course schedule first');
   const account=await meta(env,env.IG_USER_ID,'GET',{fields:'id,username'});
   if(account.username!==(env.INSTAGRAM_USERNAME||'beyond.localhost')) throw new Error('Instagram account does not match the configured channel');
   await setting(env,'generation_enabled',true); await setting(env,'publishing_enabled',true);
   return json({active:true});
  }
 }
 if(path==='/api/creative-feedback'&&request.method==='GET') {
  if(!await authorized(request,env.CALLBACK_TOKEN)) return json({error:'Unauthorized'},401);
  return json(await creativeFeedback(env,meta,nowSeconds()));
 }
 if(path==='/api/result'&&request.method==='POST') {
  if(!await authorized(request,env.CALLBACK_TOKEN)) return json({error:'Unauthorized'},401);
  const data=await body(request); const now=nowSeconds();
  if(data.dry_run===true) {
   validateResult(data,env.CLOUDINARY_CLOUD_NAME);
   if(!/^[0-9]+$/.test(String(data.run_id))) throw new Error('Invalid cloud run ID');
   await env.DB.prepare('INSERT OR IGNORE INTO dry_runs VALUES (?,?,?,?,?)').bind(String(data.run_id),data.lesson_id,data.video_url,JSON.stringify(data.validation),now).run();
   return json({dry_run_saved:true});
  }
  if(!validLessonId(data.lesson_id)) throw new Error('Invalid lesson ID');
  const row=await env.DB.prepare('SELECT * FROM lessons WHERE id=?').bind(data.lesson_id).first();
  if(!row||row.job_token!==data.job_token) return json({error:'Stale generation claim'},409);
  if(row.state!=='GENERATING') return json({ignored:true,state:row.state});
  if(row.lease_until<=now) return json({error:'Generation claim expired'},409);
  if(data.error) {
   // Respect a provider's daily reset/long cooldown instead of starting more jobs.
   const retryAt=Number.isSafeInteger(data.retry_at)?Math.max(now+900,Math.min(data.retry_at,now+172800)):now+900;
   await env.DB.prepare("UPDATE lessons SET state=?,next_retry_at=?,error=? WHERE id=? AND state='GENERATING' AND job_token=?").bind(row.attempts>=3?'HELD':'RETRYABLE_FAILURE',retryAt,'Production failed; inspect GitHub run logs',row.id,row.job_token).run();
  } else {
   validateResult(data,env.CLOUDINARY_CLOUD_NAME);
   const caption=`${data.caption}\n\n[SDCC:${row.id}]`;
   await env.DB.prepare("UPDATE lessons SET state='READY',video_url=?,cover_url=?,content_hash=?,validation_json=?,caption=?,lease_until=NULL WHERE id=? AND state='GENERATING' AND job_token=?").bind(data.video_url,data.cover_url,data.content_hash,JSON.stringify(data.validation),caption,row.id,row.job_token).run();
   await audit(env,row.id,'READY');
  }
  return json({accepted:true});
 }
 return json({error:'Not found'},404);
}
export default {
 async fetch(request,env) { try{return await fetchHandler(request,env);}catch(error){return json({error:String(error.message).slice(0,180)},400);} },
 async scheduled(event,env,ctx) { ctx.waitUntil(Promise.all([tick(env).catch(()=>console.error('Scheduler step failed; persisted state will be reconciled on a later tick')),captureDueObservation(env,meta,nowSeconds()).catch(()=>console.error('Insights observation unavailable; publishing state unchanged'))])); }
};
