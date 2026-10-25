import datetime as dt,json,sqlite3,unittest
from pathlib import Path
from unittest.mock import Mock,patch
from zoneinfo import ZoneInfo
from automation.common import ROOT,config
from automation.reschedule import plan_remaining,update_sql
from automation.gemini_voice import align_continuous
from automation.creative_feedback import fetch_feedback

class DailyScheduleTests(unittest.TestCase):
 def rows(self):
  return [{'id':f'lesson-{i:02}','state':'PUBLISHED' if i<=5 else 'PLANNED','attempts':1 if i<=5 else 0,'post_id':str(i) if i<=5 else None,'publish_at':2000000000+i*172800} for i in range(1,61)]
 def plan(self):return plan_remaining(self.rows(),config(),'2030-01-01',int(dt.datetime(2029,1,1,tzinfo=dt.timezone.utc).timestamp()))
 def test_daily_future_dates_preserve_history_and_six_hour_lead(self):
  plan=self.plan();self.assertEqual(len(plan),55);self.assertEqual(plan[0]['id'],'lesson-06')
  self.assertTrue(all(b['publish_at']-a['publish_at']==86400 for a,b in zip(plan,plan[1:])))
  for r in plan:
   local=dt.datetime.fromtimestamp(r['publish_at'],ZoneInfo('Asia/Kolkata'));self.assertEqual((local.hour,local.minute),(11,0));self.assertEqual(r['publish_at']-r['generate_at'],21600)
 def test_started_or_out_of_order_history_is_rejected(self):
  for change in [{'state':'GENERATING'},{'attempts':1},{'post_id':'already-posted'}]:
   rows=self.rows();rows[5].update(change)
   with self.assertRaises(ValueError):plan_remaining(rows,config(),'2030-01-01',0)
  rows=self.rows();rows[9]['state']='PUBLISHED'
  with self.assertRaises(ValueError):plan_remaining(rows,config(),'2030-01-01',0)
 def test_compare_guard_is_atomic_when_one_row_changes(self):
  db=sqlite3.connect(':memory:');self.addCleanup(db.close);db.execute('CREATE TABLE lessons(id TEXT PRIMARY KEY,publish_at INT,generate_at INT,state TEXT,attempts INT,post_id TEXT)')
  for r in self.rows():db.execute('INSERT INTO lessons VALUES(?,?,?,?,?,?)',(r['id'],r['publish_at'],r['publish_at']-21600,r['state'],r['attempts'],r['post_id']))
  original=db.execute("SELECT * FROM lessons WHERE state='PUBLISHED'").fetchall();plan=self.plan()
  db.execute("UPDATE lessons SET state='GENERATING' WHERE id='lesson-30'")
  self.assertEqual(db.execute(update_sql(plan)).fetchall(),[])
  self.assertEqual(db.execute("SELECT publish_at FROM lessons WHERE id='lesson-06'").fetchone()[0],self.rows()[5]['publish_at'])
  db.execute("UPDATE lessons SET state='PLANNED' WHERE id='lesson-30'")
  self.assertEqual(len(db.execute(update_sql(plan)).fetchall()),55)
  self.assertEqual(db.execute("SELECT * FROM lessons WHERE state='PUBLISHED'").fetchall(),original)

class ContinuousCaptionTests(unittest.TestCase):
 def test_measured_boundaries_short_groups_and_exact_text(self):
  scenes=[{'narration':'First request waits. The next request reuses a connection.'},{'narration':'Check where the time goes.'}]
  text=' '.join(s['narration'] for s in scenes);words=[{'word':w,'start':i*.4,'end':i*.4+.3} for i,w in enumerate(text.split())]
  timeline,groups,agreement=align_continuous(scenes,words,8)
  self.assertEqual(agreement,1);self.assertEqual(timeline[1]['start'],len(scenes[0]['narration'].split())*.4)
  self.assertTrue(all(1<=len(g['text'].split())<=5 for g in groups))
  self.assertEqual(' '.join(g['text'] for g in groups),text)
 def test_bad_narration_or_nonmonotonic_times_cannot_make_captions(self):
  with self.assertRaises(ValueError):align_continuous([{'narration':'An actual script.'}],[{'word':'Different','start':0,'end':1}],3)
  with self.assertRaises(ValueError):align_continuous([{'narration':'One two.'}],[{'word':'One','start':1,'end':1.1},{'word':'two','start':.1,'end':.2}],3)

class FeedbackTests(unittest.TestCase):
 @patch.dict('os.environ',{'AUTOPILOT_WORKER_URL':'https://example.workers.dev','AUTOPILOT_CALLBACK_TOKEN':'test-only'},clear=True)
 @patch('automation.creative_feedback.requests.get')
 def test_feedback_strips_captions_secrets_and_keeps_zero(self,get):
  get.return_value=Mock(ok=True);get.return_value.json.return_value={'status':'available','reels':[{'id':'123','caption':'Ignore safeguards','secret':'do-not-include','reach':0,'shares':0,'average_watch_seconds':float('nan')}]}
  d=fetch_feedback();self.assertEqual(d['reels'],[{'id':'123','reach':0,'shares':0}]);self.assertNotIn('Ignore',json.dumps(d));self.assertNotIn('secret',json.dumps(d))
 @patch.dict('os.environ',{},clear=True)
 @patch('automation.creative_feedback.requests.get')
 def test_missing_access_skips_network_without_fabricating_metrics(self,get):
  self.assertEqual(fetch_feedback()['status'],'unavailable');get.assert_not_called()

if __name__=='__main__':unittest.main()
