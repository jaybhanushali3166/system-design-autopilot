"""Free local TTS with exact utterance-level caption boundaries."""
from __future__ import annotations
import os,re,subprocess
import requests
from pathlib import Path
from .common import WORK,write_json
MODEL_URL='https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx'
VOICES_URL='https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin'

def cached_file(url,path):
 if path.exists() and path.stat().st_size>100000: return
 path.parent.mkdir(parents=True,exist_ok=True)
 temporary=path.with_suffix(path.suffix+'.download')
 with requests.get(url,stream=True,timeout=(15,120)) as response, temporary.open('wb') as stream:
  response.raise_for_status()
  for chunk in response.iter_content(1024*1024):
   if chunk:stream.write(chunk)
 temporary.replace(path)

def utterances(text):
 sentences=re.split(r'(?<=[.!?])\s+',text.strip())
 result=[]
 for sentence in sentences:
  if len(sentence)<=115: result.append(sentence);continue
  # Long sentences are split into synthesized utterances, not evenly distributed word timings.
  for clause in re.split(r'(?<=[,;:])\s+',sentence):
   words=clause.split();buf=[]
   for word in words:
    if len(' '.join(buf+[word]))>105 and buf: result.append(' '.join(buf));buf=[]
    buf.append(word)
   if buf:result.append(' '.join(buf))
 return [s for s in result if s]

def synthesize(content,project,voice='am_michael',provider='kokoro'):
 if provider=='gemini':
  from .gemini_voice import synthesize as gemini_synthesize
  return gemini_synthesize(content,project,voice)
 if provider!='kokoro':raise ValueError('Unsupported voice provider')
 from kokoro_onnx import Kokoro
 import soundfile as sf
 model_dir=Path(os.environ.get('AUTOPILOT_MODEL_DIR',str(WORK/'models')))
 cached_file(MODEL_URL,model_dir/'kokoro-v1.0.onnx');cached_file(VOICES_URL,model_dir/'voices-v1.0.bin')
 engine=Kokoro(str(model_dir/'kokoro-v1.0.onnx'),str(model_dir/'voices-v1.0.bin'))
 assets=project/'assets';assets.mkdir(parents=True,exist_ok=True)
 scenes=[]; clips=[];cursor=0.0
 for i,scene in enumerate(content['scenes']):
  start=cursor
  for j,text in enumerate(utterances(scene['narration'])):
   audio,rate=engine.create(text,voice=voice,speed=1.04,lang='en-us')
   name=f'voice-{i:02}-{j:02}.wav';sf.write(str(assets/name),audio,rate)
   duration=len(audio)/rate
   clips.append({'id':f'voice-{i}-{j}','src':f'assets/{name}','text':text,'start':round(cursor,4),'duration':round(duration,4)})
   cursor+=duration+0.09
  cursor+=0.28
  scenes.append({**scene,'index':i,'start':round(start,4),'duration':round(cursor-start,4)})
 if not 45<=cursor<=105: raise ValueError(f'Narration outside 45–105 second budget: {cursor:.1f}s; revise script')
 metadata={'scenes':scenes,'clips':clips,'duration':round(cursor,4),'voice':voice}
 write_json(project/'audio.json',metadata)
 return metadata
