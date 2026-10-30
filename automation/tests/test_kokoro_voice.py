import json,sys,types,unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import Mock,patch
from automation.gemini_voice import identity
from automation.kokoro_voice import synthesize
from automation.common import ROOT

class Samples:
 ndim=1
 def __len__(self):return 480000
 def __abs__(self):return [.1,.2]

class KokoroVoiceTests(unittest.TestCase):
 def test_local_narration_needs_no_key_and_emits_measured_caption_contract(self):
  engine=Mock();engine.get_voices.return_value=['am_fenrir'];engine.create.return_value=(Samples(),8000)
  kokoro=types.SimpleNamespace(Kokoro=Mock(return_value=engine));sf=types.SimpleNamespace(read=Mock(return_value=(Samples(),8000)),write=Mock())
  content=json.loads((ROOT/'automation/lessons/lesson-10.approved.json').read_text())
  scenes=[{**s,'index':i,'start':i*7.5,'duration':7.5} for i,s in enumerate(content['scenes'])]
  groups=[{'text':'The first image request waits','start':0,'duration':2}];words=[{'word':'The','start':0,'end':.2}]
  with TemporaryDirectory() as d,patch.dict(sys.modules,{'kokoro_onnx':kokoro,'soundfile':sf}),patch.dict('os.environ',{},clear=True),patch('automation.kokoro_voice.cached_file'),patch('automation.kokoro_voice.subprocess.run') as run,patch('automation.kokoro_voice.align_audio',return_value=(scenes,groups,words,1.0)) as align,patch('requests.post') as network:
   result=synthesize(content,Path(d),'am_fenrir',{'voice_speed':1.0,'alignment_model':'tiny.en'})
   network.assert_not_called();self.assertEqual(engine.create.call_args.kwargs,{'voice':'am_fenrir','speed':1.0,'lang':'en-us'})
   self.assertEqual(result['caption_groups'],groups);self.assertEqual(result['voice'],'kokoro/am_fenrir');self.assertEqual(result['duration'],60.3)
   self.assertEqual(result['voice_profile']['contract'],3);self.assertEqual(result['alignment_agreement'],1.0)
   self.assertEqual(json.loads((Path(d)/'audio.json').read_text())['words'],words)
   self.assertIn('loudnorm=I=-16:TP=-1.5:LRA=9',run.call_args.args[0])
 def test_voice_speed_and_alignment_change_cache_identity(self):
  p={'voice_provider':'kokoro','voice':'am_fenrir','voice_speed':1.0}
  self.assertNotEqual(identity(p),identity({**p,'voice_speed':.95}))
  self.assertNotEqual(identity(p),identity({**p,'voice':'am_michael'}))
  self.assertNotEqual(identity(p),identity({**p,'alignment_model':'base.en'}))
 def test_bad_speed_is_rejected_before_loading_models(self):
  for speed in [True,0,float('nan'),3]:
   with self.assertRaises(ValueError):identity({'voice_provider':'kokoro','voice':'am_fenrir','voice_speed':speed})
