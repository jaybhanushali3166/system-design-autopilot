"""Measurable story requirements, checked before narration and rendering."""
from __future__ import annotations
import re,json

ACTIONS=['compare','route','block','queue','fanout','select','retry','replicate','lookup','cache-hit','cache-miss','scan','checklist']
OPENING_FIELDS={'subject','before_label','after_label','before_reason','after_reason','before_result','after_result','before_action','result_at'}

def validate_story(content):
    if isinstance(content.get('story'),dict) and content['story'].get('version')==3:return validate_story_v3(content)
    story=content.get('story')
    if not isinstance(story,dict) or set(story)!={'version','example','opening','takeaway'} or story.get('version')!=2:raise ValueError('Story contract v2 required')
    if not isinstance(story['example'],str) or not 1<=len(story['example'])<=24:raise ValueError('One bounded worked example required')
    opening=story['opening']
    if not isinstance(opening,dict) or set(opening)!=OPENING_FIELDS:raise ValueError('Opening demonstration fields required')
    for key in OPENING_FIELDS-{'before_action','result_at'}:
        if not isinstance(opening[key],str) or not 1<=len(opening[key])<=30:raise ValueError('Opening text exceeds physical layout')
    if len(opening['subject'])>6:raise ValueError('Carrier label must fit the physical packet')
    if opening['before_action'] not in ['wait','block']:raise ValueError('Opening needs a visible wait or rejection')
    if opening['before_result'].casefold()==opening['after_result'].casefold():raise ValueError('Opening consequences must differ')
    if isinstance(opening['result_at'],bool) or opening['result_at']!=2.4:raise ValueError('Opening result must land at 2.4 seconds')
    scenes=content.get('scenes',[])
    if len(scenes)!=8 or scenes[0].get('action')!='compare' or scenes[-1].get('action')!='checklist':raise ValueError('Eight story beats must begin with proof and end in a diagnostic')
    if not 8<=len(scenes[0]['narration'].split())<=18:raise ValueError('Opening narration must reach the consequence in 8–18 words')
    if not re.search(r'\b(reaches|arrives|stops|rejects|waits|reuses|skips|routes|returns|keeps|blocks|finds|sends|serves|gets|goes|passes|moves|loads|answers|drains|avoids|bypasses|protects|limits|accepts|delivers|chooses|flows|stalls|finishes|completes|hits|misses|rejected|allowed)\b',scenes[0]['narration'],re.I):raise ValueError('Opening must state an observable consequence')
    if scenes[1].get('action') in ['compare','checklist']:raise ValueError('Second beat must advance the example')
    for i,scene in enumerate(scenes):
        action=scene.get('action')
        if len(scene['title'])>44:raise ValueError('Story title exceeds opening reading budget')
        if any(len(n['label'])>18 or len(n['value'])>24 for n in scene['nodes']):raise ValueError('Endpoint text exceeds physical mechanism budget')
        if action not in ACTIONS:raise ValueError('Unsupported mechanism action')
        if not 8<=len(scene['narration'].split())<=28:raise ValueError('Each beat must contain 8–28 spoken words')
        if i not in [0,7] and action in ['compare','checklist']:raise ValueError('Middle beats must demonstrate a mechanism')
        required=4 if action in ['fanout','select','replicate','cache-hit','cache-miss'] else 3
        if action not in ['compare','checklist'] and len(scene['nodes'])!=required:raise ValueError('Mechanism endpoint count does not match its action')
    # Reject substantial repeated setup rather than relying on another prompt reminder.
    token=lambda s:re.findall(r'[a-z0-9]+',s.lower())
    a,b=[token(s['narration']) for s in scenes[:2]]
    grams=lambda w:{tuple(w[i:i+4]) for i in range(len(w)-3)}
    ga,gb=grams(a),grams(b)
    if ga and gb and len(ga&gb)/min(len(ga),len(gb))>.25:raise ValueError('Opening setup is repeated instead of advanced')
    takeaway=story['takeaway']
    if not isinstance(takeaway,list) or len(takeaway)!=3:raise ValueError('Three practical diagnostic checks required')
    for line in takeaway:
        if not isinstance(line,str) or not 4<=len(line.split())<=10 or len(line)>66:raise ValueError('Diagnostic line exceeds reading budget')
        if not re.match(r'^(Check|Compare|Inspect|Trace|Measure|Test|Record|Verify|Watch|Limit|Set|Find|Confirm|Separate|Count|Review|Choose|Log|Keep|Ask)\b',line):raise ValueError('Takeaway must state a concrete action')
    combined=json.dumps(content)
    if re.search(r'\b(instantly|always faster|guaranteed|guarantees (?:success|availability|reliability|speed|zero|no)|best for|zero latency|never fails|eliminates all)\b',combined,re.I):raise ValueError('Unqualified performance claim needs correction')
    if re.search(r'\b[0-9]+(?:\.[0-9]+)?\s*(?:ms|milliseconds|seconds|ns|qps|rps|GB|MB|TB|%)\b',combined,re.I) and 'hypothetical' not in combined.lower():raise ValueError('Numeric performance example must explicitly be hypothetical')
    return story


