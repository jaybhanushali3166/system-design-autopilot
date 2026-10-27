"""Storyboard v2: one physical carrier, explicit paths, consequences before three seconds."""
from __future__ import annotations
import html,json,shutil
from .common import ROOT,config,write_json
from .story_contract import validate_story

def e(v):return html.escape(str(v),quote=True)
CSS='''
@font-face{font-family:Inter;src:url(assets/inter400.woff2);font-weight:400}@font-face{font-family:Inter;src:url(assets/inter700.woff2);font-weight:700}@font-face{font-family:Inter;src:url(assets/inter900.woff2);font-weight:900}
*{box-sizing:border-box}#root{position:absolute;inset:0;overflow:hidden;color:#18332C;font-family:Inter,sans-serif}.ground{position:absolute;inset:0;background:#EAF0E6}.module{position:absolute;left:115px;top:190px;font:700 25px Inter}.title{position:absolute;left:115px;top:250px;width:790px;margin:0;font:900 70px/1.08 Inter;letter-spacing:-2px}.example{position:absolute;left:115px;top:425px;font:700 29px Inter;color:#416D5B}.stage{position:absolute;left:115px;top:490px;width:790px;height:660px}.wires{position:absolute;inset:0;width:790px;height:580px}.wire{stroke:#658676;stroke-width:7;fill:none}.faint{opacity:.22}.endpoint{position:absolute;width:200px;height:210px;border:3px solid #18332C;border-radius:12px;background:#F7F8F0;display:flex;flex-direction:column;justify-content:center;padding:10px;text-align:center;gap:7px;overflow-wrap:anywhere}.endpoint strong{font:700 32px/1.08 Inter}.endpoint small{font:400 29px/1.13 Inter}.payload{position:absolute;left:0;top:0;width:64px;height:42px;border:3px solid #18332C;border-radius:6px;background:#F9D66B;font:700 15px Inter;text-align:center;padding-top:10px}.barrier{position:absolute;width:10px;height:120px;background:#EC6042;transform-origin:50% 100%;border:2px solid #18332C}.lane-label{position:absolute;left:0;font:700 31px Inter}.lane-reason{position:absolute;left:120px;font:400 25px Inter}.arrival{position:absolute;left:420px;width:360px;font:700 31px/1.14 Inter;color:#18332C;opacity:0}.note{position:absolute;left:115px;top:1115px;width:790px;font:700 31px/1.2 Inter}.cap{position:absolute;left:115px;top:1310px;width:790px;font:700 45px/1.2 Inter;opacity:0;visibility:hidden;overflow:visible}.cap span{background:#18332C;color:#F7F8F0;padding:4px 9px;box-decoration-break:clone;-webkit-box-decoration-break:clone}.check{position:absolute;left:0;width:790px;border-bottom:3px solid #8AA898;padding:17px 10px 22px 64px;font:700 35px/1.15 Inter}.check b{position:absolute;left:7px;top:20px;color:#416D5B;font:900 28px Inter}.work{position:absolute;width:42px;height:42px;border:3px solid #18332C;background:#F9D66B;border-radius:5px}.stamp{position:absolute;left:0;top:605px;font:700 31px Inter;color:#416D5B;opacity:0}
'''

