import unittest
from automation.catalog import build_catalog
from automation.thumbnail import specification


class ThumbnailTests(unittest.TestCase):
    def test_every_lesson_has_a_bounded_cover_and_module_identity(self):
        lessons = build_catalog()
        for lesson in lessons:
            with self.subTest(lesson=lesson['id']):
                spec = specification(lesson, lessons)
                self.assertLessEqual(len(spec['item']['title']), 32)
                self.assertEqual(len(spec['diagram']['nodes']), 3)
                for label, value in spec['diagram']['nodes']:
                    self.assertLessEqual(len(label), 22)
                    self.assertLessEqual(len(value), 30)
                self.assertLessEqual(len(spec['diagram']['note']), 100)
                self.assertIn(lesson['series_title'].upper(), spec['sectionLabel'])

    def test_video_number_resets_at_module_boundaries(self):
        lessons = build_catalog()
        for first, last, total in [(1, 5, 5), (6, 10, 5), (11, 17, 7), (18, 22, 5),
                                   (23, 29, 7), (30, 35, 6), (36, 41, 6), (42, 46, 5),
                                   (47, 52, 6), (53, 60, 8)]:
            start = specification(lessons[first - 1], lessons)
            end = specification(lessons[last - 1], lessons)
            self.assertEqual((start['module']['video'], start['module']['total']), (1, total))
            self.assertEqual((end['module']['video'], end['module']['total']), (total, total))
            self.assertIn(f'VIDEO 1 OF {total}', start['item']['category'])
            self.assertIn(f'VIDEO {total} OF {total}', end['item']['category'])
            self.assertIn(f'LESSON {last:02} / 60', end['footerLabel'])


if __name__ == '__main__':
    unittest.main()
