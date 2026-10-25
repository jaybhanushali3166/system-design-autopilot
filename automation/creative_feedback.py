"""Bounded descriptive Insights for scripts. Instagram credentials stay in the Worker."""
from __future__ import annotations
import json,os
from urllib.parse import urlsplit
import requests
from .common import ROOT


def policy():
    return json.loads((ROOT/'automation/creative-policy.json').read_text())


def fetch_feedback():
    origin=os.environ.get('AUTOPILOT_WORKER_URL','').rstrip('/')
    token=os.environ.get('AUTOPILOT_CALLBACK_TOKEN','')
    parsed=urlsplit(origin)
    if parsed.scheme!='https' or not parsed.hostname or parsed.username or parsed.password or parsed.query or parsed.fragment or not token:
        return {'status':'unavailable','reason':'configured_worker_access_missing'}
    try:
        response=requests.get(origin+'/api/creative-feedback',headers={'Authorization':'Bearer '+token},timeout=(5,35))
        if not response.ok:return {'status':'unavailable','reason':'insights_request_rejected','http':response.status_code}
        raw=response.json()
        if raw.get('status') not in ['available','partial','unavailable']:raise ValueError('Unexpected status')
        # No raw captions, profile text, URLs, provider messages or credentials enter the prompt.
        result={'status':raw['status'],'source':'instagram_graph_api','observation':'lifetime_at_snapshot_unequal_ages_no_causal_winner'}
        for k in ['captured_at','lookback_days','minimum_age_hours','returned_media','eligible_media','failed_media']:
            if isinstance(raw.get(k),(int,float)):result[k]=raw[k]
        result['reels']=[]
        for row in raw.get('reels',[])[:20]:
            if not isinstance(row,dict) or not str(row.get('id','')).isdigit():continue
            cleaned={'id':row['id']}
            lesson=row.get('lesson')
            if isinstance(lesson,str) and __import__('re').fullmatch(r'lesson-(0[1-9]|[1-5][0-9]|60)',lesson):cleaned['lesson']=lesson
            for k in ['age_hours','views','reach','likes','saved','shares','average_watch_seconds','skip_rate_pct']:
                v=row.get(k)
                if isinstance(v,(int,float)) and not isinstance(v,bool) and __import__('math').isfinite(v) and v>=0:cleaned[k]=v
            result['reels'].append(cleaned)
        return result
    except (requests.RequestException,ValueError,TypeError,AttributeError):
        return {'status':'unavailable','reason':'insights_temporarily_unavailable'}
