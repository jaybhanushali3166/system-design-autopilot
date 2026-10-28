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

    @patch('automation.content.post')
    def test_saved_success_is_revalidated_instead_of_trusted(self,post):
        post.return_value=response(story_content());self.generate();post.reset_mock()
        saved=json.loads(self.checkpoint.read_text());saved['attempts'][-1]['candidate']=self.bad()
        self.checkpoint.write_text(json.dumps(saved))
        with self.assertRaises(ValueError):self.generate()
        post.assert_not_called()
