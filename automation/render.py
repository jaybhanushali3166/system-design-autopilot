"""Trusted light-workshop diagrams, one growing example per beat and short measured captions."""
from __future__ import annotations
import hashlib,html,json,math,re,shutil,subprocess
from .common import ROOT,config,write_json

def e(value):return html.escape(str(value),quote=True)
CSS='''
@font-face{font-family:Inter;src:url(assets/inter400.woff2);font-weight:400}@font-face{font-family:Inter;src:url(assets/inter700.woff2);font-weight:700}@font-face{font-family:Inter;src:url(assets/inter900.woff2);font-weight:900}
*{box-sizing:border-box}#root{position:absolute;inset:0;overflow:hidden;color:#18332C;font-family:Inter,sans-serif}.clip{position:absolute;inset:0}.ground{position:absolute;inset:0;background:#EAF0E6}.module{position:absolute;left:115px;top:190px;font:700 28px Inter,sans-serif}.title{position:absolute;left:115px;top:250px;width:790px;margin:0;font:900 72px/1.08 Inter,sans-serif;letter-spacing:-2.5px}.visual{position:absolute;left:115px;top:520px;width:790px;height:530px}.node{position:absolute;width:310px;height:175px;border:4px solid #18332C;border-radius:15px;background:#F7F8F0;padding:20px;box-shadow:7px 7px 0 #18332C;display:flex;flex-direction:column;justify-content:center;gap:14px;text-align:center}.label{font:700 32px/1.15 Inter,sans-serif}.value{font:400 29px/1.2 Inter,sans-serif;color:#304A40}.note{position:absolute;left:115px;top:1090px;width:790px;font:700 33px/1.2 Inter,sans-serif}.diagram{position:absolute;inset:0;width:790px;height:530px}.edge{stroke:#416D5B;stroke-width:7;fill:none;opacity:0}.packet{position:absolute;width:30px;height:30px;background:#EC6042;border:3px solid #18332C;border-radius:5px}.cell{position:absolute;width:54px;height:54px;background:#F9D66B;border:3px solid #18332C;border-radius:7px}.cap{position:absolute;left:115px;top:1200px;width:790px;font:700 46px/1.18 Inter,sans-serif;letter-spacing:-.5px;opacity:0;visibility:hidden;overflow:visible}.cap span{background:#18332C;color:#F7F8F0;padding:4px 9px;box-decoration-break:clone;-webkit-box-decoration-break:clone}.ring{stroke:#416D5B;stroke-width:7;fill:none}
'''

def identity():
    files=['automation/render.py','automation/assets/bed.mp3','automation/assets/pop.mp3']
    return hashlib.sha256(b'\0'.join((ROOT/p).read_bytes() for p in files)).hexdigest()


