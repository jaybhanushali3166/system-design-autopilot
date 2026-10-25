import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import worker,{dispatch,publish,reconcile,tick,validateResult} from '../src/worker.mjs';
function environment(){
 const db=new DatabaseSync(':memory:');db.exec(readFileSync(new URL('../migrations/0001_initial.sql',import.meta.url),'utf8'));
 return {DB:{prepare(sql){let args=[];return {bind(...values){args=values;return this;},async run(){return {meta:{changes:db.prepare(sql).run(...args).changes}};},async first(field){const r=db.prepare(sql).get(...args);return field?r?.[field]:r||null;},async all(){return {results:db.prepare(sql).all(...args)};}};}},db,
 COURSE_ID:'system-design-crash-course-v1',GITHUB_REPOSITORY:'example/course',GITHUB_TOKEN:'test-github',CALLBACK_TOKEN:'test-callback',ADMIN_TOKEN:'test-admin',SELF_URL:'https://example.workers.dev',META_ACCESS_TOKEN:'test-meta',IG_USER_ID:'123',GRAPH_API_VERSION:'v24.0',CLOUDINARY_CLOUD_NAME:'demo'};
}
function insert(env, state='PLANNED'){
 const now=Math.floor(Date.now()/1000);
 env.db.prepare('INSERT INTO lessons(id,course_id,ordinal,title,publish_at,generate_at,state,job_token,lease_until,container_id,caption) VALUES (?,?,?,?,?,?,?,?,?,?,?)').run('lesson-01',env.COURSE_ID,1,'Requirements',now,now-21600,state,'current-token',now+100,'container-1','Teaching [SDCC:lesson-01]');
 return env.db.prepare('SELECT * FROM lessons').get();
}
const sample={lesson_id:'lesson-01',job_token:'current-token',video_url:'https://res.cloudinary.com/demo/video/upload/a.mp4',cover_url:'https://res.cloudinary.com/demo/image/upload/a.png',caption:'Example',content_hash:'a'.repeat(64),validation:{width:1080,height:1920,fps:30,audio:true,duration:75,check_passed:true,audio_peak_db:-2}};
const request=(payload,token='test-callback')=>new Request('https://example.workers.dev/api/result',{method:'POST',headers:{Authorization:`Bearer ${token}`},body:JSON.stringify(payload)});
test('inactive deployment never dispatches or publishes',async()=>{
 const env=environment();insert(env);const saved=globalThis.fetch;globalThis.fetch=()=>{throw new Error('Unexpected network');};
 try{await tick(env);assert.equal(env.db.prepare('SELECT state FROM lessons').get().state,'PLANNED');}finally{globalThis.fetch=saved;}
});
test('overlapping generation ticks dispatch exactly one job',async()=>{
 const env=environment(),row=insert(env),saved=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;return new Response(null,{status:204});};
 try{await Promise.all([dispatch(env,row,row.publish_at),dispatch(env,row,row.publish_at)]);assert.equal(calls,1);assert.equal(env.db.prepare('SELECT attempts FROM lessons').get().attempts,1);}finally{globalThis.fetch=saved;}
});
test('overlapping publish attempts send one request',async()=>{
 const env=environment(),row=insert(env,'MEDIA_READY'),saved=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;return Response.json({id:'post-1'});};
 try{await Promise.all([publish(env,row,row.publish_at),publish(env,row,row.publish_at)]);assert.equal(calls,1);assert.equal(env.db.prepare('SELECT post_id FROM lessons').get().post_id,'post-1');}finally{globalThis.fetch=saved;}
});
test('lost publish response reconciles without a second publish',async()=>{
 const env=environment(),row=insert(env,'MEDIA_READY'),saved=globalThis.fetch;let publishes=0;
 globalThis.fetch=async(url,options)=>{
  if(options.method==='POST'){publishes++;throw new Error('Connection lost after remote success');}
  if(String(url).includes('container-1'))return Response.json({status_code:'PUBLISHED'});
  return Response.json({data:[{id:'post-recovered',caption:'Teaching [SDCC:lesson-01]',timestamp:new Date(row.publish_at*1000).toISOString()}]});
 };
 try{
  await publish(env,row,row.publish_at);assert.equal(env.db.prepare('SELECT state FROM lessons').get().state,'PUBLISH_UNKNOWN');
  await reconcile(env,env.db.prepare('SELECT * FROM lessons').get(),row.publish_at+60);
  assert.equal(publishes,1);assert.equal(env.db.prepare('SELECT post_id FROM lessons').get().post_id,'post-recovered');
 }finally{globalThis.fetch=saved;}
});
test('late jobs are held and do not publish',async()=>{
 const env=environment(),row=insert(env,'MEDIA_READY');env.db.exec("UPDATE settings SET value='true'");
 await tick(env,row.publish_at+1801);assert.equal(env.db.prepare('SELECT state FROM lessons').get().state,'HELD');
});
test('stale generation callback cannot overwrite a current claim',async()=>{
 const env=environment();insert(env,'GENERATING');const res=await worker.fetch(request({...sample,job_token:'old-token'}),env);
 assert.equal(res.status,409);assert.equal(env.db.prepare('SELECT state FROM lessons').get().state,'GENERATING');
});
test('duplicate completed callback is harmless',async()=>{
 const env=environment();insert(env,'GENERATING');
 assert.equal((await worker.fetch(request(sample),env)).status,200);
 assert.equal((await worker.fetch(request(sample),env)).status,200);
 assert.equal(env.db.prepare('SELECT state FROM lessons').get().state,'READY');
 assert.equal(env.db.prepare('SELECT COUNT(*) AS n FROM audit').get().n,1);
});
test('callbacks require authentication and owned media',async()=>{
 const env=environment();insert(env,'GENERATING');assert.equal((await worker.fetch(request(sample,'wrong'),env)).status,401);
 assert.throws(()=>validateResult({...sample,video_url:'https://evil.example/movie.mp4'},'demo'));
 assert.throws(()=>validateResult({...sample,validation:{...sample.validation,audio:false}},'demo'));
});
test('activation requires a successful cloud pilot and a future schedule',async()=>{
 const env=environment();insert(env);
 const req=new Request('https://example.workers.dev/admin/activate',{method:'POST',headers:{Authorization:'Bearer test-admin'}});
 assert.equal((await worker.fetch(req,env)).status,400);
 assert.equal(env.db.prepare("SELECT value FROM settings WHERE key='publishing_enabled'").get().value,'false');
});
test('missing numeric validation evidence is rejected',()=>{
 const bad={...sample,validation:{...sample.validation}};delete bad.validation.audio_peak_db;
 assert.throws(()=>validateResult(bad,'demo'));
});
test('unreachable reconciliation is held after the deadline without republishing',async()=>{
 const env=environment(),row=insert(env,'PUBLISH_UNKNOWN'),saved=globalThis.fetch;let calls=0;
 globalThis.fetch=async(url,options)=>{assert.equal(options.method,'GET');calls++;throw new Error('API unavailable');};
 try{await reconcile(env,row,row.publish_at+1801);assert.equal(calls,1);assert.equal(env.db.prepare('SELECT state FROM lessons').get().state,'HELD');}finally{globalThis.fetch=saved;}
});
test('provider cooldown prevents another generation dispatch before retry time',async()=>{
 const env=environment(),row=insert(env,'GENERATING'),saved=globalThis.fetch;
 const now=Math.floor(Date.now()/1000),retryAt=now+3600;
 env.db.prepare('UPDATE lessons SET publish_at=?,generate_at=?').run(now+21600,now-60);
 env.db.exec("UPDATE settings SET value='true'");
 const res=await worker.fetch(request({...sample,error:true,retry_at:retryAt}),env);
 assert.equal(res.status,200);
 assert.equal(env.db.prepare('SELECT next_retry_at FROM lessons').get().next_retry_at,retryAt);
 let calls=0;globalThis.fetch=async()=>{calls++;return new Response(null,{status:204});};
 try{
  await tick(env,retryAt-1);assert.equal(calls,0);
  await tick(env,retryAt);assert.equal(calls,1);
 }finally{globalThis.fetch=saved;}
});
test('callback cooldown is bounded and cannot replace a stale claim',async()=>{
 const env=environment();insert(env,'GENERATING');
 const now=Math.floor(Date.now()/1000);
 await worker.fetch(request({...sample,error:true,retry_at:Number.MAX_SAFE_INTEGER}),env);
 const retry=env.db.prepare('SELECT next_retry_at FROM lessons').get().next_retry_at;
 assert.ok(retry>=now+172800&&retry<=now+172802);
 const res=await worker.fetch(request({...sample,job_token:'stale',error:true,retry_at:now+10}),env);
 assert.equal(res.status,409);
 assert.equal(env.db.prepare('SELECT next_retry_at FROM lessons').get().next_retry_at,retry);
});

test('creative feedback requires the producer credential',async()=>{
 const env=environment();const res=await worker.fetch(new Request('https://example.workers.dev/api/creative-feedback'),env);assert.equal(res.status,401);
});
