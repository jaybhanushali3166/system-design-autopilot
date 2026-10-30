"""Keyless local Kokoro narration with measured short captions."""
from __future__ import annotations
import json,os,subprocess
from pathlib import Path
from .common import WORK,config,write_json
from .content import digest
from .voice import cached_file,MODEL_URL,VOICES_URL
from .alignment import align_audio

def synthesize(content,project,voice,settings=None):
 from kokoro_onnx import Kokoro
 import soundfile as sf
 from .gemini_voice import identity
 settings=settings or config();profile=identity({**settings,'voice_provider':'kokoro','voice':voice})
 project=Path(project);assets=project/'assets';assets.mkdir(parents=True,exist_ok=True)
 text='\n\n'.join(s['narration'] for s in content['scenes'])
 key_hash=digest({'text':text,'profile':profile})[:24]
 raw=assets/f'kokoro-raw-{key_hash}.wav';final=assets/f'kokoro-{key_hash}.wav'
 if not raw.exists():
  model_dir=Path(os.environ.get('AUTOPILOT_MODEL_DIR',str(WORK/'models')))
  cached_file(MODEL_URL,model_dir/'kokoro-v1.0.onnx');cached_file(VOICES_URL,model_dir/'voices-v1.0.bin')
  engine=Kokoro(str(model_dir/'kokoro-v1.0.onnx'),str(model_dir/'voices-v1.0.bin'))
  if voice not in engine.get_voices():raise ValueError('Configured Kokoro voice is unavailable')
  samples,rate=engine.create(text,voice=voice,speed=profile['speed'],lang='en-us')
  sf.write(str(raw),samples,rate)
 samples,rate=sf.read(raw)
 if samples.ndim>1:samples=samples.mean(axis=1)
 duration=len(samples)/rate
 if not len(samples) or max(abs(samples))<.0001:raise ValueError('Continuous narration is empty or silent')
 if not 44.7<=duration<=104.7:raise ValueError('Continuous narration outside 45–105 second budget')
 if not final.exists():subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af','loudnorm=I=-16:TP=-1.5:LRA=9','-ar','48000',str(final)],check=True)
 scenes,groups,words,agreement=align_audio(content['scenes'],raw,project,key_hash,duration,profile['alignment_model'])
 metadata={'scenes':scenes,'clips':[{'id':'voice-kokoro','src':f'assets/{final.name}','text':text,'start':0,'duration':round(duration,4)}],
  'caption_groups':groups,'words':words,'duration':round(duration+.3,4),'voice':f'kokoro/{voice}','voice_profile':profile,'alignment_agreement':agreement}
 write_json(project/'audio.json',metadata)
 print(f'Kokoro {voice} ready: {duration:.2f}s, {agreement:.1%} measured script agreement; {len(groups)} caption groups.',flush=True)
 return metadata
