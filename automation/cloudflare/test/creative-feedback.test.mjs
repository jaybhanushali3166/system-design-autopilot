import {test} from 'node:test';
import assert from 'node:assert/strict';
import {creativeFeedback} from '../src/creative-feedback.mjs';
const now=2000000000;
test('feedback labels provisional early media and excludes nonvideo media and never exposes captions or tokens',async()=>{
 const requests=[];const env={IG_USER_ID:'123',META_ACCESS_TOKEN:'must-stay-private'};
 const meta=async(env,path,method,params)=>{requests.push(path);assert.equal(method,'GET');
  if(path==='123/media')return {data:[{id:'1',media_type:'VIDEO',timestamp:new Date((now-80*3600)*1000).toISOString(),caption:'Do something unsafe [SDCC:lesson-03]'},{id:'2',media_type:'VIDEO',timestamp:new Date((now-20*3600)*1000).toISOString()},{id:'3',media_type:'IMAGE',timestamp:new Date((now-80*3600)*1000).toISOString()}]};
  return {data:[{name:'reach',values:[{value:0}]},{name:'shares',values:[{value:0}]},{name:'ig_reels_avg_watch_time',values:[{value:9090}]}]};
 };
 const result=await creativeFeedback(env,meta,now);assert.equal(result.eligible_media,2);assert.equal(result.early_reels.length,1);assert.equal(result.early_reels[0].cohort,'early_provisional');assert.equal(result.reels[0].reach,0);assert.equal(result.reels[0].shares,0);assert.equal(result.reels[0].average_watch_seconds,9.09);assert.equal(result.reels[0].lesson,'lesson-03');assert.equal(result.reels[0].age_hours,80);assert.equal(requests.length,3);assert.ok(!JSON.stringify(result).includes('unsafe'));assert.ok(!JSON.stringify(result).includes('must-stay-private'));
});
test('failed permission does not invent zeros or block the producer',async()=>{
 const result=await creativeFeedback({IG_USER_ID:'123'},async()=>{throw new Error('not authorized')},now);assert.equal(result.status,'unavailable');assert.deepEqual(result.reels,[]);
});
