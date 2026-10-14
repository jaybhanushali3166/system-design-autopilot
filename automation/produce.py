"""One hosted/local production job. This module never calls Instagram publish."""
from __future__ import annotations
import argparse,json,os,re,shutil,subprocess,time,hashlib
from pathlib import Path
import requests
from .common import ROOT,WORK,config,load_env,write_json
from .catalog import build_catalog
from .content import generate,digest
from .voice import synthesize
from .render import build
from .validate import validate_video

def hf(project,*args,report=None):
 cmd=['npx','--yes',f'hyperframes@{config()["hyperframes_version"]}',*args]
 env={**os.environ,'DO_NOT_TRACK':'1'}
 if report:
  with open(report,'w') as stream: subprocess.run(cmd,cwd=project,env=env,stdout=stream,check=True,timeout=2400)
 else:subprocess.run(cmd,cwd=project,env=env,check=True,timeout=2400)

def upload(project,lesson,hash_value):
 import cloudinary,cloudinary.uploader
 url=os.environ.get('CLOUDINARY_URL','')
 if not url:raise ValueError('CLOUDINARY_URL missing')
 cloudinary.config(cloudinary_url=url,secure=True)
 # Stable asset IDs make production retries reuse the same identity; content changes use a new hash.
 base=f'course/{config()["course_id"]}/{lesson["id"]}/{hash_value[:16]}'
 video=cloudinary.uploader.upload_large(str(project/'reel.mp4'),resource_type='video',public_id=base,overwrite=True,timeout=120)
 cover=cloudinary.uploader.upload(str(project/'cover.png'),resource_type='image',public_id=base+'-cover',overwrite=True,timeout=120)
 return video['secure_url'],cover['secure_url']

def callback(url,data):
 token=os.environ.get('AUTOPILOT_CALLBACK_TOKEN','')
 if not token:raise ValueError('AUTOPILOT_CALLBACK_TOKEN missing')
 if not url.startswith('https://'):raise ValueError('Worker callback URL must use HTTPS')
 # The trusted origin is a secret, never accepted solely from a dispatched workflow input.
 allowed=os.environ.get('AUTOPILOT_WORKER_URL','').rstrip('/')
 if url.rstrip('/')!=allowed:raise ValueError('Worker URL does not match configured origin')
 for attempt in range(3):
  try:
   res=requests.post(allowed+'/api/result',headers={'Authorization':f'Bearer {token}'},json=data,timeout=(10,20))
   if res.status_code==409:raise ValueError('Stale production claim; not uploaded as a publishable result')
   if res.status_code<500:res.raise_for_status();return
  except requests.RequestException:
   if attempt==2:raise RuntimeError('Worker callback failed; inspect the cloud run') from None
  time.sleep(2**attempt)

def run(args):
 load_env();lessons=build_catalog();lesson=next((x for x in lessons if x['id']==args.lesson),None)
 if not lesson:raise ValueError('Unknown lesson ID')
 project=WORK/'runs'/lesson['id'];project.mkdir(parents=True,exist_ok=True)
 if args.resume and (project/'content.json').exists():content=json.loads((project/'content.json').read_text())
 else:
  content=generate(lesson,args.provider);write_json(project/'content.json',content)
 if args.prepare_only:
  print(f'Content prepared for {lesson["id"]}; no voice, upload or publication');return
 narration_hash=digest([x['narration'] for x in content['scenes']])
 old_audio=json.loads((project/'audio.json').read_text()) if (project/'audio.json').exists() else {}
 if args.resume and old_audio.get('narration_hash')==narration_hash:audio=old_audio
 else:
  audio=synthesize(content,project,config()['voice']);audio['narration_hash']=narration_hash;write_json(project/'audio.json',audio)
 build(lesson,content,audio,project)
 hash_value=digest({'content':content,'voice':audio['voice'],'template':hashlib.sha256((ROOT/'automation/render.py').read_bytes()).hexdigest(),'renderer':config()['hyperframes_version']})
 hf(project,'check','--json',report=project/'check.json')
 check=json.loads((project/'check.json').read_text())
 if check.get('ok') is not True or check.get('browserSkipped'):raise ValueError('Browser validation failed or was skipped')
 previous=json.loads((project/'result.json').read_text()) if (project/'result.json').exists() else {}
 if not args.resume or not (project/'reel.mp4').exists() or previous.get('content_hash')!=hash_value:
  hf(project,'render','--quality','delivery','--fps','30','--strict','--output','reel.mp4')
 validate=validate_video(project/'reel.mp4',audio['duration'],True)
 subprocess.run(['ffmpeg','-y','-v','error','-ss','3','-i',str(project/'reel.mp4'),'-frames:v','1',str(project/'cover.png')],check=True)
 # Evidence snapshots are extracted from the final encoded video, at each scene's proof pose.
 for scene in audio['scenes']:
  midpoint=scene['start']+scene['duration']*.65
  subprocess.run(['ffmpeg','-y','-v','error','-ss',str(midpoint),'-i',str(project/'reel.mp4'),'-frames:v','1',str(project/f'review-{scene["index"]}.png')],check=True)
 result={'lesson_id':lesson['id'],'job_token':args.job_token,'content_hash':hash_value,
         'validation':validate,'caption':content['caption'],'dry_run':args.dry_run,
         'run_id':os.environ.get('GITHUB_RUN_ID','local'),'video_url':None,'cover_url':None}
 write_json(project/'result.json',result)
 if args.upload:
  result['video_url'],result['cover_url']=upload(project,lesson,hash_value);write_json(project/'result.json',result)
 if args.worker_url:
  if not args.upload:raise ValueError('Callback requires uploaded media')
  callback(args.worker_url,result)
 print(json.dumps({'lesson':lesson['id'],'seconds':validate['duration'],'validated':True,'uploaded':args.upload,'published':False,'project':str(project)},indent=2))

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--lesson',required=True);parser.add_argument('--provider',choices=['gemini','approved'],default='gemini')
 parser.add_argument('--upload',action='store_true');parser.add_argument('--dry-run',action='store_true');parser.add_argument('--prepare-only',action='store_true');parser.add_argument('--resume',action='store_true')
 parser.add_argument('--job-token',default='');parser.add_argument('--worker-url',default='');args=parser.parse_args()
 try:run(args)
 except Exception as exc:
  if args.worker_url and args.job_token:
   try:callback(args.worker_url,{'lesson_id':args.lesson,'job_token':args.job_token,'error':True})
   except Exception:pass
  # Provider libraries can include credential-bearing URLs in exceptions. Keep console errors generic.
  print(f'Production failed at {type(exc).__name__}; no publication attempted. Check dependencies/configuration or local reports.')
  raise SystemExit(1)
