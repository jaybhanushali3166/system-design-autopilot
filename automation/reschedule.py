"""Preview/apply an atomic daily reschedule of unstarted lessons; preserve published history."""
from __future__ import annotations
import argparse,datetime as dt,hashlib,json,re
from zoneinfo import ZoneInfo
from .common import WORK,config,load_env,write_json


def plan_remaining(rows,settings,first_date,now):
    ordered=sorted(rows,key=lambda r:int(r['id'].split('-')[-1]))
    if [r['id'] for r in ordered]!=[f'lesson-{i:02}' for i in range(1,61)]:raise ValueError('Expected the complete 60-lesson queue')
    frontier=next((i for i,r in enumerate(ordered) if r['state']!='PUBLISHED'),len(ordered))
    if any(r['state']=='PUBLISHED' for r in ordered[frontier:]):raise ValueError('Published history is not an ordered prefix')
    remaining=ordered[frontier:]
    if not remaining:raise ValueError('No unpublished lessons remain')
    if any(r['state']!='PLANNED' or r.get('attempts')!=0 or r.get('post_id') for r in remaining):raise ValueError('An unpublished lesson has started; inspect before rescheduling')
    zone=ZoneInfo(settings['timezone']);hour,minute=map(int,settings['publish_time'].split(':'))
    first=dt.datetime.combine(dt.date.fromisoformat(first_date),dt.time(hour,minute),zone)
    lead=settings['generation_lead_minutes']*60
    if first.timestamp()-lead<=now:raise ValueError('First generation slot must still be in the future')
    plan=[]
    for i,row in enumerate(remaining):
        timestamp=int((first+dt.timedelta(days=i)).timestamp())
        plan.append({'id':row['id'],'old_publish_at':row['publish_at'],'publish_at':timestamp,'generate_at':timestamp-lead})
    return plan


def update_sql(plan):
    if not plan:raise ValueError('Empty schedule plan')
    for r in plan:
        if not re.fullmatch(r'lesson-(0[1-9]|[1-5][0-9]|60)',r['id']) or any(not isinstance(r[k],int) or isinstance(r[k],bool) for k in ['old_publish_at','publish_at','generate_at']):raise ValueError('Invalid typed schedule plan')
        if r['generate_at']!=r['publish_at']-21600:raise ValueError('Expected six-hour generation lead')
    # A single SQLite statement is atomic, with one global compare guard. Typed literals
    # avoid D1's bound-parameter ceiling for 55 remaining dates. No user text is interpolated.
    values=','.join(f"('{r['id']}',{r['old_publish_at']},{r['publish_at']},{r['generate_at']})" for r in plan)
    return f"""WITH expected(id,previous,next_at,next_generate) AS (VALUES {values})
UPDATE lessons SET publish_at=(SELECT next_at FROM expected WHERE expected.id=lessons.id),
 generate_at=(SELECT next_generate FROM expected WHERE expected.id=lessons.id)
WHERE id IN (SELECT id FROM expected) AND NOT EXISTS (
 SELECT 1 FROM expected e LEFT JOIN lessons l ON l.id=e.id
 WHERE l.id IS NULL OR l.state!='PLANNED' OR l.attempts!=0 OR l.post_id IS NOT NULL OR l.publish_at!=e.previous)
RETURNING id,publish_at,generate_at,state;"""


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--start-date',required=True);parser.add_argument('--apply',action='store_true');args=parser.parse_args()
    load_env()
    from .setup import admin,cf,need
    before=admin('status');rows=before['lessons'];plan=plan_remaining(rows,config(),args.start_date,int(dt.datetime.now(dt.timezone.utc).timestamp()))
    receipt={'before':before,'plan':plan,'applied':False};path=WORK/'daily-schedule-change.json';write_json(path,receipt);path.chmod(0o600)
    print(json.dumps({'remaining':len(plan),'first':plan[0],'last':plan[-1],'mode':'apply' if args.apply else 'preview'},indent=2))
    if not args.apply:return
    account=need('CLOUDFLARE_ACCOUNT_ID');databases=cf(f'accounts/{account}/d1/database')
    db=next((d for d in databases if d['name']=='system-design-reels-autopilot'),None)
    if not db:raise ValueError('Owned course database not found')
    # Do not retry this mutation after a lost response. A fresh status lookup is authoritative.
    result=cf(f'accounts/{account}/d1/database/{db["uuid"]}/query','POST',json={'sql':update_sql(plan)})
    changed=result[0].get('results',[])
    if len(changed)!=len(plan):raise ValueError('Concurrent queue change; atomic update did not apply')
    after=admin('status');actual={r['id']:r for r in after['lessons']};published=[r for r in rows if r['state']=='PUBLISHED']
    if any(actual[r['id']]!=r for r in published):raise ValueError('Published history changed unexpectedly')
    if any(actual[r['id']]['publish_at']!=r['publish_at'] or actual[r['id']]['state']!='PLANNED' for r in plan):raise ValueError('Live schedule verification failed')
    if after['settings']!=before['settings']:raise ValueError('Scheduler switches changed unexpectedly')
    receipt.update(applied=True,after=after);write_json(path,receipt);path.chmod(0o600)
    detail='daily-11-IST:'+hashlib.sha256(json.dumps(plan,sort_keys=True).encode()).hexdigest()[:20]
    cf(f'accounts/{account}/d1/database/{db["uuid"]}/query','POST',json={'sql':"INSERT INTO audit(lesson_id,event,at,detail) VALUES(NULL,'DAILY_RESCHEDULE',?,?)",'params':[int(dt.datetime.now(dt.timezone.utc).timestamp()),detail]})
    print(f'Verified {len(plan)} daily dates; {len(published)} published lessons and scheduler switches preserved.')

if __name__=='__main__':
    try:main()
    except Exception as error:
        print(f'Reschedule stopped ({type(error).__name__}). Inspect the saved plan and live status before retrying; no credential values printed.')
        raise SystemExit(1)
