"""Trusted editorial plans, separate from untrusted descriptive Insights."""
from __future__ import annotations
import json
from .common import ROOT
FORMATS=['debug','prediction','tradeoff']
OPENERS={'debug':['scan','block','queue'],'prediction':['queue','route','scan'],'tradeoff':['lookup','route','block']}
def storyboard_plan(lesson):
 number=int(lesson.get('number') or lesson.get('id','lesson-00').split('-')[-1])
 if number<12:return None
 plans=json.loads((ROOT/'automation/storyboards.json').read_text())
 if lesson['id'] in plans['lessons']:return plans['lessons'][lesson['id']]
 style=FORMATS[(number-12)%len(FORMATS)]
 return {'format':style,
         'hook':lesson.get('hook','Show one concrete consequence immediately'),
         'visual':'Choose a supported opening action that actually depicts this topic, not an unrelated failure. One evolving input; show a failure, prediction or trade-off appropriate to this topic. Avoid the repeated two-lane race.',
         'recipient':'A developer facing the problem in this curriculum packet',
         'ending':'One or two practical checks someone can apply later'}
