import copy,json,unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
from automation.common import ROOT
from automation.story_contract import validate_story
from automation.creative_review import inspect_opening,check_story_language,CreativeReviewFailed
from automation.content import validate
from automation.render_story import build_story

def story_content():
    scenes=[]
    narrations=[
      'One URL waits. Add routing, and this orders request reaches the right service.',
      'Our orders request enters the proxy, which forwards it to the orders service behind that single public address.',
      'The same request can meet a gateway policy that checks a token before allowing it through to the service.',
      'With a valid token, this request passes the configured policy and reaches the orders handler through that public address.',
      'An aggregator can ask two backends in parallel, combine their responses, and return one result for the same request.',
      'A load balancer routes the next orders request to one healthy instance rather than changing the public endpoint again.',
      'These roles overlap: a proxy can also check permissions, depending on its configuration rather than the product name alone.',
      'For your next failed request, trace the path, inspect the policy decision, and check which backend actually received it.'
    ]
    actions=['compare','route','block','route','fanout','route','block','checklist']
    for i,(text,action) in enumerate(zip(narrations,actions)):
      n=4 if action=='fanout' else 2 if action in ['compare','checklist'] else 3
      scenes.append({'title':['One URL. The right service.','Follow one request','Check the caller','Let this request through','Combine two responses','Choose a healthy instance','Roles can overlap','Trace your next failed call'][i],'narration':text,'kind':'flow','action':action,'nodes':[{'label':['Client','Front door','Orders','Stock'][j],'value':['Request','Route/check','Response','Response'][j],'tone':['muted','cyan','green','green'][j]} for j in range(n)],'note':'A configured request path, not a universal product rule'})
    return {'caption':'Follow one request and inspect its route. #systemdesign #beyondlocalhost','cover_title':'Who Gets Your API Request?','story':{'version':2,'example':'GET /orders','opening':{'subject':'GET','before_label':'No matching route','after_label':'Route configured','before_reason':'No target selected','after_reason':'Proxy selects orders','before_result':'Request waits','after_result':'Orders answers','before_action':'wait','result_at':2.4},'takeaway':['Trace the request to its backend','Inspect the configured policy decision','Check the selected healthy instance']},'scenes':scenes}

class StoryTests(unittest.TestCase):
    def test_story_has_early_demonstration_and_advancing_beats(self):
        c=story_content();self.assertEqual(validate(c),c);self.assertEqual(validate_story(c)['opening']['result_at'],2.4)
    @patch("automation.render_story.shutil.copy2")
    def test_reviewed_next_lesson_routes_to_only_one_backend(self,copy_asset):
        c=validate(json.loads((ROOT/'automation/lessons/lesson-08.approved.json').read_text()))
        audio={'scenes':[{**scene,'index':i,'start':i*7,'duration':7} for i,scene in enumerate(c['scenes'])],'duration':56,'caption_groups':[{'text':'No token: it stops.','start':0,'duration':2}], 'clips':[]}
        self.assertTrue(check_story_language(c,audio))
        with TemporaryDirectory() as folder:
            p=Path(folder);build_story({'title':'Request paths','series_title':'Request paths','number':8},c,audio,p)
            for index in [4,5]:
                html=(p/f'compositions/story-{index}.html').read_text()
                self.assertIn(f'id="story-{index}-branch-2"',html)
                self.assertNotIn(f'id="story-{index}-branch-3"',html)
                self.assertIn(f'id="story-{index}-endpoint-3"',html)
    def test_old_generic_template_cannot_enter_new_renderer(self):
        old=json.loads((ROOT/'automation/lessons/lesson-01.approved.json').read_text())
        with self.assertRaises(ValueError):validate_story(old)
    def test_delayed_payoff_wrong_actions_and_repeated_setup_are_rejected(self):
        c=story_content();c['story']['opening']['result_at']=23.3
        with self.assertRaises(ValueError):validate_story(c)
        c=story_content();c['scenes'][1]['action']='fanout'
        with self.assertRaises(ValueError):validate_story(c)
        c=story_content();c['scenes'][1]['narration']=c['scenes'][0]['narration']
        with self.assertRaises(ValueError):validate_story(c)
    def test_takeaway_must_be_a_usable_diagnostic(self):
        c=story_content();c['story']['takeaway'][0]='Networking is very useful today'
        with self.assertRaises(ValueError):validate_story(c)
    def test_setup_intro_and_unqualified_promises_fail_local_review(self):
        c=story_content();a={'scenes':[{'duration':5}]};self.assertTrue(check_story_language(c,a))
        c['scenes'][0]['narration']='Imagine this request entering your system before we discuss how its routing works.'
        with self.assertRaises(CreativeReviewFailed):check_story_language(c,a)
        c=story_content();c['scenes'][2]['note']='A gateway always faster'
        with self.assertRaises(CreativeReviewFailed):check_story_language(c,a)
    @patch("automation.render_story.shutil.copy2")
    def test_renderer_produces_finite_connected_actions_and_no_dangling_branch(self,copy_asset):
        c=story_content();audio={'scenes':[{**s,'index':i,'start':i*7,'duration':7} for i,s in enumerate(c['scenes'])],'duration':56,'caption_groups':[{'text':'One URL waits.','start':0,'duration':2}], 'clips':[]}
        with TemporaryDirectory() as folder:
            p=Path(folder);build_story({'title':'Request paths','series_title':'Request paths','number':8},c,audio,p)
            evidence=json.loads((p/'story-evidence.json').read_text());self.assertEqual(evidence['opening_result_seconds'],2.4)
            self.assertEqual(evidence['scenes'][1]['edges'],[[0,1],[1,2]])
            self.assertEqual(evidence['scenes'][4]['edges'],[[0,1],[1,2],[1,3]])
            self.assertNotIn('repeat:-1',(p/'compositions/story-1.html').read_text())

