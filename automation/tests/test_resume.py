import json
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch

from automation.produce import lesson_content
from automation.common import ROOT


class ResumeTests(unittest.TestCase):
    @patch('automation.produce.generate')
    def test_restored_script_is_reused_and_changed_packet_invalidates_it(self, generate):
        content = json.loads((ROOT/'automation/lessons/lesson-01.approved.json').read_text())
        generate.return_value = content
        with TemporaryDirectory() as folder:
            project = Path(folder)
            lesson = {'id': 'lesson-01', 'title': 'Requirements'}
            lesson_content(lesson, 'gemini', project, True)
            self.assertEqual(lesson_content(lesson, 'gemini', project, True), content)
            self.assertEqual(generate.call_count, 1)
            lesson_content({**lesson, 'title': 'Updated scope'}, 'gemini', project, True)
            self.assertEqual(generate.call_count, 2)

    @patch('automation.produce.generate')
    def test_invalid_cached_script_is_rejected_before_voice_requests(self, generate):
        content = json.loads((ROOT/'automation/lessons/lesson-01.approved.json').read_text())
        generate.return_value = content
        with TemporaryDirectory() as folder:
            project = Path(folder)
            lesson = {'id': 'lesson-01'}
            lesson_content(lesson, 'gemini', project, True)
            (project/'content.json').write_text('{"caption": "bad"}')
            with self.assertRaises(ValueError):
                lesson_content(lesson, 'gemini', project, True)
            self.assertEqual(generate.call_count, 1)
