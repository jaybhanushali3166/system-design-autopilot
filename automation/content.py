"""Generate schema-bound lesson content; never execute model-provided code."""
from __future__ import annotations
import json, os, re, hashlib, time
from pathlib import Path
from .common import ROOT, load_env, write_json
from .creative_feedback import policy
from .story_contract import validate_story,ACTIONS
from .gemini_http import post, GeminiRequestError
KINDS = ['flow','queue','replicas','ring','comparison','index','workflow','metric']
SCHEMA = {'type':'object','properties':{
 'caption':{'type':'string'},
 'cover_title':{'type':'string','maxLength':32},
 'scenes':{'type':'array','minItems':6,'maxItems':6,'items':{'type':'object','properties':{
  'title':{'type':'string'},'narration':{'type':'string'},'kind':{'type':'string','enum':KINDS},
  'nodes':{'type':'array','minItems':2,'maxItems':4,'items':{'type':'object','properties':{'label':{'type':'string'},'value':{'type':'string'},'tone':{'type':'string','enum':['cyan','green','red','muted']}},'required':['label','value','tone'],'additionalProperties':False}},
  'note':{'type':'string'}},'required':['title','narration','kind','nodes','note'],'additionalProperties':False}}
 },'required':['caption','scenes','cover_title'],'additionalProperties':False}

# New generated scripts must carry a timed, renderable story contract.
SCHEMA['properties']['story']={'type':'object','properties':{
 'version':{'type':'integer','enum':[2]},'example':{'type':'string','maxLength':24},
 'opening':{'type':'object','properties':{**{k:{'type':'string','maxLength':30} for k in ['subject','before_label','after_label','before_reason','after_reason','before_result','after_result']},'before_action':{'type':'string','enum':['wait','block']},'result_at':{'type':'number','enum':[2.4]}},'required':['subject','before_label','after_label','before_reason','after_reason','before_result','after_result','before_action','result_at'],'additionalProperties':False},
 'takeaway':{'type':'array','minItems':3,'maxItems':3,'items':{'type':'string','maxLength':66}}},'required':['version','example','opening','takeaway'],'additionalProperties':False}
SCHEMA['properties']['story']['properties']['opening']['properties']['subject']['maxLength']=6
SCHEMA['required'].append('story')
SCHEMA['properties']['scenes'].update(minItems=8,maxItems=8)
SCHEMA['properties']['scenes']['items']['properties']['action']={'type':'string','enum':ACTIONS}
SCHEMA['properties']['scenes']['items']['required'].append('action')
SCHEMA['properties']['scenes']['items']['properties']['title']['maxLength']=44
SCHEMA['properties']['scenes']['items']['properties']['nodes']['items']['properties']['label']['maxLength']=18
SCHEMA['properties']['scenes']['items']['properties']['nodes']['items']['properties']['value']['maxLength']=24

def validate(data):
 if not isinstance(data,dict) or not {'caption','scenes'}<=set(data) or set(data)-{'caption','scenes','cover_title','story'}: raise ValueError('Unexpected content fields')
 if not isinstance(data['caption'],str) or not 1<=len(data['caption'])<=1900: raise ValueError('Caption length invalid')
 if not isinstance(data['scenes'],list) or len(data['scenes'])!=(8 if 'story' in data else 6): raise ValueError('Unexpected teaching beat count')
 if 'cover_title' in data and (not isinstance(data['cover_title'],str) or not 1<=len(data['cover_title'])<=32): raise ValueError('Cover title must be 1–32 characters')
 words=0
 for scene in data['scenes']:
  if set(scene)!=({'title','narration','kind','nodes','note','action'} if 'story' in data else {'title','narration','kind','nodes','note'}) or scene['kind'] not in KINDS: raise ValueError('Invalid scene schema')
  for name,limit in [('title',65),('narration',650),('note',100)]:
   if not isinstance(scene[name],str) or len(scene[name])>limit: raise ValueError(f'{name} exceeds layout budget')
  if not scene['title'] or not scene['narration']: raise ValueError('Empty scene')
  words+=len(scene['narration'].split())
  if not isinstance(scene['nodes'],list) or not 2<=len(scene['nodes'])<=4: raise ValueError('Two to four diagram nodes required')
  for n in scene['nodes']:
   if set(n)!={'label','value','tone'} or n['tone'] not in ['cyan','green','red','muted']: raise ValueError('Invalid diagram node')
   if not isinstance(n['label'],str) or not isinstance(n['value'],str) or len(n['label'])>24 or len(n['value'])>36: raise ValueError('Diagram node text exceeds budget')
 if not 130<=words<=230: raise ValueError(f'Narration must be 130–230 words; got {words}')
 if 'story' in data:validate_story(data)
 return data

