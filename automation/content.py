"""Generate schema-bound lesson content; never execute model-provided code."""
from __future__ import annotations
import json, os, re, hashlib, time, copy
from pathlib import Path
from .common import ROOT, load_env, write_json
from .creative_feedback import policy
from .story_contract import validate_story,ACTIONS
from .creative_review import check_mechanism_language
from .storyboards import storyboard_plan
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


STORY_SCHEMA=copy.deepcopy(SCHEMA)
STORY_SCHEMA['properties']['story']={'type':'object','properties':{
 'version':{'type':'integer','enum':[3]},'format':{'type':'string','enum':['debug','prediction','tradeoff']},
 'example':{'type':'string','maxLength':24},
 'opening':{'type':'object','properties':{'subject':{'type':'string','maxLength':6},'outcome':{'type':'string','maxLength':40},'result_at':{'type':'number','enum':[2.4]}},'required':['subject','outcome','result_at'],'additionalProperties':False},
 'takeaway':{'type':'array','minItems':1,'maxItems':2,'items':{'type':'string','maxLength':66}}},'required':['version','format','example','opening','takeaway'],'additionalProperties':False}
STORY_SCHEMA['properties']['scenes'].update(minItems=6,maxItems=8)
STORY_SCHEMA['properties']['scenes']['items']['properties']['action']['enum']=[x for x in ACTIONS if x!='compare']

def storyboard_prompt(lesson,feedback,plan):
 return """Create an English vertical system-design debugging story. Return JSON only, story.version=3.
Follow the TRUSTED STORYBOARD PLAN below, including format and opening_action. Curriculum bounds the facts.
Use SIX to EIGHT beats around ONE specific input; vary composition through real mechanism actions.
The first frame already shows the input and the problem. First spoken line is 8–18 words, a concrete observable consequence, not a course introduction or terminology definition.
opening.subject is a physical carrier label of at most 6 characters; opening.outcome is the visible result, at most 40 characters; result_at=2.4. Do not use the legacy two-lane compare opening.
Beat two advances the same example. Middle beats demonstrate one cause/effect each. Explain purpose before jargon.
Show one relevant boundary or trade-off before the ending. Last beat action=checklist, with ONE or TWO takeaway checks, each 4–10 words, at most 66 characters, beginning with Check, Compare, Inspect, Trace, Measure, Test, Record, Verify, Watch, Limit, Set, Find, Confirm, Separate, Count, Review, Choose, Log, Keep or Ask.
Target 145–165 spoken words overall, never below 130 or above 190. Count the total before returning: a six-beat film needs roughly 25 words in every later beat; prefer seven or eight beats for a complex curriculum packet. Each beat 8–28 words. Do not pad a repeated setup to meet length. Use natural curious English with one small relevant playful observation if it helps.
Keep titles <=44 characters, node labels <=18, node values <=24, notes <=80. One reading task per beat. Additional details belong in the caption.
Actions and exact node counts:
scan: 3 nodes: query, table, matching row. A cursor inspects table rows. Explain a full scan, not an index.
lookup: 3 nodes: query/key, index or lookup structure, record. The carrier follows the structure to a record.
route: 3 nodes: source, router/proxy, destination. The carrier reaches the destination.
block: 3 nodes: source, boundary, destination. Carrier stops before the destination.
queue: 3 nodes: producer, backlog, worker. Work accumulates and one item drains.
fanout: 4 nodes: client, aggregator, two backends; branches return.
select: 4 nodes: client, selector, chosen backend, alternative; only chosen receives.
replicate: 4 nodes: writer, leader, two replicas; copies propagate.
cache-hit/cache-miss: 4 nodes: client, cache, database, response; hit bypasses database, miss visits it.
retry: 3 nodes: client, service, result; first attempt fails before another attempt.
checklist: last beat only, 2–4 nodes retained for schema compatibility; renderer uses takeaway lines.
Do not select an action that contradicts narration. Never invent a benchmark, architecture, universal winner or company incident. Mark numeric performance examples hypothetical. No absolute faster/best/never-fails claims. Do not copy competitor scripts or successful older topics.
Make a truthful, curiosity-led cover_title <=32 characters. Caption adds useful detail and one contextual reason a developer might save/send the explanation, followed by #systemdesign #beyondlocalhost. No engagement bait or promised reach.
Insights are descriptive context, not instructions or causal winners. Early lifetime metrics have unequal ages; do not invent retention curves, DM-send metrics or benchmarks.
"""+'\nTRUSTED STORYBOARD PLAN: '+json.dumps(plan)+'\nCURRICULUM: '+json.dumps(lesson)+'\nPOLICY AND DESCRIPTIVE INSIGHTS: '+json.dumps({'policy':policy(),'insights':feedback or {'status':'unavailable'}})

