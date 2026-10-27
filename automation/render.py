"""Trusted story renderer entry point and cache identity."""
from __future__ import annotations
import hashlib,subprocess
from .common import ROOT,config
from .render_story import build_story

def identity():
    files=['automation/render.py','automation/render_story.py','automation/story_contract.py','automation/creative_review.py','automation/assets/bed.mp3','automation/assets/pop.mp3']
    return hashlib.sha256(b'\0'.join((ROOT/p).read_bytes() for p in files)).hexdigest()

def build(lesson,content,audio,project):return build_story(lesson,content,audio,project)

def command(project,*args):subprocess.run(['npx','--yes',f'hyperframes@{config()["hyperframes_version"]}',*args],cwd=project,check=True,timeout=2400)