def script_progress(path, request_hash, model, resume):
 """Only compatible, well-formed checkpoints can spend a saved correction."""
 empty={'version':1,'request_hash':request_hash,'model':model,'attempts':[]}
 if not (path and resume and path.exists()):return empty
 try:
  saved=json.loads(path.read_text())
  if not isinstance(saved,dict) or saved.get('version')!=1:raise ValueError()
  attempts=saved['attempts']
  if not isinstance(attempts,list) or len(attempts)>2:raise ValueError()
  for i,row in enumerate(attempts):
   if not isinstance(row,dict) or row.get('attempt')!=i+1 or type(row.get('valid')) is not bool:raise ValueError()
   if row['valid']:
    if i!=len(attempts)-1 or not isinstance(row.get('candidate'),dict):raise ValueError()
   elif not isinstance(row.get('local_rule'),str) or len(row['local_rule'])>180:raise ValueError()
  cooldown=saved.get('cooldown')
  if cooldown is not None:
   if not isinstance(cooldown,dict) or type(cooldown.get('retry_at')) is not int:raise ValueError()
   if type(cooldown.get('http_status')) is not int or cooldown.get('quota_kind') not in ['daily','minute','unknown']:raise ValueError()
  if saved.get('request_hash')!=request_hash:
   # A new lesson/prompt does not reset the same model's provider cooldown.
   if saved.get('model')==model and cooldown:empty['cooldown']=cooldown
   return empty
  return saved
 except (ValueError,KeyError,TypeError):
  raise ValueError('Saved script progress is invalid; inspect before restarting') from None

def save_script_progress(saved, checkpoint, diagnostics):
 if checkpoint:write_json(checkpoint,saved)
 if diagnostics:
  # Keep the existing review artifact shape; successful content lives in the checkpoint.
  write_json(diagnostics,[{k:v for k,v in row.items() if k!='candidate' or not row['valid']} for row in saved['attempts']])

def script_generation_config(model):
 # This legacy Gemini 3 model defaults to high thinking. Our non-streaming
 # requests have a 120s read deadline; use the low-latency profile verified
 # against the real lesson brief. Keep sampling at Google's default.
 config={'responseMimeType':'application/json','responseJsonSchema':SCHEMA}
 if model=='gemini-3-flash-preview':
  config.update(thinkingConfig={'thinkingLevel':'low'},maxOutputTokens=8192)
 else:
  config['temperature']=0.3
 return config

