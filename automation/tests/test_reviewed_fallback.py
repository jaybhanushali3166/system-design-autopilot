import hashlib,json,unittest
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch
from automation.produce import reviewed_script_fallback,lesson_content
from automation.common import ROOT
from automation.gemini_http import GeminiRequestError

class ReviewedFallbackTests(unittest.TestCase):
 def setUp(self):
  self.content=json.loads((ROOT/'automation/lessons/lesson-08.approved.json').read_text())
 def test_fallback_needs_explicit_matching_review_hash(self):
  with TemporaryDirectory() as d:
   root=Path(d);folder=root/'automation/lessons';folder.mkdir(parents=True)
   path=folder/'lesson-10.approved.json';path.write_text(json.dumps(self.content));sha=hashlib.sha256(path.read_bytes()).hexdigest()
   with patch('automation.produce.ROOT',root),patch('automation.produce.config',return_value={}):
    self.assertIsNone(reviewed_script_fallback({'id':'lesson-10'}))
   with patch('automation.produce.ROOT',root),patch('automation.produce.config',return_value={'reviewed_script_fallbacks':{'lesson-10':sha}}):
    self.assertEqual(reviewed_script_fallback({'id':'lesson-10'}),self.content)
    path.write_text('{}')
    with self.assertRaises(ValueError):reviewed_script_fallback({'id':'lesson-10'})
 def test_quota_failure_uses_only_explicit_reviewed_lesson_and_writes_provenance(self):
  with TemporaryDirectory() as d,patch('automation.produce.generate',side_effect=GeminiRequestError(429,'daily')),patch('automation.produce.fetch_feedback',return_value={'status':'unavailable'}),patch('automation.produce.reviewed_script_fallback',return_value=self.content):
   p=Path(d);self.assertEqual(lesson_content({'id':'lesson-10'},'gemini',p,False),self.content)
   self.assertEqual(json.loads((p/'script-fallback.json').read_text())['source'],'reviewed_hash_pinned_script')
 def test_no_reviewed_fallback_preserves_failure(self):
  with TemporaryDirectory() as d,patch('automation.produce.generate',side_effect=GeminiRequestError(503)),patch('automation.produce.fetch_feedback',return_value={}),patch('automation.produce.reviewed_script_fallback',return_value=None):
   with self.assertRaises(GeminiRequestError):lesson_content({'id':'lesson-10'},'gemini',Path(d),False)

class MechanismPreflightTests(unittest.TestCase):
 def test_fetch_and_revalidation_are_valid_route_language(self):
  from automation.content import validate
  c=json.loads((ROOT/'automation/lessons/lesson-10.approved.json').read_text())
  self.assertEqual(validate(c),c)
 def test_action_mismatch_is_rejected_before_narration(self):
  from automation.content import validate
  c=json.loads((ROOT/'automation/lessons/lesson-10.approved.json').read_text())
  c['scenes'][5]['narration']='The stored object remains visible here while the illustration changes its appearance for this next demonstration.'
  c['scenes'][5]['note']='A different illustration.'
  with self.assertRaises(ValueError):validate(c)

class CorrectionFeedbackTests(unittest.TestCase):
 def test_feedback_reports_word_count_and_endpoint_mismatch_together(self):
  from automation.content import correction_feedback
  c={'scenes':[{'narration':'An image request waits.','action':'cache-hit','nodes':[{},{}]}]}
  message=correction_feedback(c,ValueError('Invalid candidate'))
  self.assertIn('4 words',message);self.assertIn('exactly 4 nodes',message);self.assertIn('never below 130',message)
