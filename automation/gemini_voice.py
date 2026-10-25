"""Continuous Gemini scene narration with locally aligned, verbatim captions."""
from __future__ import annotations
import base64,difflib,json,os,re
from pathlib import Path
from .common import WORK,config,write_json
from .content import digest
from .voice import utterances
from .gemini_http import post

STYLE='Friendly conversational senior engineer teaching a colleague. Natural pauses, clear technical pronunciation, medium pace. Speak only the provided transcript.'

def identity(settings):
 provider=settings.get('voice_provider','kokoro')
 if provider not in ['gemini','kokoro']:raise ValueError('Unsupported voice provider')
 result={'provider':provider,'voice':settings['voice']}
 if provider=='gemini':result.update(model=settings.get('voice_model','gemini-3.8-flash-tts'),
  style=settings.get('voice_style',STYLE),alignment_model=settings.get('alignment_model','tiny.en'),contract=2)
 return result

def generate(text,key,profile,interval_seconds=65):
 return post('https://generativelanguage.googleapis.com/v1beta/interactions',
   key=key,model=profile['model'],interval_seconds=interval_seconds,payload={'model':profile['model'],
   'input':[{'type':'user_input','content':[{'type':'text','text':text,
    'annotations':[{'type':'speech_metadata','style':profile['style']}]}]}],
   'response_format':{'type':'audio'},'generation_config':{'speech_config':[{'voice':profile['voice']}]}})

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

def align_continuous(scenes,words,duration):
 """Map exact script spans to observed word times; never estimate equal word spacing."""
 text='\n\n'.join(s['narration'] for s in scenes)
 targets=list(re.finditer(r'[a-z0-9]+',text.lower()));observed=[];previous_start=-1
 for word in words:
  start,end=word['start'],word.get('end',word['start'])
  if not isinstance(start,(int,float)) or not isinstance(end,(int,float)) or not 0<=start<=end<=duration+.1:raise ValueError('Invalid measured word times')
  if start<previous_start:raise ValueError('Nonmonotonic measured word times')
  previous_start=start
  observed.extend((token,start,end) for token in re.findall(r'[a-z0-9]+',word['word'].lower()))
 mapping={}
 matcher=difflib.SequenceMatcher(None,[t.group() for t in targets],[w[0] for w in observed],autojunk=False)
 for block in matcher.get_matching_blocks():
  for j in range(block.size):mapping[block.a+j]=observed[block.b+j][1:]
 agreement=len(mapping)/max(1,len(targets))
 if agreement<.86:raise ValueError('Continuous narration does not sufficiently match script')
 def boundary(char):
  index=next(i for i,t in enumerate(targets) if t.start()>=char)
  for n in range(index,min(index+3,len(targets))):
   if n in mapping:return mapping[n][0]
  raise ValueError('Cannot confidently align a scene or caption')
 starts=[];offset=0;positions=[]
 for scene in scenes:
  char=text.find(scene['narration'],offset)
  if char<0:raise ValueError('Scene text missing from continuous script')
  starts.append(boundary(char));positions.append(char);offset=char+len(scene['narration'])
 starts[0]=0;ends=starts[1:]+[duration+.3]
 if any(a>=b for a,b in zip(starts,ends)):raise ValueError('Nonmonotonic scene timings')
 timeline=[];groups=[]
 for i,scene in enumerate(scenes):
  local=[]
  for group in re.finditer(r'\S+(?:\s+\S+){0,4}',scene['narration']):
   start=boundary(positions[i]+group.start())
   local.append({'text':group.group(),'start':round(start,4)})
  for j,group in enumerate(local):
   end=local[j+1]['start'] if j+1<len(local) else ends[i]
   if group['start']>=end:raise ValueError('Nonmonotonic caption timings')
   groups.append({**group,'duration':round(end-group['start'],4),'scene':i})
  timeline.append({**scene,'index':i,'start':round(starts[i],4),'duration':round(ends[i]-starts[i],4)})
 return timeline,groups,agreement


def synthesize(content,project,voice,settings=None):
 settings=settings or config();profile=identity({**settings,'voice_provider':'gemini','voice':voice})
 key=os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')
 if not key:raise ValueError('GEMINI_API_KEY missing for Varo narration')
 from faster_whisper import WhisperModel
 import soundfile as sf
 import subprocess
 project=Path(project);assets=project/'assets';assets.mkdir(parents=True,exist_ok=True)
 text='\n\n'.join(s['narration'] for s in content['scenes']);key_hash=digest({'text':text,'profile':profile})[:24]
 cache=project/f'speech-{key_hash}.json'
 if cache.exists():data=json.loads(cache.read_text())
 else:
  data=generate(text,key,profile,settings.get('gemini_voice_interval_seconds',65));write_json(cache,data)
 blocks=[c for step in data.get('steps',[]) if step.get('type')=='model_output' for c in step.get('content',[]) if c.get('type')=='audio']
 if not blocks:raise ValueError('Gemini returned no continuous narration')
 raw=assets/f'raw-{key_hash}.wav';raw.write_bytes(base64.b64decode(blocks[-1]['data'],validate=True))
 samples,rate=sf.read(raw)
 if samples.ndim>1:samples=samples.mean(axis=1)
 duration=len(samples)/rate
 if not len(samples) or max(abs(samples))<.0001:raise ValueError('Continuous narration is empty or silent')
 if not 44.7<=duration<=104.7:raise ValueError('Continuous narration outside 45–105 second budget')
 final=assets/f'varo-{key_hash}.wav'
 if not final.exists():subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af','loudnorm=I=-16:TP=-1.5:LRA=9','-ar','48000',str(final)],check=True)
 timing=project/f'alignment-{key_hash}.json'
 if timing.exists():words=json.loads(timing.read_text())
 else:
  model=WhisperModel(profile['alignment_model'],device='cpu',compute_type='int8',download_root=str(WORK/'models/whisper'))
  segments,_=model.transcribe(str(raw),language='en',word_timestamps=True,beam_size=5,initial_prompt=text,condition_on_previous_text=False,vad_filter=True)
  words=[{'word':w.word,'start':w.start,'end':w.end} for segment in segments for w in segment.words];write_json(timing,words)
 scenes,groups,agreement=align_continuous(content['scenes'],words,duration)
 metadata={'scenes':scenes,'clips':[{'id':'voice-varo','src':f'assets/{final.name}','text':text,'start':0,'duration':round(duration,4)}],
  'caption_groups':groups,'words':words,'duration':round(duration+.3,4),'voice':f'gemini/{voice}','voice_profile':profile,'alignment_agreement':agreement}
 write_json(project/'audio.json',metadata)
 print(f'Continuous Varo ready: {duration:.2f}s, {agreement:.1%} measured script agreement; {len(groups)} caption groups.',flush=True)
 return metadata
