import copy,json,unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
from automation.common import ROOT
from automation.content import validate,generate,STORY_SCHEMA
from automation.storyboards import storyboard_plan
from automation.render_story import build_story
from automation.creative_review import inspect_mechanism_opening,CreativeReviewFailed,check_mechanism_language


def candidate():return json.loads((ROOT/'automation/lessons/lesson-12.approved.json').read_text())

class StoryboardTests(unittest.TestCase):
 def test_reviewed_next_reel_follows_curriculum_and_new_contract(self):
  c=candidate();self.assertEqual(validate(c)['story']['version'],3);self.assertTrue(check_mechanism_language(c))
  self.assertEqual(len(c['scenes']),7);self.assertEqual(len(c['story']['takeaway']),2)
 def test_distinct_planned_openers_and_legacy_boundary(self):
  self.assertIsNone(storyboard_plan({'id':'lesson-11'}))
  plans=[storyboard_plan({'id':f'lesson-{i}'}) for i in range(12,18)]
  self.assertEqual([p['format'] for p in plans],['debug','prediction','debug','tradeoff','prediction','tradeoff'])
  self.assertEqual([p['opening_action'] for p in plans[:3]],['scan','queue','block'])
  self.assertTrue(storyboard_plan({'id':'lesson-60','hook':'Bounded hook'}))
 def test_obsolete_opening_repetition_arity_and_excess_checks_fail(self):
  mutations=[lambda c:c['scenes'][0].update(action='compare'),lambda c:c['scenes'][1].update(narration=c['scenes'][0]['narration']),lambda c:c['scenes'][0]['nodes'].pop(),lambda c:c['story']['takeaway'].append('Check another unrelated thing here')]
  for mutate in mutations:
   with self.subTest(mutate=mutate):
    c=candidate();mutate(c)
    with self.assertRaises(ValueError):validate(c)
 @patch('automation.render_story.shutil.copy2')
 def test_renderer_varies_opening_geometry_and_preserves_short_captions(self,copy_asset):
  for action in ['scan','queue','block','lookup','route']:
   c=candidate();c['scenes'][0]['action']=action
   a={'scenes':[{**s,'index':i,'start':i*7,'duration':7} for i,s in enumerate(c['scenes'])],'duration':49,'caption_groups':[{'text':'Your order search','start':0,'duration':2}],'clips':[]}
   with TemporaryDirectory() as d:
    p=Path(d);build_story({'title':'Indexes','series_title':'Data','number':12},c,a,p)
    m=json.loads((p/'story-evidence.json').read_text());self.assertEqual(m['contract'],3);self.assertEqual(m['opening_motion']['color'],[107,78,255])
    html=(p/'compositions/story-0.html').read_text();self.assertNotIn('lane-reason',html.split('</style>')[1]);self.assertIn('Found after scanning rows',html)
    self.assertIn('class="cap"',(p/'compositions/captions.html').read_text())
 def test_generated_content_uses_the_selected_plan_and_schema(self):
  c=candidate();response={'candidates':[{'content':{'parts':[{'text':json.dumps(c)}]}}]}
  with patch.dict('os.environ',{'GEMINI_API_KEY':'test-only'}),patch('automation.content.post',return_value=response) as post:
   self.assertEqual(generate({'id':'lesson-12'})['story']['format'],'debug')
   payload=post.call_args.kwargs['payload'];self.assertEqual(payload['generationConfig']['responseJsonSchema'],STORY_SCHEMA)
   self.assertIn('TRUSTED STORYBOARD PLAN',payload['contents'][0]['parts'][0]['text'])
  c['story']['format']='prediction';response['candidates'][0]['content']['parts'][0]['text']=json.dumps(c)
  with patch.dict('os.environ',{'GEMINI_API_KEY':'test-only'}),patch('automation.content.post',return_value=response):
   with self.assertRaisesRegex(ValueError,'selected storyboard'):generate({'id':'lesson-12'})

class MechanismPixelTests(unittest.TestCase):
 def frame(self,x,y):
  frame=bytearray(1080*1920*3)
  for row in range(y-15,y+15):
   start=(row*1080+x-20)*3;frame[start:start+120]=bytes([107,78,255])*40
  return bytes(frame)
 def test_encoded_geometry_is_checked_and_static_or_missing_carrier_fails(self):
  motion={'color':[107,78,255],'points':[[215,578],[215,926]],'start':.2,'length':2,'ease':'linear'}
  frames={0:self.frame(215,578),1.5:self.frame(215,804),3:self.frame(215,926)}
  self.assertEqual(inspect_mechanism_opening(frames,motion)['3']['y'],925.5)
  for bad in [{**frames,3:self.frame(215,578)},{**frames,0:bytes(1080*1920*3)}]:
   with self.assertRaises(CreativeReviewFailed):inspect_mechanism_opening(bad,motion)
