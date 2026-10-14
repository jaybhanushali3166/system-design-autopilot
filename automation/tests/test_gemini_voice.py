import unittest
from unittest.mock import Mock,patch
from automation.content import digest
from automation.gemini_voice import caption_boundaries,generate,identity

class GeminiVoiceTests(unittest.TestCase):
 def test_provider_and_style_changes_invalidate_reused_audio(self):
  old={'voice':'am_michael'}
  current={'voice_provider':'gemini','voice':'en-us-varo','voice_model':'gemini-3.8-flash-tts'}
  self.assertNotEqual(digest(identity(old)),digest(identity(current)))
  self.assertNotEqual(digest(identity(current)),digest(identity({**current,'voice_style':'different delivery'})))
  self.assertNotEqual(digest(identity(current)),digest(identity({**current,'voice_model':'different-model'})))
 def test_captions_follow_measured_words_and_preserve_script(self):
  text='Protect inventory. Reject duplicates.'
  words=[{'word':w,'start':t} for w,t in [('Protect',.1),('inventory.',.6),('Reject',2),('duplicates.',2.7)]]
  parts,bounds=caption_boundaries(text,words,1000,4000)
  self.assertEqual(parts,['Protect inventory.','Reject duplicates.'])
  self.assertEqual(bounds,[0,2000,4000])
 def test_low_script_agreement_blocks_unrelated_narration(self):
  with self.assertRaises(ValueError):
   caption_boundaries('Protect inventory. Reject duplicates.',[{'word':'Unrelated words only','start':0}],1000,4000)
 def test_nonmonotonic_provider_times_are_rejected(self):
  words=[{'word':w,'start':t} for w,t in [('Protect',0),('inventory',.5),('Reject',-1),('duplicates',2)]]
  with self.assertRaises(ValueError):caption_boundaries('Protect inventory. Reject duplicates.',words,1000,4000)
 @patch('automation.gemini_voice.requests.post')
 def test_tts_requests_exact_varo_voice_and_verbatim_transcript(self,post):
  post.return_value=Mock(status_code=200);post.return_value.json.return_value={'steps':[]}
  profile=identity({'voice_provider':'gemini','voice':'en-us-varo'})
  generate('Explain QPS.','test-only',profile)
  payload=post.call_args.kwargs['json']
  self.assertEqual(payload['generation_config']['speech_config'],[{'voice':'en-us-varo'}])
  self.assertEqual(payload['input'][0]['content'][0]['text'],'Explain QPS.')
 @patch('automation.gemini_voice.time.sleep')
 @patch('automation.gemini_voice.requests.post')
 def test_rate_limit_retries_are_bounded_without_provider_switch(self,post,sleep):
  post.return_value=Mock(status_code=429)
  with self.assertRaises(RuntimeError):generate('Explain QPS.','test-only',identity({'voice_provider':'gemini','voice':'en-us-varo'}))
  self.assertEqual(post.call_count,4);self.assertEqual(sleep.call_count,3)
 @patch('automation.gemini_voice.requests.post')
 def test_permission_failure_stops_without_retry_or_paid_fallback(self,post):
  post.return_value=Mock(status_code=403)
  with self.assertRaises(RuntimeError):generate('Explain QPS.','test-only',identity({'voice_provider':'gemini','voice':'en-us-varo'}))
  self.assertEqual(post.call_count,1)

if __name__=='__main__':unittest.main()
