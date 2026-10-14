"""Trusted seek-safe HTML templates. Model content is escaped data, never code."""
from __future__ import annotations
import html,json,math,re,shutil,subprocess
from .common import ROOT,config,write_json

def e(text):return html.escape(str(text),quote=True)
CSS='''
@font-face{font-family:Space;src:url(assets/space.woff2);font-weight:700}@font-face{font-family:Inter;src:url(assets/inter.woff2);font-weight:400}
*{box-sizing:border-box}body{margin:0;color:#f1f5ff;background:#070913;font-family:Inter,sans-serif}#root{position:relative;width:100%;height:100%;overflow:hidden}.clip{position:absolute;inset:0}.ground{background-color:#070913;background-image:linear-gradient(#38bdf809 1px,transparent 1px),linear-gradient(90deg,#38bdf809 1px,transparent 1px);background-size:72px 72px}.brand{position:absolute;top:140px;left:86px;font-size:29px;color:#a8b6cf;letter-spacing:2px}.counter{position:absolute;top:144px;right:86px;font-size:24px;color:#a8b6cf}.eyebrow{position:absolute;top:270px;left:86px;color:#58d3f7;letter-spacing:3px;font-size:28px}.title{position:absolute;top:350px;left:86px;width:900px;font:700 76px/1.1 Space,sans-serif;letter-spacing:-2.5px;margin:0}.visual{position:absolute;top:660px;left:90px;width:900px;height:610px}.node{position:absolute;width:380px;height:200px;padding:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;border:2px solid #536580;border-radius:27px;background:#101a2b;text-align:center}.label{font:700 28px/1.2 Space,sans-serif}.value{font:400 25px/1.2 Inter,sans-serif;color:#bac8de}.cyan{color:#58d3f7}.green{color:#7ef0bd}.red{color:#ff7e91}.muted{color:#bac8de}.note{position:absolute;left:100px;top:1300px;width:880px;text-align:center;font:700 33px/1.35 Space,sans-serif;color:#7ef0bd}.caption{position:absolute;top:1460px;left:90px;width:900px;background:#0d1627;color:#fff;padding:20px 28px;border-radius:18px;text-align:center;font:400 38px/1.28 Inter,sans-serif}.footer{position:absolute;left:86px;bottom:185px;color:#a8b6cf;font-size:24px}.progress{position:absolute;bottom:240px;left:86px;width:908px;height:5px;background:#202c43}.fill{height:100%;background:#58d3f7;transform-origin:left}.diagram{position:absolute;inset:0;width:900px;height:610px}.edge{fill:none;stroke:#526781;stroke-width:3;stroke-dasharray:9 9;opacity:0}.packet{position:absolute;width:24px;height:24px;border-radius:50%;background:#58d3f7;box-shadow:0 0 20px #58d3f777}.ring{stroke:#526781;stroke-width:5;fill:none}.token{fill:#58d3f7}.queue-cell{position:absolute;top:30px;width:65px;height:65px;background:#17354a;border:2px solid #58d3f7;border-radius:12px}.reveal{opacity:0}
'''
def node(scene_id,index,x,y,node,width=380):
 return f'<div id="{scene_id}-node-{index}" class="node reveal" style="left:{x}px;top:{y}px;width:{width}px"><div class="label {e(node["tone"])}">{e(node["label"])}</div><div class="value">{e(node["value"])}</div></div>'

