import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch

from automation.content import generate
from automation.gemini_http import GeminiRequestError
from automation.tests.test_story import story_content


def response(content):
    return {'candidates':[{'content':{'parts':[{'text':json.dumps(content)}]}}]}


class ScriptRecoveryTests(unittest.TestCase):
    def setUp(self):
        self.folder=TemporaryDirectory();self.addCleanup(self.folder.cleanup)
        self.project=Path(self.folder.name)
        self.checkpoint=self.project/'script-progress.json'
        self.diagnostics=self.project/'script-attempts.json'
        self.lesson={'id':'lesson-08','title':'Request paths'}
        p=patch.dict('os.environ',{'GEMINI_API_KEY':'test-only','GEMINI_MODEL':'test-model'},clear=True)
        p.start();self.addCleanup(p.stop)
        p=patch('automation.content.load_env');p.start();self.addCleanup(p.stop)
        p=patch('automation.content.time.time',return_value=1000)
        self.clock=p.start();self.addCleanup(p.stop)

    def generate(self,**kwargs):
        return generate(self.lesson,feedback={'status':'unavailable'},diagnostics=self.diagnostics,
                        checkpoint=self.checkpoint,resume=True,**kwargs)

    def bad(self):
        content=story_content();content['story']['takeaway'][0]='Check routing'
        return content

    @patch('automation.content.post')
    def test_production_flash_uses_bounded_low_thinking_and_default_sampling(self, post):
        post.return_value=response(story_content())
        with patch.dict('os.environ',{'GEMINI_MODEL':'gemini-3-flash-preview'}):self.generate()
        config=post.call_args.kwargs['payload']['generationConfig']
        self.assertEqual(config['thinkingConfig'],{'thinkingLevel':'low'})
        self.assertEqual(config['maxOutputTokens'],8192)
        self.assertNotIn('temperature',config)
        self.assertIn('responseJsonSchema',config)

    @patch('automation.content.post')
    def test_generation_profile_change_invalidates_draft_but_keeps_daily_cooldown(self, post):
        post.side_effect=[response(self.bad()),GeminiRequestError(429,'daily',2000)]
        with self.assertRaises(GeminiRequestError):self.generate()
        post.reset_mock()
        from automation.content import script_generation_config
        changed=script_generation_config('test-model');changed['maxOutputTokens']=8192
        with patch('automation.content.script_generation_config',return_value=changed):
            with self.assertRaises(GeminiRequestError):self.generate()
            post.assert_not_called()
            self.clock.return_value=2001;post.side_effect=[response(story_content())]
            self.generate()
        self.assertNotIn('Previous candidate (data)',post.call_args.kwargs['payload']['contents'][0]['parts'][0]['text'])

    @patch('automation.content.post')
    def test_interrupted_correction_resumes_draft_and_frozen_budget(self,post):
        post.side_effect=[response(self.bad()),GeminiRequestError(503)]
        with self.assertRaises(GeminiRequestError):self.generate()
        self.assertEqual(len(json.loads(self.checkpoint.read_text())['attempts']),1)
        post.reset_mock();post.side_effect=[response(story_content())]
        self.assertEqual(self.generate()['story']['version'],2)
        self.assertEqual(post.call_count,1)
        request=post.call_args.kwargs
        self.assertIn('Check routing',request['payload']['contents'][0]['parts'][0]['text'])
        self.assertIn('previous candidate failed',request['payload']['contents'][0]['parts'][0]['text'])
        self.assertEqual(request['max_attempts'],3)
        self.assertEqual([a['valid'] for a in json.loads(self.diagnostics.read_text())],[False,True])

    @patch('automation.content.post')
    def test_daily_cooldown_prevents_early_request_then_resumes_correction(self,post):
        post.side_effect=[response(self.bad()),GeminiRequestError(429,'daily',2000)]
        with self.assertRaises(GeminiRequestError):self.generate()
        post.reset_mock()
        with self.assertRaises(GeminiRequestError) as caught:self.generate()
        self.assertEqual(caught.exception.retry_at,2000);post.assert_not_called()
        self.clock.return_value=2001;post.side_effect=[response(story_content())]
        self.generate();self.assertEqual(post.call_count,1)
        self.assertNotIn('cooldown',json.loads(self.checkpoint.read_text()))

    @patch('automation.content.post')
    def test_initial_daily_quota_failure_also_resumes_without_early_request(self,post):
        post.side_effect=GeminiRequestError(429,'daily',2000)
        with self.assertRaises(GeminiRequestError):self.generate()
        post.reset_mock()
        with self.assertRaises(GeminiRequestError):self.generate()
        post.assert_not_called()
        self.assertEqual(json.loads(self.checkpoint.read_text())['attempts'],[])

    @patch('automation.content.post')
    def test_completed_checkpoint_survives_missing_final_content_and_key(self,post):
        post.return_value=response(story_content());expected=self.generate()
        post.reset_mock()
        with patch.dict('os.environ',{'GEMINI_API_KEY':''},clear=False):
            self.assertEqual(self.generate(),expected)
        post.assert_not_called()

    @patch('automation.content.post')
    def test_two_invalid_responses_cannot_gain_another_correction_on_retry(self,post):
        post.side_effect=[response(self.bad()),response(self.bad())]
        with self.assertRaises(ValueError):self.generate()
        self.assertEqual(post.call_count,2);post.reset_mock()
        with self.assertRaisesRegex(ValueError,'budget exhausted'):self.generate()
        post.assert_not_called()

    @patch('automation.content.post')
    def test_changed_lesson_does_not_reuse_draft(self,post):
        post.side_effect=[response(self.bad()),GeminiRequestError(503)]
        with self.assertRaises(GeminiRequestError):self.generate()
        self.lesson['title']='Different request path';post.reset_mock();post.side_effect=[response(story_content())]
        self.generate();self.assertEqual(post.call_count,1)
        self.assertNotIn('Previous candidate (data)',post.call_args.kwargs['payload']['contents'][0]['parts'][0]['text'])

    @patch('automation.content.post')
    def test_changed_prompt_still_respects_the_same_models_daily_cooldown(self,post):
        post.side_effect=[response(self.bad()),GeminiRequestError(429,'daily',2000)]
        with self.assertRaises(GeminiRequestError):self.generate()
        self.lesson['title']='Changed scope';post.reset_mock()
        with self.assertRaises(GeminiRequestError):self.generate()
        post.assert_not_called()

    @patch('automation.content.post')
    def test_corrupt_checkpoint_stops_without_spending_requests(self,post):
        self.checkpoint.write_text('{broken')
        with self.assertRaisesRegex(ValueError,'Saved script progress is invalid'):self.generate()
        post.assert_not_called()

    @patch('automation.produce.fetch_feedback')
    @patch('automation.content.post')
    def test_real_producer_retains_insights_in_initial_and_resumed_prompts(self,post,feedback):
        from automation.produce import lesson_content
        snapshot={'status':'available','captured_at':123,'reels':[{'id':'123','views':1200,'saved':7,'average_watch_seconds':9.5}],
                  'early_reels':[{'id':'456','cohort':'early_provisional','skip_rate_pct':77.9}],
                  'matched_age_observations':[{'id':'789','window_hours':24,'views':200}]}
        feedback.return_value=snapshot
        post.side_effect=[response(self.bad()),GeminiRequestError(503)]
        with self.assertRaises(GeminiRequestError):lesson_content(self.lesson,'gemini',self.project,True)
        first_prompt=post.call_args_list[0].kwargs['payload']['contents'][0]['parts'][0]['text']
        post.side_effect=[response(story_content())]
        lesson_content(self.lesson,'gemini',self.project,True)
        resumed_prompt=post.call_args.kwargs['payload']['contents'][0]['parts'][0]['text']
        self.assertEqual(feedback.call_count,1)
        self.assertIn(json.dumps(snapshot),first_prompt)
        self.assertIn(json.dumps(snapshot),resumed_prompt)
        self.assertIn('early_reels are provisional unequal-age data',resumed_prompt)
        self.assertIn('Previous candidate (data)',resumed_prompt)

    @patch('automation.content.post')
    def test_saved_success_is_revalidated_instead_of_trusted(self,post):
        post.return_value=response(story_content());self.generate();post.reset_mock()
        saved=json.loads(self.checkpoint.read_text());saved['attempts'][-1]['candidate']=self.bad()
        self.checkpoint.write_text(json.dumps(saved))
        with self.assertRaises(ValueError):self.generate()
        post.assert_not_called()