def build(lesson,content,audio,project):
    if config().get('video_theme')!='light-workshop':raise ValueError('Unsupported video theme')
    assets=project/'assets';assets.mkdir(parents=True,exist_ok=True);folder=project/'compositions';folder.mkdir(exist_ok=True)
    for source,name in [('node_modules/gsap/dist/gsap.min.js','gsap.min.js'),('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2','inter400.woff2'),('node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2','inter700.woff2'),('node_modules/@fontsource/inter/files/inter-latin-900-normal.woff2','inter900.woff2'),('automation/assets/bed.mp3','bed.mp3'),('automation/assets/pop.mp3','pop.mp3')]:shutil.copy(ROOT/source,assets/name)
    hosts=[]
    for scene in audio['scenes']:
        i=scene['index'];sid=f'scene-{i}';start=scene['start'];duration=scene['duration'];nodes=scene['nodes'];kind=scene['kind'];width=310
        positions=[(0,20),(465,20),(0,330),(465,330)][:len(nodes)];edges=[]
        if kind in ['flow','workflow']:
            if len(nodes)==2:positions=[(0,180),(465,180)];edges=[(310,267,465,267)]
            else:
                positions=[(0,20),(465,20),(465,330),(0,330)][:len(nodes)];edges=[(310,107,465,107),(620,195,620,330)]
                if len(nodes)==4:edges.append((465,417,310,417))
        elif kind=='index':edges=[(310,107,465,107),(155,195,155,330)]+([(620,195,620,330)] if len(nodes)==4 else [])
        if kind=='ring':
            width=230;positions=[]
            for j in range(len(nodes)):
                angle=2*math.pi*j/len(nodes)-math.pi/2;positions.append((round(395+190*math.cos(angle)-115),round(260+175*math.sin(angle)-78)))
        body=[f'<div id="{sid}-ground" class="ground"></div>',f'<div class="module">{e(lesson["series_title"].upper())} · LESSON {lesson["number"]:02}</div>',f'<h1 class="title">{e(scene["title"])}</h1>'];visual=[];anim=[]
        svg='<svg class="diagram" viewBox="0 0 790 530" aria-hidden="true" data-layout-ignore>'
        if kind=='ring':svg+='<circle class="ring" cx="395" cy="260" r="190"/>'
        for j,(x,y,u,v) in enumerate(edges):svg+=f'<path id="{sid}-edge-{j}" class="edge" d="M{x},{y} L{u},{v}"/>'
        visual.append(svg+'</svg>')
        timings=[]
        for j,node in enumerate(nodes):
            x,y=positions[j];tone={'cyan':'#F9D66B','green':'#B4D5BD','red':'#F3BCAB','muted':'#F7F8F0'}[node['tone']]
            visual.append(f'<div id="{sid}-node-{j}" class="node" style="left:{x}px;top:{y}px;width:{width}px;background:{tone}"><div class="label">{e(node["label"])}</div><div class="value">{e(node["value"])}</div></div>')
            t=(j*.48 if i==0 else max(.15,j*duration*.19));timings.append(t)
            if j or i:
                anim.append(f'tl.fromTo("#{sid}-node-{j}",{{opacity:0,x:-25}},{{opacity:1,x:0,duration:.45,ease:"power3.out"}},{t:.4f});')
        for j,(x,y,u,v) in enumerate(edges):
            begin=timings[min(j+1,len(timings)-1)]+.3
            anim.append(f'tl.to("#{sid}-edge-{j}",{{opacity:1,duration:.2}},{begin:.4f});')
            visual.append(f'<div id="{sid}-packet-{j}" class="packet" style="left:{x-15}px;top:{y-15}px;opacity:0"></div>')
            for repeat,t in enumerate([begin+.25,max(begin+1.7,duration*.6)]):
                if t+1.25<duration-.2:anim.append(f'tl.fromTo("#{sid}-packet-{j}",{{opacity:0,x:0,y:0}},{{opacity:1,x:{u-x},y:{v-y},duration:1,immediateRender:{str(repeat==0).lower()},ease:"power2.inOut"}},{t:.4f});tl.to("#{sid}-packet-{j}",{{opacity:0,duration:.15}},{t+1:.4f});')
        if kind=='queue':
            for j in range(6):
                visual.append(f'<div id="{sid}-cell-{j}" class="cell" style="left:{170+j*65}px;top:235px"></div>')
                anim.append(f'tl.fromTo("#{sid}-cell-{j}",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:.35}},{.8+j*.25:.4f});tl.to("#{sid}-cell-{j}",{{x:50,opacity:0,duration:.5,ease:"power2.in"}},{max(3,duration*.5)+j*.2:.4f});')
        if kind=='ring':
            visual.append(f'<div id="{sid}-key" class="packet" style="left:380px;top:245px"></div>')
            for j in range(6):
                angle=j*math.pi/3;anim.append(f'tl.to("#{sid}-key",{{x:{180*math.cos(angle):.2f},y:{180*math.sin(angle):.2f},duration:.8,ease:"power2.inOut"}},{.8+j*max(1,(duration-2)/6):.4f});')
        body.append('<div class="visual">'+''.join(visual)+'</div>');body.append(f'<div id="{sid}-note" class="note">{e(scene["note"])}</div>')
        anim.append(f'tl.fromTo("#{sid}-note",{{opacity:0}},{{opacity:1,duration:.3}},{max(1,duration*.56):.4f});')
        text=f'<template><style>{CSS}</style><div id="root" data-composition-id="{sid}" data-start="0" data-duration="{duration}" data-width="1080" data-height="1920">'+''.join(body)+'</div><script>(()=>{const tl=gsap.timeline({paused:true});'+''.join(anim)+f'window.__timelines["{sid}"]=tl;}})();</script></template>'
        (folder/f'{sid}.html').write_text(text)
        hosts.append(f'<div id="{sid}" class="clip" data-composition-id="{sid}" data-composition-src="compositions/{sid}.html" data-start="{start}" data-duration="{duration}" data-track-index="1" data-track-kind="graphics" data-width="1080" data-height="1920"></div>')
    groups=audio.get('caption_groups')
    if not groups:raise ValueError('Measured short caption groups required')
    captions=[];anim=[];srt=[]
    def stamp(t):
        ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
    for j,g in enumerate(groups):
        begin=max(.12,g['start']);end=g['start']+g['duration'];cid=f'caption-{j}'
        captions.append(f'<div id="{cid}" class="cap"><span>{e(g["text"])}</span></div>')
        anim.append(f'tl.set("#{cid}",{{visibility:"visible",opacity:1}},{begin:.4f});tl.set("#{cid}",{{visibility:"hidden",opacity:0}},{end:.4f});')
        srt.append(f'{j+1}\n{stamp(begin)} --> {stamp(end)}\n{g["text"]}\n')
    duration=audio['duration']
    (folder/'captions.html').write_text(f'<template><style>{CSS}</style><div id="root" data-composition-id="captions" data-start="0" data-duration="{duration}" data-width="1080" data-height="1920">'+''.join(captions)+'</div><script>(()=>{const tl=gsap.timeline({paused:true});'+''.join(anim)+'window.__timelines["captions"]=tl;})();</script></template>')
    hosts.append(f'<div id="captions" class="clip" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{duration}" data-track-index="2" data-track-kind="captions" style="z-index:20" data-width="1080" data-height="1920"></div>')
    for clip in audio['clips']:hosts.append(f'<audio id="{e(clip["id"])}" class="clip" src="{e(clip["src"])}" data-start="{clip["start"]}" data-duration="{clip["duration"]}" data-track-index="3" data-volume="1"></audio>')
    start=0;j=0
    while start<duration:
        length=min(58.64,duration-start);hosts.append(f'<audio id="bed-{j}" class="clip" src="assets/bed.mp3" data-start="{start}" data-duration="{length}" data-track-index="4" data-volume="0.09" data-fade-in="0.2" data-fade-out="{min(1.2,length/2)}"></audio>');start+=length;j+=1
    hosts.append('<audio id="payoff-pop" class="clip" src="assets/pop.mp3" data-start="1.4" data-duration="0.7" data-track-index="5" data-volume="0.12"></audio>')
    page=f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{e(lesson["title"])}</title><script src="assets/gsap.min.js"></script><style>html,body{{margin:0;background:#EAF0E6;overflow:hidden}}#root{{position:relative;width:100%;height:100%;background:#EAF0E6;overflow:hidden}}.clip{{position:absolute;inset:0}}</style></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="{duration}" data-width="1080" data-height="1920" data-fps="30">'+''.join(hosts)+'</div><script>window.__timelines["main"]=gsap.timeline({paused:true});</script></body></html>'
    (project/'index.html').write_text(page);(project/'captions.srt').write_text('\n'.join(srt))
    version=config()['hyperframes_version'];write_json(project/'hyperframes.json',{'paths':{'assets':'assets'},'creativePolicy':'2026-10-25-v1'})
    write_json(project/'package.json',{'name':lesson['id'],'private':True,'scripts':{'check':f'npx --yes hyperframes@{version} check','render':f'npx --yes hyperframes@{version} render'}})
    (project/'SCRIPT.md').write_text('# '+lesson['title']+'\n\n'+'\n\n'.join(s['narration'] for s in content['scenes']))
    (project/'BRIEF.md').write_text(f'Light workshop reel; dark series cover; one continuous English Varo narration.\n\nScope: {lesson["outcome"]}\n\nBoundary: {lesson["boundary"]}\n')
    return project

def command(project,*args):subprocess.run(['npx','--yes',f'hyperframes@{config()["hyperframes_version"]}',*args],cwd=project,check=True,timeout=2400)
