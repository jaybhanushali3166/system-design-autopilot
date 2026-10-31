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
 if provider=='elevenlabs':
  from .elevenlabs_voice import synthesize as elevenlabs_synthesize
  return elevenlabs_synthesize(content,project,voice)
 if provider!='kokoro':raise ValueError('Unsupported voice provider')
 from .kokoro_voice import synthesize as kokoro_synthesize
 return kokoro_synthesize(content,project,voice)
