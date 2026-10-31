"""Exact configured ElevenLabs voice, cached speech and measured local captions."""
from __future__ import annotations
import os,time,subprocess
from pathlib import Path
import requests
from .common import config,write_json
from .content import digest
from .alignment import align_audio

class ElevenLabsRequestError(RuntimeError):
 def __init__(self,status,reason='request_rejected'):
  self.status=status;self.reason=reason
  self.retry_at=int(time.time())+900 if status in [0,408,429,500,502,503,504] else None
  super().__init__(f'ElevenLabs request failed (HTTP {status}; {reason})')
 def diagnostic(self):return {'provider':'elevenlabs','http_status':self.status,'reason':self.reason,'retry_at':self.retry_at}

def request_audio(text,key,profile):
 try:
  response=requests.post('https://api.elevenlabs.io/v1/text-to-speech/'+profile['voice'],headers={'xi-api-key':key},params={'output_format':'mp3_44100_128'},json={'text':text,'model_id':profile['model'],'voice_settings':profile['voice_settings']},timeout=(10,120))
 except requests.RequestException:raise ElevenLabsRequestError(0,'transport_error') from None
 if not response.ok:
  # Never include the raw provider message, headers or credential-bearing exceptions.
  status=''
  try:
   detail=response.json().get('detail',{})
   if isinstance(detail,dict):status=detail.get('status','')
  except (ValueError,AttributeError):pass
  allowed={'paid_plan_required','quota_exceeded','missing_permissions','voice_not_found','invalid_api_key','free_tier_not_allowed','rate_limit_exceeded','detected_unusual_activity'}
  reason=status if status in allowed else 'payment_or_plan_required' if response.status_code==402 else 'request_rejected'
  raise ElevenLabsRequestError(response.status_code,reason)
 if not response.headers.get('content-type','').startswith('audio/') or len(response.content)<1000:raise ElevenLabsRequestError(response.status_code,'invalid_audio_response')
 return response.content

def synthesize(content,project,voice,settings=None):
 import soundfile as sf
 from .gemini_voice import identity
 settings=settings or config();profile=identity({**settings,'voice_provider':'elevenlabs','voice':voice})
 project=Path(project);assets=project/'assets';assets.mkdir(parents=True,exist_ok=True)
 text='\n\n'.join(s['narration'] for s in content['scenes']);key_hash=digest({'text':text,'profile':profile})[:24]
 source=assets/f'elevenlabs-{key_hash}.mp3';raw=assets/f'elevenlabs-raw-{key_hash}.wav';final=assets/f'elevenlabs-{key_hash}.wav'
 if not source.exists():
  key=os.environ.get('ELEVENLABS_API_KEY') or os.environ.get('ELEVEN_API_KEY')
  if not key:raise ValueError('ELEVENLABS_API_KEY missing for configured voice')
  audio=request_audio(text,key,profile)
  temporary=source.with_suffix('.mp3.part');temporary.write_bytes(audio);temporary.replace(source)
 if not raw.exists():
  temporary=raw.with_name(raw.stem+'.part.wav')
  subprocess.run(['ffmpeg','-y','-v','error','-i',str(source),'-ac','1','-ar','48000',str(temporary)],check=True);temporary.replace(raw)
 samples,rate=sf.read(raw);duration=len(samples)/rate
 if not len(samples) or max(abs(samples))<.0001:raise ValueError('Continuous narration is empty or silent')
 if not 44.7<=duration<=104.7:raise ValueError('Continuous narration outside 45–105 second budget')
 if not final.exists():
  temporary=final.with_name(final.stem+'.part.wav')
  subprocess.run(['ffmpeg','-y','-v','error','-i',str(raw),'-af','loudnorm=I=-16:TP=-1.5:LRA=9','-ar','48000',str(temporary)],check=True);temporary.replace(final)
 scenes,groups,words,agreement=align_audio(content['scenes'],raw,project,key_hash,duration,profile['alignment_model'])
 metadata={'scenes':scenes,'clips':[{'id':'voice-elevenlabs','src':f'assets/{final.name}','text':text,'start':0,'duration':round(duration,4)}],
  'caption_groups':groups,'words':words,'duration':round(duration+.3,4),'voice':f'elevenlabs/{voice}','voice_profile':profile,'alignment_agreement':agreement}
 write_json(project/'audio.json',metadata)
 print(f'ElevenLabs voice ready: {duration:.2f}s, {agreement:.1%} measured script agreement; {len(groups)} caption groups.',flush=True)
 return metadata
