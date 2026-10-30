import json,types,unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import Mock,patch
import requests
from automation.elevenlabs_voice import request_audio,ElevenLabsRequestError,synthesize
from automation.gemini_voice import identity

VOICE='pNInz6obpgDQGcFmaJgB'
class Samples:
 ndim=1
 def __len__(self):return 480000
 def __abs__(self):return [.2]

class ElevenLabsVoiceTests(unittest.TestCase):
 def profile(self):return identity({'voice_provider':'elevenlabs','voice':VOICE,'voice_model':'eleven_flash_v2_5'})
 @patch('automation.elevenlabs_voice.requests.post')
 def test_exact_voice_model_and_key_header_are_used(self,post):
  post.return_value=Mock(ok=True,headers={'content-type':'audio/mpeg'},content=b'x'*2000)
  self.assertEqual(request_audio('Exact words.','test-secret',self.profile()),b'x'*2000)
  self.assertEqual(post.call_args.args[0],'https://api.elevenlabs.io/v1/text-to-speech/'+VOICE)
  self.assertEqual(post.call_args.kwargs['headers'],{'xi-api-key':'test-secret'})
  self.assertEqual(post.call_args.kwargs['json']['model_id'],'eleven_flash_v2_5')
  self.assertEqual(post.call_args.kwargs['json']['text'],'Exact words.')
 @patch('automation.elevenlabs_voice.requests.post')
 def test_permission_plan_and_transport_errors_do_not_spend_repeated_calls(self,post):
  for code in [401,402,403,429,503]:
   post.reset_mock();post.return_value=Mock(ok=False,status_code=code);post.return_value.json.return_value={'detail':{'status':'unknown','message':'test-secret'}}
   with self.assertRaises(ElevenLabsRequestError) as error:request_audio('Words.','test-secret',self.profile())
   self.assertEqual(post.call_count,1);self.assertNotIn('test-secret',json.dumps(error.exception.diagnostic()))
   if code==402:self.assertEqual(error.exception.reason,'payment_or_plan_required')
  post.reset_mock();post.side_effect=requests.ReadTimeout('contains test-secret')
  with self.assertRaises(ElevenLabsRequestError) as error:request_audio('Words.','test-secret',self.profile())
  self.assertEqual(post.call_count,1);self.assertNotIn('test-secret',str(error.exception))
 @patch('automation.elevenlabs_voice.requests.post')
 def test_invalid_audio_response_is_rejected(self,post):
  post.return_value=Mock(ok=True,status_code=200,headers={'content-type':'application/json'},content=b'x'*2000)
  with self.assertRaises(ElevenLabsRequestError):request_audio('Words.','test-secret',self.profile())
 def test_switching_provider_or_voice_cannot_reuse_old_speech(self):
  self.assertNotEqual(self.profile(),identity({'voice_provider':'kokoro','voice':'am_fenrir'}))
  self.assertNotEqual(self.profile(),identity({'voice_provider':'elevenlabs','voice':'another_voice_id'}))
  self.assertNotEqual(self.profile(),identity({'voice_provider':'elevenlabs','voice':VOICE,'voice_model':'eleven_multilingual_v2'}))
 def test_missing_key_stops_without_another_provider(self):
  with TemporaryDirectory() as d,patch.dict('os.environ',{},clear=True),patch('automation.elevenlabs_voice.request_audio') as post,patch.dict('sys.modules',{'soundfile':types.SimpleNamespace()}):
   with self.assertRaisesRegex(ValueError,'ELEVENLABS_API_KEY missing'):synthesize({'scenes':[{'narration':'Exact words.'}]},Path(d),VOICE,{'voice_model':'eleven_flash_v2_5'})
   post.assert_not_called()
 def test_cached_speech_is_reused_without_another_api_call_and_has_measured_captions(self):
  from automation.content import digest
  content={'scenes':[{'narration':'Exact words.'}]};profile=self.profile();key=digest({'text':'Exact words.','profile':profile})[:24]
  sf=types.SimpleNamespace(read=Mock(return_value=(Samples(),8000)))
  def run(command,**kwargs):Path(command[-1]).write_bytes(b'wave')
  groups=[{'text':'Exact words.','start':0,'duration':60}]
  with TemporaryDirectory() as d,patch.dict('os.environ',{},clear=True),patch.dict('sys.modules',{'soundfile':sf}),patch('automation.elevenlabs_voice.request_audio') as post,patch('automation.elevenlabs_voice.subprocess.run',side_effect=run),patch('automation.elevenlabs_voice.align_audio',return_value=(content['scenes'],groups,[],1.0)):
   p=Path(d);(p/'assets').mkdir();(p/'assets'/f'elevenlabs-{key}.mp3').write_bytes(b'cached')
   out=synthesize(content,p,VOICE,{'voice_model':'eleven_flash_v2_5'})
   post.assert_not_called();self.assertEqual(out['caption_groups'],groups);self.assertEqual(out['voice'],'elevenlabs/'+VOICE)
   self.assertEqual(out['duration'],60.3);self.assertFalse(list((p/'assets').glob('*.part*')))
