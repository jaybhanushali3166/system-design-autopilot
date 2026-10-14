"""Continuous Gemini scene narration with locally aligned, verbatim captions."""
from __future__ import annotations
import base64,difflib,json,os,re,time
from pathlib import Path
import requests
from .common import WORK,config,write_json
from .content import digest
from .voice import utterances

STYLE='Friendly conversational senior engineer teaching a colleague. Natural pauses, clear technical pronunciation, medium pace. Speak only the provided transcript.'

def identity(settings):
 provider=settings.get('voice_provider','kokoro')
 if provider not in ['gemini','kokoro']:raise ValueError('Unsupported voice provider')
 result={'provider':provider,'voice':settings['voice']}
 if provider=='gemini':result.update(model=settings.get('voice_model','gemini-3.8-flash-tts'),
  style=settings.get('voice_style',STYLE),alignment_model=settings.get('alignment_model','tiny.en'),contract=1)
 return result

def generate(text,key,profile):
 for attempt in range(4):
  response=requests.post('https://generativelanguage.googleapis.com/v1beta/interactions',
   headers={'x-goog-api-key':key},json={'model':profile['model'],
   'input':[{'type':'user_input','content':[{'type':'text','text':text,
    'annotations':[{'type':'speech_metadata','style':profile['style']}]}]}],
   'response_format':{'type':'audio'},'generation_config':{'speech_config':[{'voice':profile['voice']}]}},timeout=(10,120))
  if response.status_code==200:return response.json()
  if response.status_code in [429,500,502,503,504] and attempt<3:
   print(f'Gemini voice temporarily unavailable (HTTP {response.status_code}); retry in 30 seconds.',flush=True)
   time.sleep(30);continue
  raise RuntimeError(f'Gemini voice rejected request (HTTP {response.status_code}); no provider fallback')

def caption_boundaries(text,words,rate,length):
 target=list(re.finditer(r'[a-z0-9]+',text.lower()));spoken=[]
 for word in words:
  spoken.extend((token,word['start']) for token in re.findall(r'[a-z0-9]+',word['word'].lower()))
 mapping={}
 matcher=difflib.SequenceMatcher(None,[x.group() for x in target],[x[0] for x in spoken],autojunk=False)
 for block in matcher.get_matching_blocks():
  for i in range(block.size):mapping[block.a+i]=spoken[block.b+i][1]
 if len(mapping)/max(1,len(target))<.75:raise ValueError('Narration did not sufficiently match script')
 parts=utterances(text);offset=0;boundaries=[]
 for part in parts:
  char=text.find(part,offset)
  if char<0:raise ValueError('Caption text mismatch')
  index=next(i for i,t in enumerate(target) if t.start()>=char)
  matched=next((mapping[i] for i in range(index,min(index+3,len(target))) if i in mapping),None)
  if matched is None:raise ValueError('Unable to align caption confidently')
  boundaries.append(round(matched*rate));offset=char+len(part)
 boundaries[0]=0;boundaries.append(length)
 if any(not 0<=a<b<=length for a,b in zip(boundaries,boundaries[1:])):raise ValueError('Invalid caption timing')
 return parts,boundaries

def synthesize(content,project,voice,settings=None):
 settings=settings or config();profile=identity({**settings,'voice_provider':'gemini','voice':voice})
 key=os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
 if not key:raise ValueError('GEMINI_API_KEY missing for Varo narration')
 from faster_whisper import WhisperModel
 import soundfile as sf
 project=Path(project);assets=project/'assets';assets.mkdir(parents=True,exist_ok=True)
 aligner=WhisperModel(profile['alignment_model'],device='cpu',compute_type='int8',
  download_root=str(WORK/'models/whisper'))
 scenes=[];clips=[];cursor=0.0
 for i,scene in enumerate(content['scenes']):
  text=scene['narration'];key_hash=digest({'text':text,'profile':profile})[:24]
  cache=project/f'speech-{key_hash}.json'
  if cache.exists():data=json.loads(cache.read_text())
  else:data=generate(text,key,profile);write_json(cache,data)
  blocks=[c for step in data.get('steps',[]) if step.get('type')=='model_output'
   for c in step.get('content',[]) if c.get('type')=='audio']
  if not blocks:raise ValueError('Gemini returned no narration audio')
  wav=assets/f'scene-{key_hash}.wav';wav.write_bytes(base64.b64decode(blocks[-1]['data'],validate=True))
  samples,rate=sf.read(wav)
  if samples.ndim>1:samples=samples.mean(axis=1)
  if not len(samples):raise ValueError('Empty narration')
  peak=max(abs(samples))
  if peak<.0001:raise ValueError('Narration is silent')
  if peak>.85:samples=samples*(.85/peak)
  timing=project/f'alignment-{key_hash}.json'
  if timing.exists():words=json.loads(timing.read_text())
  else:
   segments,_=aligner.transcribe(str(wav),language='en',word_timestamps=True,beam_size=5,
    initial_prompt=text,condition_on_previous_text=False,vad_filter=True)
   words=[{'word':w.word,'start':w.start,'end':w.end} for segment in segments for w in segment.words]
   write_json(timing,words)
  parts,boundaries=caption_boundaries(text,words,rate,len(samples));scene_start=cursor
  for j,part in enumerate(parts):
   begin,end=boundaries[j:j+2];name=f'voice-{i}-{j}.wav';sf.write(assets/name,samples[begin:end],rate)
   clips.append({'id':f'voice-{i}-{j}','src':f'assets/{name}','text':part,
    'start':round(scene_start+begin/rate,4),'duration':round((end-begin)/rate,4)})
  cursor+=len(samples)/rate+.28
  scenes.append({**scene,'index':i,'start':round(scene_start,4),'duration':round(cursor-scene_start,4)})
  print(f'Varo narration and captions ready: scene {i+1}/{len(content["scenes"])}.',flush=True)
 if not 45<=cursor<=105:raise ValueError('Narration is outside 45–105 second budget')
 metadata={'scenes':scenes,'clips':clips,'duration':round(cursor,4),'voice':f'gemini/{voice}','voice_profile':profile}
 write_json(project/'audio.json',metadata)
 return metadata