def build(lesson,content,audio,project):
 assets=project/'assets';assets.mkdir(parents=True,exist_ok=True)
 for source,name in [('node_modules/gsap/dist/gsap.min.js','gsap.min.js'),('node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff2','space.woff2'),('node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2','inter.woff2')]:
  shutil.copy(ROOT/source,assets/name)
 animations=[];sections=[]
 def reveal(selector,t): animations.append(f'tl.fromTo({json.dumps(selector)},{{opacity:0,y:18}},{{opacity:1,y:0,duration:.5,ease:"power3.out"}},{t:.4f});')
 for scene in audio['scenes']:
  i=scene['index'];sid=f'scene-{i}';a=scene['start'];d=scene['duration'];n=scene['nodes'];kind=scene['kind']
  positions=[];width=380;edges=[]
  if kind=='ring':
   width=270
   for j in range(len(n)):
    angle=2*math.pi*j/len(n)-math.pi/2
    positions.append((round(450+230*math.cos(angle)-135),round(290+200*math.sin(angle)-82)))
  elif kind in ['flow','workflow']:
   if len(n)==2:positions=[(0,160),(520,160)];edges=[(380,242,520,242)]
   else:
    positions=[(0,0),(520,0),(520,340),(0,340)][:len(n)]
    edges=[(380,82,520,82),(710,165,710,340)]
    if len(n)==4:edges.append((520,422,380,422))
  else:positions=[(0,30),(520,30),(0,320),(520,320)][:len(n)]
  if kind=='index':edges=[(380,110,520,110),(190,195,190,320)]+([(710,195,710,320)] if len(n)==4 else [])
  svg='<svg class="diagram" viewBox="0 0 900 610" aria-hidden="true">'
  if kind=='ring':svg+='<circle id="'+sid+'-ring" class="ring" cx="450" cy="290" r="220"/>'
  for j,(x,y,u,v) in enumerate(edges):svg+=f'<path id="{sid}-edge-{j}" class="edge" d="M{x},{y} L{u},{v}"/>'
  svg+='</svg>'
  visual=svg+''.join(node(sid,j,*positions[j],x,width) for j,x in enumerate(n))
  step=max(1.0,d*.11)
  for j in range(len(n)):reveal(f'#{sid}-node-{j}',a+.8+j*step)
  for j in range(len(edges)):
   animations.append(f'tl.fromTo("#{sid}-edge-{j}",{{opacity:0}},{{opacity:1,duration:.3}},{a+.8+(j+1)*step+.5:.4f});')
  # Packet motion repeats on a finite local clock throughout the mechanism demonstration.
  for j,(x,y,u,v) in enumerate(edges):
   visual+=f'<div id="{sid}-packet-{j}" class="packet reveal" style="left:{x-12}px;top:{y-12}px"></div>'
   count=max(1,int((d-3)/3.2))
   for cycle in range(count):
    t=a+.8+(j+1)*step+.8+cycle*3.2
    if t+1.5>a+d-.5:continue
    animations.append(f'tl.fromTo("#{sid}-packet-{j}",{{opacity:0,x:0,y:0}},{{opacity:1,x:{u-x},y:{v-y},duration:1.1,ease:"none"}},{t:.4f});tl.to("#{sid}-packet-{j}",{{opacity:0,duration:.16}},{t+1.1:.4f});')
  if kind=='queue':
   for j in range(6):
    visual+=f'<div id="{sid}-cell-{j}" class="queue-cell reveal" style="left:{210+j*78}px;top:230px"></div>'
    reveal(f'#{sid}-cell-{j}',a+1.4+j*.35)
    animations.append(f'tl.to("#{sid}-cell-{j}",{{x:65,y:70,opacity:0,duration:.7,ease:"power2.in"}},{a+min(d-2,5+j*.65):.4f});')
  if kind=='ring':
   visual+=f'<div id="{sid}-key" class="packet reveal" style="left:438px;top:278px"></div>'
   for j in range(9):
    angle=math.pi*j/4
    animations.append(f'tl.to("#{sid}-key",{{opacity:1,x:{220*math.cos(angle):.2f},y:{220*math.sin(angle):.2f},duration:.7,ease:"none"}},{a+1.5+j*.7:.4f});')
  sections.append(f'<section id="{sid}" class="clip" data-start="{a}" data-duration="{d}" data-track-index="1"><div id="{sid}-eyebrow" class="eyebrow reveal">{i+1:02} / 06 · {e(["THE QUESTION","THE PROBLEM","THE MECHANISM","THE PROOF","THE BOUNDARY","THE TAKEAWAY"][i])}</div><h1 id="{sid}-title" class="title reveal">{e(scene["title"])}</h1><div class="visual">{visual}</div><div id="{sid}-note" class="note reveal">{e(scene["note"])}</div></section>')
  reveal(f'#{sid}-eyebrow',a);reveal(f'#{sid}-title',a);reveal(f'#{sid}-note',a+max(2,d*.55))
 srt=[]
 def stamp(t):
  ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
 for j,clip in enumerate(audio['clips']):
  sections.append(f'<audio id="{clip["id"]}" src="{e(clip["src"])}" data-start="{clip["start"]}" data-duration="{clip["duration"]}" data-track-index="3"></audio>')
  sections.append(f'<div id="caption-{j}" class="clip" data-start="{clip["start"]}" data-duration="{clip["duration"]}" data-track-index="2"><div class="caption">{e(clip["text"])}</div></div>')
  srt.append(f'{j+1}\n{stamp(clip["start"])} --> {stamp(clip["start"]+clip["duration"])}\n{clip["text"]}\n')
 duration=audio['duration'];animations.append(f'tl.fromTo("#progress-fill",{{scaleX:0}},{{scaleX:1,duration:{duration},ease:"none"}},0);')
 page=f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{e(lesson["title"])}</title><script src="assets/gsap.min.js"></script><style>{CSS}</style></head><body><div id="root" data-composition-id="main" data-width="1080" data-height="1920" data-duration="{duration}"><div id="ground" class="clip ground" data-start="0" data-duration="{duration}" data-track-index="0"></div><div class="brand">@beyond.localhost</div><div class="counter">SYSTEM DESIGN / {lesson["number"]:02}</div>'+''.join(sections)+f'<div class="progress"><div id="progress-fill" class="fill"></div></div><div class="footer">SERIES {lesson["series"]:02} · {e(lesson["series_title"].upper())}</div></div><script>const tl=gsap.timeline({{paused:true}});'+''.join(animations)+'window.__timelines["main"]=tl;</script></body></html>'
 (project/'index.html').write_text(page);(project/'captions.srt').write_text('\n'.join(srt))
 version=config()['hyperframes_version']
 write_json(project/'hyperframes.json',{'authoringSkill':'faceless-explainer','paths':{'assets':'assets'}})
 write_json(project/'package.json',{'name':lesson['id'],'private':True,'scripts':{'check':f'npx --yes hyperframes@{version} check','render':f'npx --yes hyperframes@{version} render'}})
 (project/'SCRIPT.md').write_text('# '+lesson['title']+'\n\n'+'\n\n'.join(x['narration'] for x in content['scenes']))
 (project/'BRIEF.md').write_text(f'---\nworkflow: faceless-explainer\nflow: automation\nstoryboard: no\nmessage: "{lesson["outcome"]}"\n---\nApproved automation pilot, 1080x1920 at 30 fps. Bound: {lesson["boundary"]}\n')
 return project

def command(project,*args):
 version=config()['hyperframes_version'];subprocess.run(['npx','--yes',f'hyperframes@{version}',*args],cwd=project,check=True,timeout=2400)
