from __future__ import annotations
import json, os, pathlib, subprocess
ROOT = pathlib.Path(__file__).resolve().parent.parent
CONFIG = ROOT / 'automation/config.json'
WORK = ROOT / '.autopilot'

def load_env():
    for name in ['.env.autopilot', '.env']:
        p = ROOT / name
        if not p.exists(): continue
        for line in p.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line: continue
            key, value = line.split('=', 1)
            if key.strip() and value.strip():
                os.environ.setdefault(key.strip(), value.strip().strip('\"\''))

def config(): return json.loads(CONFIG.read_text())
def write_json(path, value):
    path = pathlib.Path(path); path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value, indent=2) + '\n'); temporary.replace(path)

def github_token():
    token = os.environ.get('GITHUB_TOKEN') or os.environ.get('GH_TOKEN')
    if token: return token
    # Git's configured helper may already authenticate this repository. Never print its output.
    result = subprocess.run(['git', 'credential', 'fill'], input='protocol=https\nhost=github.com\n\n',
                            text=True, capture_output=True, timeout=15,
                            env={**os.environ, 'GIT_TERMINAL_PROMPT': '0'})
    fields = dict(line.split('=', 1) for line in result.stdout.splitlines() if '=' in line)
    return fields.get('password', '')