def validate_story_v3(content):
    story=content['story']
    if set(story)!={'version','format','example','opening','takeaway'} or story['format'] not in ['debug','prediction','tradeoff']:raise ValueError('Storyboard format is invalid')
    if not isinstance(story['example'],str) or not 1<=len(story['example'])<=24:raise ValueError('One bounded worked example required')
    opening=story['opening']
    if not isinstance(opening,dict) or set(opening)!={'subject','outcome','result_at'}:raise ValueError('Opening demonstration fields required')
    if not isinstance(opening['subject'],str) or not 1<=len(opening['subject'])<=6:raise ValueError('Carrier label must fit the physical packet')
    if not isinstance(opening['outcome'],str) or not 1<=len(opening['outcome'])<=40:raise ValueError('Opening consequence exceeds reading budget')
    if type(opening['result_at']) not in [int,float] or opening['result_at']!=2.4:raise ValueError('Opening result must land at 2.4 seconds')
    scenes=content.get('scenes',[])
    if not 6<=len(scenes)<=8 or scenes[-1]['action']!='checklist':raise ValueError('Six to eight beats must end in a usable reference')
    if scenes[0]['action'] not in ['scan','block','queue','route','lookup']:raise ValueError('Opening must show a supported concrete mechanism')
    if not 8<=len(scenes[0]['narration'].split())<=18:raise ValueError('Opening narration must reach the consequence in 8–18 words')
    for i,scene in enumerate(scenes):
        action=scene['action']
        if action not in ACTIONS or action=='compare' or (i<len(scenes)-1 and action=='checklist'):raise ValueError('Storyboard action is invalid')
        if len(scene['title'])>44 or any(len(n['label'])>18 or len(n['value'])>24 for n in scene['nodes']):raise ValueError('Storyboard text exceeds reading budget')
        if not 8<=len(scene['narration'].split())<=28:raise ValueError('Each beat must contain 8–28 spoken words')
        required=4 if action in ['fanout','select','replicate','cache-hit','cache-miss'] else 3
        if action!='checklist' and len(scene['nodes'])!=required:raise ValueError('Mechanism endpoint count does not match its action')
    token=lambda text:re.findall(r'[a-z0-9]+',text.lower())
    grams=lambda words:{tuple(words[i:i+4]) for i in range(len(words)-3)}
    a,b=[grams(token(s['narration'])) for s in scenes[:2]]
    if a and b and len(a&b)/min(len(a),len(b))>.25:raise ValueError('Opening setup is repeated instead of advanced')
    if not isinstance(story['takeaway'],list) or not 1<=len(story['takeaway'])<=2:raise ValueError('One or two practical checks required')
    for line in story['takeaway']:
        if not isinstance(line,str) or not 4<=len(line.split())<=10 or len(line)>66:raise ValueError('Diagnostic line exceeds reading budget')
        if not re.match(r'^(Check|Compare|Inspect|Trace|Measure|Test|Record|Verify|Watch|Limit|Set|Find|Confirm|Separate|Count|Review|Choose|Log|Keep|Ask)\b',line):raise ValueError('Takeaway must state a concrete action')
    combined=json.dumps(content)
    if re.search(r'\b(instantly|always faster|guaranteed|guarantees (?:success|availability|reliability|speed|zero|no)|best for|zero latency|never fails|eliminates all)\b',combined,re.I):raise ValueError('Unqualified performance claim needs correction')
    if re.search(r'\b[0-9]+(?:\.[0-9]+)?\s*(?:ms|milliseconds|seconds|ns|qps|rps|GB|MB|TB|%)\b',combined,re.I) and 'hypothetical' not in combined.lower():raise ValueError('Numeric performance example must explicitly be hypothetical')
    return story