class EncodedOpeningTests(unittest.TestCase):
    def frame(self,before_x,after_x):
        frame=bytearray(1080*1920*3)
        for x,y,color in [(before_x,635,(243,188,171)),(after_x,905,(249,214,107))]:
            for row in range(y-15,y+15):
                start=(row*1080+x-20)*3;frame[start:start+120]=bytes(color)*40
        return bytes(frame)
    def test_actual_encoded_consequence_is_required(self):
        good={0:self.frame(180,180),1.5:self.frame(450,600),3:self.frame(450,805)}
        self.assertGreater(inspect_opening(good)['3']['after']['x'],770)
        bad={**good,3:self.frame(180,180)}
        with self.assertRaises(CreativeReviewFailed):inspect_opening(bad)
        absent={**good,0:bytes(1080*1920*3)}
        with self.assertRaises(CreativeReviewFailed):inspect_opening(absent)

if __name__=='__main__':unittest.main()

class ScriptRepairTests(unittest.TestCase):
    def response(self,content):return {'candidates':[{'content':{'parts':[{'text':json.dumps(content)}]}}]}
    def test_one_invalid_script_can_be_corrected_before_narration(self):
        from unittest.mock import patch
        from automation.content import generate
        bad=story_content();bad['story']['takeaway'][0]='Check routing'
        with TemporaryDirectory() as folder,patch.dict('os.environ',{'GEMINI_API_KEY':'test-only'}),patch('automation.content.post',side_effect=[self.response(bad),self.response(story_content())]) as post:
            path=Path(folder)/'script-attempts.json';result=generate({'id':'lesson-08'},feedback={'status':'available','early_reels':[]},diagnostics=path)
            self.assertEqual(result['story']['version'],2);self.assertEqual(post.call_count,2)
            self.assertEqual([row['valid'] for row in json.loads(path.read_text())],[False,True])
    def test_latency_controls_are_only_sent_to_the_supported_model(self):
        from unittest.mock import patch
        from automation.content import generate
        for model in ['gemini-3-flash-preview','gemini-2.5-flash']:
            with patch.dict('os.environ',{'GEMINI_API_KEY':'test-only','GEMINI_MODEL':model}),patch('automation.content.post',return_value=self.response(story_content())) as post:
                generate({'id':'lesson-10'})
                options=post.call_args.kwargs
                self.assertEqual(options['read_timeout'],240)
                self.assertEqual(options['max_attempts'],2)
                conf=options['payload']['generationConfig']
                if model=='gemini-3-flash-preview':
                    self.assertEqual(conf['thinkingConfig']['thinkingLevel'],'minimal')
                    self.assertEqual(conf['temperature'],1.0)
                else:self.assertNotIn('thinkingConfig',conf)

    def test_invalid_second_script_stops_without_an_unbounded_loop(self):
        from unittest.mock import patch
        from automation.content import generate
        bad=story_content();bad['story']['takeaway'][0]='Check routing'
        with patch.dict('os.environ',{'GEMINI_API_KEY':'test-only'}),patch('automation.content.post',return_value=self.response(bad)) as post:
            with self.assertRaises(ValueError):generate({'id':'lesson-08'})
            self.assertEqual(post.call_count,2)
