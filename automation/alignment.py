"""Local measured speech alignment shared by all narration providers."""
from __future__ import annotations
import difflib,json,re
from pathlib import Path
from .common import WORK,write_json

def align_continuous(scenes,words,duration):
 """Map exact script spans to observed word times; never estimate equal word spacing."""
 text='\n\n'.join(s['narration'] for s in scenes)
 targets=list(re.finditer(r'[a-z]+|[0-9]+',text.lower()));observed=[];previous_start=-1
 for word in words:
  start,end=word['start'],word.get('end',word['start'])
  if not isinstance(start,(int,float)) or not isinstance(end,(int,float)) or not 0<=start<=end<=duration+.1:raise ValueError('Invalid measured word times')
  if start<previous_start:raise ValueError('Nonmonotonic measured word times')
  previous_start=start
  observed.extend((token,start,end) for token in re.findall(r'[a-z]+|[0-9]+',word['word'].lower()))
 mapping={}
 matcher=difflib.SequenceMatcher(None,['quic' if t.group()=='quick' else t.group() for t in targets],['quic' if w[0]=='quick' else w[0] for w in observed],autojunk=False)
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


def align_audio(scenes,raw,project,key_hash,duration,model_name='tiny.en'):
 from faster_whisper import WhisperModel
 project=Path(project);text='\n\n'.join(s['narration'] for s in scenes)
 def transcript(name,vad):
  suffix='' if name==model_name else '-'+name
  path=project/f'alignment-{key_hash}{suffix}.json'
  if path.exists():return json.loads(path.read_text())
  model=WhisperModel(name,device='cpu',compute_type='int8',download_root=str(WORK/'models/whisper'))
  segments,_=model.transcribe(str(raw),language='en',word_timestamps=True,beam_size=5,initial_prompt=text,condition_on_previous_text=False,vad_filter=vad)
  words=[{'word':w.word,'start':w.start,'end':w.end} for segment in segments for w in segment.words]
  write_json(path,words);return words
 words=transcript(model_name,True)
 try:timeline,groups,agreement=align_continuous(scenes,words,duration)
 except ValueError as exc:
  if str(exc) not in ['Continuous narration does not sufficiently match script','Cannot confidently align a scene or caption']:raise
  print('Checking narration with local base.en alignment; no new speech synthesis.',flush=True)
  words=transcript('base.en',False)
  timeline,groups,agreement=align_continuous(scenes,words,duration)
 return timeline,groups,words,agreement