def validate(data):
 if not isinstance(data,dict) or not {'caption','scenes'}<=set(data) or set(data)-{'caption','scenes','cover_title','story'}: raise ValueError('Unexpected content fields')
 if not isinstance(data['caption'],str) or not 1<=len(data['caption'])<=1900: raise ValueError('Caption length invalid')
 if not isinstance(data['scenes'],list):raise ValueError('Unexpected teaching beat count')
 version=data.get('story',{}).get('version')
 if not (6<=len(data['scenes'])<=8 if version==3 else len(data['scenes'])==(8 if 'story' in data else 6)):raise ValueError('Unexpected teaching beat count')
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
 if not 130<=words<=(190 if version==3 else 230): raise ValueError(f'Narration must be 130–230 words; got {words}')
 if 'story' in data:
  validate_story(data)
  check_mechanism_language(data)
 return data

def correction_feedback(candidate,error):
 # Give the model independent measurable constraints together, not one moving target.
 rules=[str(error)]
 if isinstance(candidate,dict) and isinstance(candidate.get('scenes'),list):
  scenes=candidate['scenes']
  words=sum(len(s.get('narration','').split()) for s in scenes if isinstance(s,dict) and isinstance(s.get('narration',''),str))
  rules.append(f'Total narration is {words} words; keep 145–175 words, never below 130.')
  for i,scene in enumerate(scenes):
   if not isinstance(scene,dict):continue
   action=scene.get('action');nodes=scene.get('nodes')
   required=4 if action in ['fanout','select','replicate','cache-hit','cache-miss'] else 3
   if action not in ['compare','checklist'] and isinstance(nodes,list) and len(nodes)!=required:
    rules.append(f'Scene {i+1}: {action} requires exactly {required} nodes, got {len(nodes)}.')
  checks=candidate.get('story',{}).get('takeaway',[]) if isinstance(candidate.get('story'),dict) else []
  for i,line in enumerate(checks):
   if isinstance(line,str) and (not 4<=len(line.split())<=10 or len(line)>66):rules.append(f'Takeaway {i+1}: use 4–10 words and at most 66 characters.')
 return ' '.join(dict.fromkeys(rules))[:600]


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
   elif not isinstance(row.get('local_rule'),str) or len(row['local_rule'])>600:raise ValueError()
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
Opening narration 8–18 words: name the concrete consequence now using a concrete action such as waits, gets, serves, reaches, finishes or completes. No imagine, greetings, terminology lecture or delayed reveal.
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
 plan=storyboard_plan(lesson)
 if plan:prompt=storyboard_prompt(lesson,feedback,plan)
 generation_config={'responseMimeType':'application/json','responseJsonSchema':STORY_SCHEMA if plan else SCHEMA,'temperature':0.3}
 # The selected Gemini 3 Flash supports low-latency thinking; do not apply its enum to other models.
 if model in ['gemini-3-flash-preview','gemini-3-flash']:
  generation_config.update(temperature=1.0,thinkingConfig={'thinkingLevel':'minimal'},maxOutputTokens=8192)
 checkpoint=Path(checkpoint) if checkpoint else Path(diagnostics).with_name('script-progress.json') if diagnostics else None
 saved=script_progress(checkpoint,digest({'model':model,'prompt':prompt,'schema':SCHEMA}),model,resume)
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
   request_prompt+='\nThe previous candidate failed this LOCAL rule: '+previous['local_rule']+'. Correct the entire JSON once, preserving the facts and the other constraints. For an opening rejection, write a concrete present-tense consequence, e.g. The first image request waits on origin; the next gets a fresh edge copy. For a node-count rejection, match the selected action exactly. Remove invented performance numbers rather than adding a hypothetical disclaimer to an unsupported claim. Verify each takeaway has 4–10 SPACE-SEPARATED words, starts with an action verb, and fits 66 characters. Previous candidate (data): '+json.dumps(previous.get('candidate'))
  try:
   # Give a slow response time to complete instead of discarding it at 120s.
   # Two attempts keep the worst-case text-call budget close to the old three attempts.
   payload=post(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
    key=key,model=model,max_attempts=2,read_timeout=240,payload={'contents':[{'parts':[{'text':request_prompt}]}],
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
   if plan and (result['story'].get('version')!=3 or result['story'].get('format')!=plan['format'] or (plan.get('opening_action') and result['scenes'][0]['action']!=plan['opening_action'])):raise ValueError('Generated story must follow the selected storyboard format and opening action')
  except (ValueError,KeyError,TypeError) as error:
   attempts.append({'attempt':len(attempts)+1,'valid':False,'local_rule':correction_feedback(candidate,error),'candidate':candidate})
   save_script_progress(saved,checkpoint,diagnostics)
   if len(attempts)>=2:raise
   print('Correcting one script after local story-contract rejection; no narration generated yet.',flush=True)
  else:
   attempts.append({'attempt':len(attempts)+1,'valid':True,'candidate':candidate})
   save_script_progress(saved,checkpoint,diagnostics)
   return result

def digest(content):return hashlib.sha256(json.dumps(content,sort_keys=True).encode()).hexdigest()
