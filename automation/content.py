"""Generate schema-bound lesson content; never execute model-provided code."""
from __future__ import annotations
import json, os, re, hashlib
from .common import ROOT, load_env
from .gemini_http import post
KINDS = ['flow','queue','replicas','ring','comparison','index','workflow','metric']
SCHEMA = {'type':'object','properties':{
 'caption':{'type':'string'},
 'scenes':{'type':'array','minItems':6,'maxItems':6,'items':{'type':'object','properties':{
  'title':{'type':'string'},'narration':{'type':'string'},'kind':{'type':'string','enum':KINDS},
  'nodes':{'type':'array','minItems':2,'maxItems':4,'items':{'type':'object','properties':{'label':{'type':'string'},'value':{'type':'string'},'tone':{'type':'string','enum':['cyan','green','red','muted']}},'required':['label','value','tone'],'additionalProperties':False}},
  'note':{'type':'string'}},'required':['title','narration','kind','nodes','note'],'additionalProperties':False}}
 },'required':['caption','scenes'],'additionalProperties':False}

def validate(data):
 if not isinstance(data,dict) or set(data)!={'caption','scenes'}: raise ValueError('Unexpected content fields')
 if not isinstance(data['caption'],str) or not 1<=len(data['caption'])<=1900: raise ValueError('Caption length invalid')
 if not isinstance(data['scenes'],list) or len(data['scenes'])!=6: raise ValueError('Exactly six teaching beats required')
 words=0
 for scene in data['scenes']:
  if set(scene)!={'title','narration','kind','nodes','note'} or scene['kind'] not in KINDS: raise ValueError('Invalid scene schema')
  for name,limit in [('title',65),('narration',650),('note',100)]:
   if not isinstance(scene[name],str) or len(scene[name])>limit: raise ValueError(f'{name} exceeds layout budget')
  if not scene['title'] or not scene['narration']: raise ValueError('Empty scene')
  words+=len(scene['narration'].split())
  if not isinstance(scene['nodes'],list) or not 2<=len(scene['nodes'])<=4: raise ValueError('Two to four diagram nodes required')
  for n in scene['nodes']:
   if set(n)!={'label','value','tone'} or n['tone'] not in ['cyan','green','red','muted']: raise ValueError('Invalid diagram node')
   if not isinstance(n['label'],str) or not isinstance(n['value'],str) or len(n['label'])>24 or len(n['value'])>36: raise ValueError('Diagram node text exceeds budget')
 if not 130<=words<=230: raise ValueError(f'Narration must be 130–230 words; got {words}')
 return data

def generate(lesson, provider='gemini'):
 load_env()
 if provider=='approved':
  p=ROOT/'automation/lessons'/f'{lesson["id"]}.approved.json'
  if not p.exists(): raise ValueError('No approved fallback exists for this lesson')
  return validate(json.loads(p.read_text()))
 key=os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
 if not key: raise ValueError('GEMINI_API_KEY missing; set it securely or choose an approved lesson for the pilot')
 model=os.environ.get('GEMINI_MODEL','gemini-3-flash-preview')
 if not re.fullmatch(r'[a-zA-Z0-9._-]+',model): raise ValueError('Invalid model ID')
 prompt='''Create an English vertical system-design explainer for software engineers. Output JSON only.
Use the supplied curriculum packet as the scope and guardrails. Six scenes: concrete hook, failure/problem,
mechanism part one, mechanism part two/proof, one production caveat, transferable takeaway.
Use 160–210 spoken words total, conversational sentences, no markdown, no voice directions spoken aloud.
Explain the supplied caveat, not just mention its name. Keep each spoken sentence below 115 characters.
Do not invent company architecture, exact hardware timings, vendor prices or uncited benchmark results.
Any numeric example must explicitly be hypothetical. No arbitrary HTML, JavaScript, SVG or CSS.
Scene titles <=65 chars, notes <=100, 2–4 diagram nodes per scene, node labels <=24, values <=36.
Make nodes explain the mechanism with changing values/actions. A flow/workflow is routed left-to-right;
queue shows arrival/work; replicas show versions; index shows an access path; ring shows placement;
comparison compares decisions; metric visualizes a workload. Do not use decorative diagrams unrelated to narration.
Keep the caption useful and include #systemdesign #beyondlocalhost.
Packet: '''+json.dumps(lesson)
 payload=post(f'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent',
  key=key,model=model,payload={'contents':[{'parts':[{'text':prompt}]}],
  'generationConfig':{'responseMimeType':'application/json','responseJsonSchema':SCHEMA,'temperature':0.5}})
 parts=payload.get('candidates',[{}])[0].get('content',{}).get('parts',[])
 text=''.join(p.get('text','') for p in parts if not p.get('thought'))
 return validate(json.loads(text))

def digest(content): return hashlib.sha256(json.dumps(content,sort_keys=True).encode()).hexdigest()
