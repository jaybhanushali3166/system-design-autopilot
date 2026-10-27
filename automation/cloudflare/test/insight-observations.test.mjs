import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {captureDueObservation} from '../src/insight-observations.mjs';
import {creativeFeedback} from '../src/creative-feedback.mjs';
const now=2000000000;
function env(){
 const db=new DatabaseSync(':memory:');for(const file of ['0001_initial.sql','0002_insight_observations.sql'])db.exec(readFileSync(new URL('../migrations/'+file,import.meta.url),'utf8'));
 const DB={prepare(sql){let args=[];return {bind(...v){args=v;return this;},async run(){return {meta:{changes:db.prepare(sql).run(...args).changes}};},async first(){return db.prepare(sql).get(...args)||null;},async all(){return {results:db.prepare(sql).all(...args)};}};},async batch(statements){const out=[];db.exec('BEGIN');try{for(const s of statements)out.push(await s.run());db.exec('COMMIT');return out;}catch(e){db.exec('ROLLBACK');throw e;}}};
 db.prepare('INSERT INTO lessons(id,course_id,ordinal,title,publish_at,generate_at,state,post_id,published_at) VALUES(?,?,?,?,?,?,?,?,?)').run('lesson-06','course',6,'Connection reuse',now-86400,now-108000,'PUBLISHED','123',now-86400);
 return {DB,db,COURSE_ID:'course',IG_USER_ID:'999'};
}
const success=async(env,path)=>path==='123'?{timestamp:new Date((now-86400)*1000).toISOString()}:{data:[{name:'reach',values:[{value:100}]},{name:'saved',values:[{value:0}]}]};
test('a 24-hour observation is claimed once during overlapping ticks',async()=>{
 const e=env();let calls=0;const meta=async(...args)=>{calls++;return success(...args)};
 const results=await Promise.all([captureDueObservation(e,meta,now),captureDueObservation(e,meta,now)]);
 assert.equal(results.filter(r=>r.sampled).length,1);assert.equal(calls,2);
 const record=e.db.prepare('SELECT * FROM insight_snapshots').get();assert.equal(record.window_hours,24);assert.equal(record.age_hours,24);assert.equal(record.cohort,'early_provisional');assert.equal(JSON.parse(record.metrics_json).saved,0);
 assert.equal(e.db.prepare('SELECT state FROM lessons').get().state,'PUBLISHED');
 assert.equal((await captureDueObservation(e,meta,now+60)).sampled,false);assert.equal(calls,2);
});
test('a missed comparison window is never backfilled with a lifetime total',async()=>{
 const e=env();e.db.prepare('UPDATE lessons SET published_at=?').run(now-30*3600);
 const result=await captureDueObservation(e,()=>{throw new Error('No network expected')},now);assert.equal(result.sampled,false);assert.equal(e.db.prepare('SELECT COUNT(*) n FROM insight_snapshots').get().n,0);
});
test('observation failure backs off independently of publication',async()=>{
 const e=env();let calls=0;const fail=async()=>{calls++;throw new Error('permission unavailable')};
 assert.equal((await captureDueObservation(e,fail,now)).unavailable,true);assert.equal(e.db.prepare('SELECT state FROM lessons').get().state,'PUBLISHED');
 await captureDueObservation(e,fail,now+60);assert.equal(calls,1);
 await captureDueObservation(e,success,now+301);assert.equal(e.db.prepare('SELECT state FROM insight_windows').get().state,'COMPLETE');
});
test('feedback preserves actual observations while separating provisional data',async()=>{
 const e=env();await captureDueObservation(e,success,now);
 const meta=async(env,path)=>path==='999/media'?{data:[{id:'123',media_type:'VIDEO',timestamp:new Date((now-18*3600)*1000).toISOString(),caption:'untrusted text [SDCC:lesson-06]'}]}:{data:[{name:'views',values:[{value:150}]}]};
 const result=await creativeFeedback(e,meta,now+60);assert.equal(result.early_reels.length,1);assert.equal(result.reels.length,0);assert.equal(result.matched_age_observations[0].window_hours,24);assert.equal(result.matched_age_observations[0].age_hours,24);assert.ok(!JSON.stringify(result).includes('untrusted'));
});
test('72-hour and seven-day observations preserve their own real age windows',async()=>{
 for(const hours of [72,168]){
  const e=env();const published=now-hours*3600;e.db.prepare('UPDATE lessons SET published_at=?').run(published);
  const meta=async(env,path)=>path==='123'?{timestamp:new Date(published*1000).toISOString()}:{data:[{name:'views',values:[{value:120}]}]};
  const result=await captureDueObservation(e,meta,now);assert.equal(result.window_hours,hours);
  const row=e.db.prepare('SELECT * FROM insight_snapshots').get();assert.equal(row.age_hours,hours);assert.equal(row.window_hours,hours);assert.equal(row.cohort,'mature');
 }
});