def build_story(lesson,content,audio,project):
    story=validate_story(content);assets=project/'assets';assets.mkdir(parents=True,exist_ok=True);folder=project/'compositions';folder.mkdir(exist_ok=True)
    for source,name in [('node_modules/gsap/dist/gsap.min.js','gsap.min.js'),*[(f'node_modules/@fontsource/inter/files/inter-latin-{w}-normal.woff2',f'inter{w}.woff2') for w in [400,700,900]],('automation/assets/bed.mp3','bed.mp3'),('automation/assets/pop.mp3','pop.mp3')]:shutil.copy2(ROOT/source,assets/name)
    hosts=[];evidence=[]
    for scene in audio['scenes']:
        i=scene['index'];sid=f'story-{i}';duration=scene['duration'];action=scene['action'];anim=[]
        body=[f'<div class="ground"></div><div class="module">{e(lesson["series_title"].upper())} · LESSON {lesson["number"]:02}</div><h1 class="title">{e(scene["title"])}</h1><div class="example">{e(story["example"])}</div>']
        visual=[]
        def packet(name,points,start,length=.9,visible=True,color='#F9D66B',initial=False):
            pid=f'{sid}-{name}';x,y=points[0]
            visual.append(f'<div id="{pid}" class="payload" data-layout-allow-overlap style="background:{color};opacity:{1 if initial else 0};left:{x-32}px;top:{y-21}px">{e(story["opening"]["subject"])}</div>')
            anim.append(f'tl.to("#{pid}",{{opacity:1,duration:.08}},{start:.3f});')
            step=length/(len(points)-1)
            for n,(u,v) in enumerate(points[1:]):anim.append(f'tl.to("#{pid}",{{x:{u-x},y:{v-y},duration:{step:.3f},ease:"power2.inOut"}},{start+n*step:.3f});')
            if not visible:anim.append(f'tl.to("#{pid}",{{opacity:0,duration:.15}},{start+length:.3f});')
        if action=='compare':
            opening=story['opening'];result_at=opening['result_at']
            if duration<3.1:raise ValueError('Opening narration must leave time for the demonstrated result')
            for lane,y in enumerate([145,415]):
                label=opening['before_label'] if lane==0 else opening['after_label'];reason=opening['before_reason'] if lane==0 else opening['after_reason'];outcome=opening['before_result'] if lane==0 else opening['after_result']
                visual.append(f'<div class="lane-label" style="top:{y-100}px">{e(label)}</div><svg class="wires" data-layout-ignore><path class="wire" d="M30,{y} H750" style="stroke:{"#8AA898" if lane else "#ADB9AC"}"/></svg><div class="lane-reason" style="top:{y+40}px">{e(reason)}</div><div id="{sid}-result-{lane}" class="arrival" style="top:{y+85}px">{e(outcome)}</div>')
                if lane==0:
                    visual.append(f'<div id="{sid}-gate" class="barrier" style="left:375px;top:{y-115}px"></div>')
                    packet('slow',[(65,y),(335,y)],.2,1.1,color='#F3BCAB',initial=True)
                else:packet('arriving',[(65,y),(690,y)],.2,2.05,color='#F9D66B',initial=True)
                anim.append(f'tl.to("#{sid}-result-{lane}",{{opacity:1,duration:.12}},{result_at:.3f});')
            evidence.append({'scene':i,'action':action,'result_at':2.4,'proof':'one packet stops at the physical boundary; the other reaches its endpoint'})
        elif action=='checklist':
            for j,line in enumerate(story['takeaway']):visual.append(f'<div class="check" style="top:{70+j*135}px"><b>0{j+1}</b>{e(line)}</div>')
            visual.append(f'<div class="stamp" style="opacity:1">Use the same request. Check one stage at a time.</div>')
            evidence.append({'scene':i,'action':action,'checks':story['takeaway']})
        else:
            points=[(100,290),(395,290),(690,290)]
            if action in ['fanout','select','replicate']:points=[(100,290),(350,290),(680,110),(680,455)]
            elif action in ['cache-hit','cache-miss']:points=[(100,290),(350,125),(350,455),(690,290)]
            edges=[(0,1),(1,2)]
            if action in ['fanout','select','replicate']:edges=[(0,1),(1,2),(1,3)]
            elif action in ['cache-hit','cache-miss']:edges=[(0,1),(1,3),(1,2),(2,3)]
            svg='<svg class="wires" data-layout-ignore>'
            for j,(a,b) in enumerate(edges):
                x,y=points[a];u,v=points[b];faint=(action=='block' and j==1) or (action=='cache-hit' and j>=2)
                svg+=f'<path id="{sid}-edge-{j}" class="wire {"faint" if faint else ""}" d="M{x},{y} L{u},{v}"/>'
            visual.append(svg+'</svg>')
            for j,(node,(x,y)) in enumerate(zip(scene['nodes'],points)):
                tone={'cyan':'#F9D66B','green':'#B4D5BD','red':'#F3BCAB','muted':'#F7F8F0'}[node['tone']]
                visual.append(f'<div id="{sid}-endpoint-{j}" class="endpoint" style="left:{x-100}px;top:{y-105}px;background:{tone}"><strong>{e(node["label"])}</strong><small>{e(node["value"])}</small></div>')
            if action=='block':
                visual.append(f'<div class="barrier" style="left:320px;top:175px"></div>');packet('blocked',[points[0],(285,290)],.5,1.4,color='#F3BCAB')
            elif action=='queue':
                for j in range(4):
                    visual.append(f'<div id="{sid}-work-{j}" class="work" style="left:{285+j*53}px;top:160px;opacity:0"></div>')
                    anim.append(f'tl.to("#{sid}-work-{j}",{{opacity:1,duration:.15}},{.4+j*.25:.3f});')
                anim.append(f'tl.to("#{sid}-work-0",{{x:345,y:109,opacity:0,duration:1.1,ease:"power2.inOut"}},2);')
                packet('produced',[points[0],points[1]],.25,.9,visible=False)
            elif action in ['fanout','select','replicate']:
                packet('request',[points[0],points[1]],.4,.8,visible=False)
                for j in ([2] if action=='select' else [2,3]):
                    packet(f'branch-{j}',[points[1],points[j]],1.35,.9,visible=False,color='#B4D5BD')
                    if action=='fanout':packet(f'return-{j}',[points[j],points[1]],2.6,.9,visible=False)
                if action=='fanout':packet('combined',[points[1],points[0]],3.7,.8,visible=False,color='#B4D5BD')
            elif action in ['cache-hit','cache-miss']:
                path=[points[0],points[1]]+([points[2]] if action=='cache-miss' else [])+[points[3]]
                packet('data',path,.4,2.5,visible=False,color='#B4D5BD')
            elif action=='retry':
                packet('attempt-1',[points[0],points[1],points[0]],.4,1.7,visible=False,color='#F3BCAB')
                packet('attempt-2',points,2.6,2.0,visible=False,color='#B4D5BD')
            else:packet('routed',points,.4,2.0,visible=False,color='#B4D5BD')
            visual.append(f'<div id="{sid}-stamp" class="stamp">{e(scene["note"])}</div>');anim.append(f'tl.to("#{sid}-stamp",{{opacity:1,duration:.2}},3);')
            evidence.append({'scene':i,'action':action,'edges':edges,'example':story['example']})
        body.append('<div class="stage">'+''.join(visual)+'</div>')
        if action=='compare':body.append(f'<div class="note">{e(scene["note"])}</div>')
        text=f'<template><style>{CSS}</style><div id="root" data-composition-id="{sid}" data-start="0" data-duration="{duration}" data-width="1080" data-height="1920">'+''.join(body)+'</div><script>(()=>{const tl=gsap.timeline({paused:true});'+''.join(anim)+f'window.__timelines["{sid}"]=tl;}})();</script></template>'
        (folder/f'{sid}.html').write_text(text)
        hosts.append(f'<div id="{sid}" class="clip" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" data-start="{scene["start"]}" data-duration="{duration}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>')
    groups=audio.get('caption_groups');duration=audio['duration']
    if not groups:raise ValueError('Measured short captions required')
    captions=[];anim=[];srt=[]
    def stamp(t):
        ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
    for j,g in enumerate(groups):
        begin=max(.12,g['start']);end=g['start']+g['duration'];cid=f'caption-{j}'
        captions.append(f'<div id="{cid}" class="cap"><span>{e(g["text"])}</span></div>');anim.append(f'tl.set("#{cid}",{{visibility:"visible",opacity:1}},{begin:.4f});tl.set("#{cid}",{{visibility:"hidden",opacity:0}},{end:.4f});');srt.append(f'{j+1}\n{stamp(begin)} --> {stamp(end)}\n{g["text"]}\n')
    (folder/'captions.html').write_text(f'<template><style>{CSS}</style><div id="root" data-composition-id="captions" data-start="0" data-duration="{duration}" data-width="1080" data-height="1920">'+''.join(captions)+'</div><script>(()=>{const tl=gsap.timeline({paused:true});'+''.join(anim)+'window.__timelines["captions"]=tl;})();</script></template>')
    hosts.append(f'<div id="captions" class="clip" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{duration}" data-track-index="2" data-track-kind="captions" style="z-index:20" data-width="1080" data-height="1920"></div>')
    for clip in audio['clips']:hosts.append(f'<audio id="{e(clip["id"])}" class="clip" src="{e(clip["src"])}" data-start="{clip["start"]}" data-duration="{clip["duration"]}" data-track-index="3" data-volume="1"></audio>')
    start=0;j=0
    while start<duration:
        length=min(58.64,duration-start);hosts.append(f'<audio id="bed-{j}" class="clip" src="assets/bed.mp3" data-start="{start}" data-duration="{length}" data-track-index="4" data-volume="0.09" data-fade-in="0.2" data-fade-out="{min(1.2,length/2)}"></audio>');start+=length;j+=1
    hosts.append('<audio id="payoff-pop" class="clip" src="assets/pop.mp3" data-start="2.4" data-duration="0.7" data-track-index="5" data-volume="0.12"></audio>')
    (project/'index.html').write_text(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{e(lesson["title"])}</title><script src="assets/gsap.min.js"></script><style>html,body{{margin:0;background:#EAF0E6;overflow:hidden}}#root{{position:relative;width:100%;height:100%;background:#EAF0E6;overflow:hidden}}.clip{{position:absolute;inset:0}}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="{duration}" data-width="1080" data-height="1920" data-fps="30">'+''.join(hosts)+'</div><script>window.__timelines["main"]=gsap.timeline({paused:true});</script></body></html>')
    (project/'captions.srt').write_text('\n'.join(srt));write_json(project/'story-evidence.json',{'contract':2,'opening_result_seconds':2.4,'scenes':evidence})
    write_json(project/'hyperframes.json',{'paths':{'assets':'assets'},'creativePolicy':'2026-10-27-v2'})
    (project/'SCRIPT.md').write_text('# '+lesson['title']+'\n\n'+'\n\n'.join(s['narration'] for s in content['scenes']))
    (project/'STORYBOARD.md').write_text('# One example: '+story['example']+'\n\n'+'\n\n'.join(f'{s["start"]:.2f}s · {s["action"]} · {s["title"]}\n{s["narration"]}' for s in audio['scenes']))
    (project/'SPEC.md').write_text('1080×1920 at 30fps. Light workshop, dark series cover, English Varo. Opening consequence: 2.4s.\n\nBANNED: repeated problem setup, arbitrary card grids, decorative/disconnected arrows, fabricated benchmarks.\n')
    return project
