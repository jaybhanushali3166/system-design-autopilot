"""Secure setup, deployment, status and activation. No secrets printed or committed."""
from __future__ import annotations
import argparse,datetime as dt,getpass,json,os,secrets,subprocess,urllib.parse
from pathlib import Path
import requests
from .common import ROOT,WORK,config,load_env,github_token,write_json
from .catalog import build_catalog,schedule

def need(name):
 value=os.environ.get(name,'')
 if not value:raise ValueError(f'{name} is not configured')
 return value

def api(method,url,token=None,**kw):
 headers=kw.pop('headers',{})
 if token:headers['Authorization']=f'Bearer {token}'
 response=requests.request(method,url,headers=headers,timeout=(10,30),**kw)
 if not response.ok:raise RuntimeError(f'Remote request returned HTTP {response.status_code}')
 if not response.content:return {}
 data=response.json()
 if isinstance(data,dict) and data.get('success') is False:raise RuntimeError('Cloud provider rejected the request')
 return data

def github(path,method='GET',**kw):
 token=github_token()
 if not token:raise ValueError('GitHub authentication missing')
 return api(method,'https://api.github.com/'+path,token,headers={'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'reels-autopilot-setup'},**kw)

def cf(path,method='GET',**kw):return api(method,'https://api.cloudflare.com/client/v4/'+path,need('CLOUDFLARE_API_TOKEN'),**kw)['result']

def secrets_file(values):
 # Update only the dedicated ignored file. Existing .env stays intact.
 p=ROOT/'.env.autopilot';current={}
 if p.exists():
  for line in p.read_text().splitlines():
   if '=' in line and not line.startswith('#'):
    k,v=line.split('=',1);current[k]=v.strip().strip('\"\'')
 current.update(values)
 if any('\n' in str(v) or '\r' in str(v) for v in current.values()):raise ValueError('Secret must be single-line')
 descriptor=os.open(p,os.O_WRONLY|os.O_CREAT|os.O_TRUNC,0o600)
 os.fchmod(descriptor,0o600)
 with os.fdopen(descriptor,'w') as stream:
  stream.write('# Local secrets — ignored by Git; do not share this file.\n')
  for k,v in current.items():stream.write(f'{k}={v}\n')
 for k,v in values.items():os.environ[k]=v

def credentials():
 prompts={'CLOUDFLARE_API_TOKEN':'Cloudflare token (Workers Scripts Edit + D1 Edit for your account)',
          'CLOUDFLARE_ACCOUNT_ID':'Cloudflare account ID','GEMINI_API_KEY':'Google AI Studio API key (free-tier project)'}
 values={}
 for name,label in prompts.items():
  if not os.environ.get(name):values[name]=getpass.getpass(label+': ').strip()
 if not github_token():values['GITHUB_TOKEN']=getpass.getpass('GitHub token (selected repo: Actions write and Secrets write): ').strip()
 values['AUTOPILOT_ADMIN_TOKEN']=os.environ.get('AUTOPILOT_ADMIN_TOKEN') or secrets.token_urlsafe(32)
 values['AUTOPILOT_CALLBACK_TOKEN']=os.environ.get('AUTOPILOT_CALLBACK_TOKEN') or secrets.token_urlsafe(32)
 secrets_file({k:v for k,v in values.items() if v})
 print('Credentials saved to the ignored .env.autopilot with owner-only permissions.')

def doctor():
 results={}
 def check(name,action):
  try:results[name]={'ok':True,**action()}
  except Exception as exc:results[name]={'ok':False,'reason':type(exc).__name__}
 check('github',lambda: {k:v for k,v in github('repos/'+config()['repository']).items() if k in ['full_name','default_branch','private']})
 def instagram():
  version=os.environ.get('GRAPH_API_VERSION','v24.0')
  data=api('GET',f'https://graph.facebook.com/{version}/{need("IG_USER_ID")}',need('META_ACCESS_TOKEN'),params={'fields':'id,username'})
  if data.get('username')!=config()['channel'].lstrip('@'):raise ValueError('Instagram account differs from configured channel')
  return {'username':data['username'],'version':version}
 check('instagram',instagram)
 def cloudinary_ping():
  import cloudinary,cloudinary.api
  cloudinary.config(cloudinary_url=need('CLOUDINARY_URL'),secure=True)
  data=cloudinary.api.ping();return {'status':data.get('status')}
 check('cloudinary',cloudinary_ping)
 if os.environ.get('CLOUDFLARE_API_TOKEN') and os.environ.get('CLOUDFLARE_ACCOUNT_ID'):
  check('cloudflare',lambda:{'available':bool(cf('accounts/'+need('CLOUDFLARE_ACCOUNT_ID')))})
 else:results['cloudflare']={'ok':False,'reason':'credentials_missing'}
 results['generation']={'ok':bool(os.environ.get('GEMINI_API_KEY') or os.environ.get('GOOGLE_API_KEY')),'reason':'key presence only; inference not verified'}
 write_json(WORK/'doctor.json',results);print(json.dumps(results,indent=2))
 return results

def github_secret(repo,name,value):
 from nacl.public import PublicKey,SealedBox
 import base64
 public=github(f'repos/{repo}/actions/secrets/public-key')
 encrypted=base64.b64encode(SealedBox(PublicKey(base64.b64decode(public['key']))).encrypt(value.encode())).decode()
 github(f'repos/{repo}/actions/secrets/{name}','PUT',json={'encrypted_value':encrypted,'key_id':public['key_id']})

def deploy():
 for name in ['CLOUDFLARE_API_TOKEN','CLOUDFLARE_ACCOUNT_ID','CLOUDINARY_URL','META_ACCESS_TOKEN','IG_USER_ID','GEMINI_API_KEY','AUTOPILOT_ADMIN_TOKEN','AUTOPILOT_CALLBACK_TOKEN']:need(name)
 token=github_token()
 if not token:raise ValueError('GitHub authentication missing')
 repo=config()['repository'];repo_info=github('repos/'+repo)
 # Ensure the production workflow already exists remotely before creating scheduler resources.
 github(f'repos/{repo}/contents/.github/workflows/reel-production.yml')
 account=need('CLOUDFLARE_ACCOUNT_ID');databases=cf(f'accounts/{account}/d1/database')
 name='system-design-reels-autopilot';database=next((x for x in databases if x['name']==name),None)
 if not database:database=cf(f'accounts/{account}/d1/database','POST',json={'name':name})
 dbid=database['uuid']
 migration=(ROOT/'automation/cloudflare/migrations/0001_initial.sql').read_text()
 cf(f'accounts/{account}/d1/database/{dbid}/query','POST',json={'sql':migration})
 source=ROOT/'automation/cloudflare/wrangler.jsonc'
 settings=json.loads(source.read_text());settings['d1_databases'][0]['database_id']=dbid
 settings['vars']['GITHUB_REF']=repo_info['default_branch']
 settings['vars']['GRAPH_API_VERSION']=os.environ.get('GRAPH_API_VERSION','v24.0')
 cloudname=urllib.parse.urlparse(need('CLOUDINARY_URL')).hostname
 settings['vars']['CLOUDINARY_CLOUD_NAME']=cloudname
 generated=source.parent/'wrangler.deployed.json';write_json(generated,settings)
 env={**os.environ,'WRANGLER_SEND_METRICS':'false'}
 # Cloudflare token never goes into command arguments or config JSON.
 subprocess.run(['npx','--yes','wrangler@4.45.0','deploy','--config',str(generated)],cwd=ROOT,env=env,check=True,timeout=180)
 subdomain=cf(f'accounts/{account}/workers/subdomain')['subdomain']
 url=f'https://{name}.{subdomain}.workers.dev'
 worker_secrets={'GITHUB_TOKEN':token,'CALLBACK_TOKEN':need('AUTOPILOT_CALLBACK_TOKEN'),'ADMIN_TOKEN':need('AUTOPILOT_ADMIN_TOKEN'),
                 'META_ACCESS_TOKEN':need('META_ACCESS_TOKEN'),'IG_USER_ID':need('IG_USER_ID'),'SELF_URL':url}
 for key,value in worker_secrets.items():
  cf(f'accounts/{account}/workers/scripts/{name}/secrets','PUT',json={'name':key,'text':value,'type':'secret_text'})
 secrets_file({'AUTOPILOT_WORKER_URL':url})
 for key,value in {'GEMINI_API_KEY':need('GEMINI_API_KEY'),'AUTOPILOT_CLOUDINARY_URL':need('CLOUDINARY_URL'),
                   'AUTOPILOT_CALLBACK_TOKEN':need('AUTOPILOT_CALLBACK_TOKEN'),'AUTOPILOT_WORKER_URL':url}.items():github_secret(repo,key,value)
 print(f'Deployed paused scheduler: {url}. Production secrets provisioned; no dated queue or live publishing enabled.')

def admin(path,method='GET',payload=None):
 return api(method,need('AUTOPILOT_WORKER_URL').rstrip('/')+'/admin/'+path,need('AUTOPILOT_ADMIN_TOKEN'),**({'json':payload} if payload is not None else {}))

def provision_github():
 repo=config()['repository'];github_secret(repo,'AUTOPILOT_CLOUDINARY_URL',need('CLOUDINARY_URL'))
 print('Encrypted Cloudinary credential provisioned for the cloud dry-run workflow. No publishing credentials sent to the runner.')

def runs():
 data=github('repos/'+config()['repository']+'/actions/runs',params={'per_page':10})
 print(json.dumps([{'id':r['id'],'name':r['name'],'branch':r['head_branch'],'status':r['status'],'conclusion':r['conclusion'],'url':r['html_url']} for r in data.get('workflow_runs',[])],indent=2))

def pilot(lesson):
 repo=config()['repository'];info=github('repos/'+repo)
 github(f'repos/{repo}/actions/workflows/reel-production.yml/dispatches','POST',json={'ref':info['default_branch'],'inputs':{'lesson_id':lesson,'worker_url':need('AUTOPILOT_WORKER_URL'),'dry_run':True,'provider':'approved'}})
 print(f'Cloud dry run requested for {lesson}. No Instagram publication; check GitHub Actions and cloud status.')

def activate(first_date):
 if not first_date:raise ValueError('--start-date required; choose the first slot after the cloud pilot succeeds')
 status=admin('status')
 if not status['dry_runs']:raise ValueError('Cloud dry run has not succeeded')
 if not status['lessons']:
  rows=schedule(build_catalog(),config(),first_date)
  if rows[0]['generate_at']<=dt.datetime.now(dt.timezone.utc).timestamp():raise ValueError('First generation must still be in the future')
  admin('import','POST',rows)
 admin('activate','POST',{})
 settings=config();settings['start_date']=first_date;settings['publishing_enabled']=True;write_json(ROOT/'automation/config.json',settings)
 print('Cloud course activated: daily at 11:00 AM IST. Generation starts six hours earlier.')

def main():
 parser=argparse.ArgumentParser();parser.add_argument('command',choices=['credentials','doctor','deploy','pilot','status','activate','pause','provision-github','runs'])
 parser.add_argument('--lesson',choices=['lesson-01','lesson-28'],default='lesson-01');parser.add_argument('--start-date');args=parser.parse_args();load_env()
 try:
  if args.command=='credentials':credentials()
  elif args.command=='doctor':doctor()
  elif args.command=='deploy':deploy()
  elif args.command=='pilot':pilot(args.lesson)
  elif args.command=='provision-github':provision_github()
  elif args.command=='runs':runs()
  elif args.command=='activate':activate(args.start_date)
  elif args.command=='status':print(json.dumps(admin('status'),indent=2))
  else:admin('pause','POST',{});print('Cloud generation and publishing paused.')
 except Exception as exc:
  # Avoid exposing provider exception details, request URLs or credential helper output.
  print(f'Setup step failed ({type(exc).__name__}). Verify the required account access and configuration; no secret values printed.')
  raise SystemExit(1)
if __name__=='__main__':main()
