import datetime as dt,json,unittest
from zoneinfo import ZoneInfo
from automation.catalog import build_catalog,schedule
from automation.common import ROOT,config
from automation.content import validate
from automation.voice import utterances
class PipelineTests(unittest.TestCase):
 def test_catalog_covers_all_lessons(self):
  lessons=build_catalog();self.assertEqual([x['number'] for x in lessons],list(range(1,61)))
  self.assertEqual(len({x['series'] for x in lessons}),10)
 def test_ist_schedule_correctly_crosses_utc_date_boundary(self):
  rows=schedule(build_catalog(),config(),'2026-10-15')
  self.assertEqual(dt.datetime.fromtimestamp(rows[0]['publish_at'],dt.timezone.utc).isoformat(),'2026-10-15T05:30:00+00:00')
  self.assertEqual(dt.datetime.fromtimestamp(rows[0]['generate_at'],dt.timezone.utc).isoformat(),'2026-10-14T23:30:00+00:00')
  for row in rows:
   local=dt.datetime.fromtimestamp(row['publish_at'],ZoneInfo('Asia/Kolkata'))
   self.assertIn(local.weekday(),[1,3,5]);self.assertEqual((local.hour,local.minute),(11,0))
  self.assertTrue(all(a['publish_at']<b['publish_at'] for a,b in zip(rows,rows[1:])))
 def test_next_valid_day_and_year_transition(self):
  rows=schedule(build_catalog(),config(),'2026-12-30')
  self.assertEqual(dt.datetime.fromtimestamp(rows[0]['publish_at'],ZoneInfo('Asia/Kolkata')).date().isoformat(),'2026-12-31')
  self.assertEqual(dt.datetime.fromtimestamp(rows[1]['publish_at'],ZoneInfo('Asia/Kolkata')).date().isoformat(),'2027-01-02')
 def test_reviewed_pilots_have_valid_content(self):
  for name in ['lesson-01','lesson-28']:
   data=json.loads((ROOT/'automation/lessons'/f'{name}.approved.json').read_text());validate(data)
 def test_schema_rejects_out_of_budget_content(self):
  data=json.loads((ROOT/'automation/lessons/lesson-01.approved.json').read_text())
  data['scenes'][0]['nodes'][0]['label']='x'*25
  with self.assertRaises(ValueError):validate(data)
 def test_caption_utterances_are_synthesized_units(self):
  text='First, protect the invariant. Then inspect the affected rows.'
  self.assertEqual(utterances(text),['First, protect the invariant.','Then inspect the affected rows.'])
if __name__=='__main__':unittest.main()