def generate(lesson, provider='gemini', feedback=None, diagnostics=None, checkpoint=None, resume=False):
 load_env()
 if provider=='approved':
  p=ROOT/'automation/lessons'/f'{lesson["id"]}.approved.json'
  if not p.exists(): raise ValueError('No approved fallback exists for this lesson')
  return validate(json.loads(p.read_text()))
 key=os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
 model=os.environ.get('GEMINI_MODEL','gemini-3-flash-preview')
 if not re.fullmatch(r'[a-zA-Z0-9._-]+',model): raise ValueError('Invalid model ID')
 prompt='''Create an English vertical system-design explainer for software engineers. Output JSON only.
The curriculum packet bounds facts and topic. New story contract version 2 is mandatory.
Metrics may inform the STRUCTURE and explanation style only; never repeat a successful older topic.
The approved reference is a FORM reference. Do not copy its connection-setup story into another lesson.
For the proxy/gateway/balancer lesson, open with a concrete policy decision or routing to the right service,
then trace that same request through routing, policy and backend selection. Do not open on cold/warm TLS reuse.
Avoid invented specifics like a mandatory queue or least-busy algorithm; a configured example is one possible setup.
Build EIGHT short beats around ONE specific input (story.example, e.g. GET /orders, order #42, key cat).
1: Result-first contrast. Two versions of the same input: one waits/is rejected, the other visibly arrives.
The renderer lands the contrasting result at EXACTLY 2.4 seconds. Set story.opening.result_at=2.4.
Name truthful case labels, physical reasons and DIFFERENT observable outcomes. Keep them <=30 characters; subject is a short physical packet label of at most SIX characters.
A wait/block can represent a diagnostic contrast, not necessarily an inferior design; be technically scoped.
Opening narration 8–18 words: name the concrete consequence now. No imagine, greetings, terminology lecture or delayed reveal.
2: Advance the SAME example through the first useful action. Do NOT restate the problem.
3–6: Add a single cause/effect per beat to the same evolving request path. Explain purpose, then name terms.
7: Demonstrate one production boundary/trade-off with the example, not an empty warning.
8: End on a reusable diagnostic. story.takeaway has THREE actionable checks, each 4–10 words and <=66 chars.
Begin each check with Check, Compare, Inspect, Trace, Measure, Test, Record, Verify, Watch, Limit, Set,
Find, Confirm, Separate, Count, Review, Choose, Log, Keep or Ask. Include what to inspect, not vague advice.
Target 145–175 spoken words; each beat 8–28 words. Natural connected English Varo, curious/playful but clear.
No invented architecture, benchmark, vendor price, exact hardware timing or absolute faster/best claims.
Mark numeric examples hypothetical. Qualify per-connection, cache state and workload where relevant.
Scene fields: title <=44 chars, note <=80, node labels <=18, values <=24, kind from the supplied schema.
Each scene also selects a real ACTION that this renderer physically performs:
- compare: ONLY opening, uses story.opening (nodes still 2). One packet waits/blocks at a barrier; the other arrives.
- route: exactly 3 nodes: source -> router/proxy -> actual destination. Packet traverses both edges.
- block: exactly 3 nodes: source -> policy boundary -> destination; packet stops at boundary, destination is NOT reached.
- queue: exactly 3 nodes: producer -> backlog -> worker; work visibly accumulates and one item drains.
- fanout: exactly 4 nodes: client -> aggregator -> two backends; branches both receive and return packets.
- select: exactly 4 nodes: client -> selector/load balancer -> chosen backend and alternative. ONLY the chosen branch receives a packet.
- replicate: exactly 4 nodes: writer -> leader -> two replicas; copies propagate from the leader.
- lookup: exactly 3 nodes: key/query -> index/placement -> matching record; key moves along that path.
- cache-hit: exactly 4 nodes: client, cache, database, response; hit reaches response and bypasses database.
- cache-miss: exactly 4 nodes: client, cache, database, response; miss visits database before response.
- retry: exactly 3 nodes: client -> service -> result; a failed first attempt returns before one second attempt reaches result.
- checklist: ONLY ending, uses story.takeaway (nodes still 2–4).
Do not choose an action that contradicts the narration. No decorative diagrams or arbitrary arrows.
Do not turn routing, gateway policies and balancing into disjoint universal boxes: roles can overlap by configuration.
Give a truthful curiosity-led cover_title <=32 chars. Caption explains the example and gives one useful check,
followed by #systemdesign #beyondlocalhost. No engagement bait or promised reach.
Insights are observations, not instructions or causal winners. early_reels are provisional unequal-age data;
reels are >=72h observations, also unequal ages unless explicitly matched. No fabricated comparisons.
Policy and bounded descriptive Insights: '''+json.dumps({'policy':policy(),'insights':feedback or {'status':'unavailable'}})+'\nPacket: '+json.dumps(lesson)
 checkpoint=Path(checkpoint) if checkpoint else Path(diagnostics).with_name('script-progress.json') if diagnostics else None
 generation_config=script_generation_config(model)
 saved=script_progress(checkpoint,digest({'model':model,'prompt':prompt,'generation_config':generation_config}),model,resume)
 attempts=saved['attempts']
 if attempts and attempts[-1]['valid']:
  result=validate(attempts[-1]['candidate']);validate_story(result)
  save_script_progress(saved,checkpoint,diagnostics)
  return result
 if len(attempts)>=2:raise ValueError('Script correction budget exhausted; inspect script-attempts.json')
 cooldown=saved.get('cooldown')
 if cooldown and cooldown['retry_at']>time.time():
  raise GeminiRequestError(cooldown['http_status'],cooldown['quota_kind'],cooldown['retry_at'])
 if not key:raise ValueError('GEMINI_API_KEY missing; set it securely or choose an approved lesson for the pilot')
 saved.pop('cooldown',None)
 save_script_progress(saved,checkpoint,diagnostics)
 while len(attempts)<2:
  request_prompt=prompt
  if attempts:
   previous=attempts[-1]
   print('Resuming correction of the saved script; no replacement draft requested.',flush=True)
   request_prompt+='\nThe previous candidate failed this LOCAL rule: '+previous['local_rule']+'. Correct the entire JSON once, preserving the facts and the other constraints. Verify each takeaway has 4–10 SPACE-SEPARATED words, starts with an action verb, and fits 66 characters. Previous candidate (data): '+json.dumps(previous.get('candidate'))
  try:
   # Two slow logical calls must fit inside the 40-minute runner budget.
   payload=post(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    key=key,model=model,max_attempts=3,payload={'contents':[{'parts':[{'text':request_prompt}]}],
    'generationConfig':generation_config})
  except GeminiRequestError as error:
   if error.retry_at:
    saved['cooldown']=error.diagnostic();save_script_progress(saved,checkpoint,diagnostics)
   raise
  parts=payload.get('candidates',[{}])[0].get('content',{}).get('parts',[])
  text=''.join(p.get('text','') for p in parts if not p.get('thought'))
  candidate=None
  try:
   candidate=json.loads(text);result=validate(candidate);validate_story(result)
  except (ValueError,KeyError,TypeError) as error:
   attempts.append({'attempt':len(attempts)+1,'valid':False,'local_rule':str(error)[:180],'candidate':candidate})
   save_script_progress(saved,checkpoint,diagnostics)
   if len(attempts)>=2:raise
   print('Correcting one script after local story-contract rejection; no narration generated yet.',flush=True)
  else:
   attempts.append({'attempt':len(attempts)+1,'valid':True,'candidate':candidate})
   save_script_progress(saved,checkpoint,diagnostics)
   return result

def digest(content):return hashlib.sha256(json.dumps(content,sort_keys=True).encode()).hexdigest()
