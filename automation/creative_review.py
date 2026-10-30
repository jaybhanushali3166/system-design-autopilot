"""Local story gate: actual encoded opening positions plus constrained mechanism/story checks.

This is deterministic verification, not a claim of automated human-level editorial judgment.
Frames stay on the runner and in its existing review artifact.
"""
from __future__ import annotations
import hashlib,json,re,subprocess
from .common import write_json
from .story_contract import validate_story

class CreativeReviewFailed(ValueError):pass

MECHANISM_WORDS={
 'route':['route','rout','send','forward','reach','request','service','proxy','gateway','path','connect','fetch','revalidat'],
 'block':['reject','stop','denied','check','auth','token','limit','allow','block','valid','permission','private','no-store'],
 'queue':['queue','wait','backlog','worker','work','task','buffer','arriv','drain'],
 'fanout':['parallel','fan','both','multiple','aggregate','combine','backend','service'],
 'select':['balanc','healthy','instance','select','choose','chosen','route'],
 'replicate':['copy','copies','replica','leader','follower','version','write'],
 'lookup':['lookup','look up','find','index','key','record','row','match','query','placement'],
 'cache-hit':['cache','cached','hit','memory','reuse'],
 'cache-miss':['cache','miss','database','fetch'],
 'retry':['retry','retries','again','attempt','backoff']}

def color_center(rgb,width,height,color,y1,y2):
    count=total=0
    for y in range(y1,min(y2,height)):
        for x in range(115,min(905,width)):
            i=(y*width+x)*3
            if all(abs(rgb[i+j]-color[j])<=19 for j in range(3)):
                count+=1;total+=x
    if count<350:raise CreativeReviewFailed('Opening packet is absent or unreadable in encoded video')
    return {'x':round(total/count,2),'pixels':count}

def inspect_opening(frames,width=1080,height=1920):
    if set(frames)!={0,1.5,3}:raise CreativeReviewFailed('Encoded opening frames are incomplete')
    if any(len(frame)!=width*height*3 for frame in frames.values()):raise CreativeReviewFailed('Encoded frame dimensions are invalid')
    positions={}
    for time,rgb in frames.items():
        positions[str(time)]={'before':color_center(rgb,width,height,(243,188,171),610,660),'after':color_center(rgb,width,height,(249,214,107),880,930)}
    start,end=positions['0'],positions['3']
    if not (140<=start['before']['x']<=230 and 140<=start['after']['x']<=230):raise CreativeReviewFailed('Both concrete inputs must be visible at entry')
    if not (410<=end['before']['x']<=490 and 770<=end['after']['x']<=850):raise CreativeReviewFailed('Encoded video does not demonstrate the contrasting result by three seconds')
    if not end['after']['x']-start['after']['x']>550:raise CreativeReviewFailed('Opening has labels but no meaningful movement')
    return positions

def check_mechanism_language(content):
    for scene in content['scenes'][1:-1]:
        text=(scene['narration']+' '+scene['note']).lower()
        if not any(word in text for word in MECHANISM_WORDS[scene['action']]):raise CreativeReviewFailed('Narration does not describe the selected physical action')
    all_text=' '.join(s['narration']+' '+s['note'] for s in content['scenes'])
    if re.search(r'\b(always faster|guaranteed|guarantees|best for|zero latency|never fails|eliminates all)\b',all_text,re.I):raise CreativeReviewFailed('Unqualified performance claim needs correction')
    return True

def check_story_language(content,audio):
    try:validate_story(content)
    except ValueError as error:raise CreativeReviewFailed(str(error)) from None
    if not 3.1<=audio['scenes'][0]['duration']<=8:raise CreativeReviewFailed('Opening must demonstrate its consequence without a long setup')
    first=content['scenes'][0]['narration']
    if re.match(r'\s*(Imagine|Welcome|Introducing|Today we|In this video)\b',first,re.I):raise CreativeReviewFailed('Opening delays the consequence with setup')
    check_mechanism_language(content)
    return True

def review_rendered(lesson,content,audio,project,content_hash):
    check_story_language(content,audio)
    video=project/'reel.mp4';video_hash=hashlib.sha256(video.read_bytes()).hexdigest();path=project/'creative-review.json'
    manifest=json.loads((project/'story-evidence.json').read_text())
    if manifest.get('contract')!=2 or manifest.get('opening_result_seconds')!=2.4 or [s['action'] for s in manifest['scenes']]!=[s['action'] for s in content['scenes']]:raise CreativeReviewFailed('Rendered action manifest does not match the validated storyboard')
    folder=project/'creative-frames';folder.mkdir(exist_ok=True);frames={};samples=[]
    for time in [0,1.5,3]:
        frames[time]=subprocess.check_output(['ffmpeg','-v','error','-ss',str(time),'-i',str(video),'-frames:v','1','-f','rawvideo','-pix_fmt','rgb24','pipe:1'])
    positions=inspect_opening(frames)
    shots=[('opening-0',0),('opening-1.5',1.5),('opening-3',3)]+[(f'beat-{s["index"]}',s['start']+s['duration']*.7) for s in audio['scenes'][1:]]
    for name,time in shots:
        target=folder/(name+'.jpg');subprocess.run(['ffmpeg','-v','error','-y','-ss',str(time),'-i',str(video),'-frames:v','1','-vf','scale=360:640','-q:v','3',str(target)],check=True)
        samples.append({'file':target.name,'time':round(time,3),'sha256':hashlib.sha256(target.read_bytes()).hexdigest()})
    report={'contract':2,'review_type':'local_contract_and_encoded_pixel_checks','content_hash':content_hash,'rendered_sha256':video_hash,'passed':True,'opening_result_seconds':2.4,'opening_positions':positions,'checks':{'visible_inputs_at_entry':True,'encoded_consequence_by_three_seconds':True,'nonrepeated_opening_setup':True,'mechanism_action_arity':True,'narration_action_vocabulary':True,'three_actionable_diagnostics':True,'unqualified_performance_claim_scan':True},'frames':samples,'limits':'Constrained actions and local checks are not a complete semantic or human editorial review. The deployment pilot receives a separate visual review.'}
    write_json(path,report);return report
