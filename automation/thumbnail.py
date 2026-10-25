"""Deterministic course covers using the channel's existing thumbnail component."""
from __future__ import annotations
import argparse, hashlib, json, subprocess
from pathlib import Path
from .common import ROOT, WORK, write_json

DIRECTORY = ROOT / 'automation/thumbnails'
PALETTE = ['#10B981','#06B6D4','#6366F1','#14B8A6','#8B5CF6','#F59E0B','#F43F5E','#3B82F6','#00B8D4','#EC4899']

def identity():
    # Cover revisions never invalidate or re-render a video's narration or frames.
    paths = ['automation/thumbnail.py','automation/thumbnails/covers.json','automation/thumbnails/entry.tsx',
             'automation/thumbnails/render.cjs','src/components/thumbnails/ReelThumbnail.tsx','src/utils/fonts.ts']
    return hashlib.sha256(b'\0'.join((ROOT / p).read_bytes() for p in paths)).hexdigest()

def specification(lesson, lessons, content=None):
    title, diagram_title, nodes, note = json.loads((DIRECTORY / 'covers.json').read_text())[lesson['id']]
    if content and content.get('cover_title'):
        title = content['cover_title']
        if not isinstance(title,str) or not 1 <= len(title) <= 32: raise ValueError('Invalid cover title')
    module = [row for row in lessons if row['series'] == lesson['series']]
    position = next(i + 1 for i, row in enumerate(module) if row['id'] == lesson['id'])
    return {'item': {'id':lesson['id'],'reelId':lesson['id'],
        'category':f'MODULE {lesson["series"]:02} · VIDEO {position} OF {len(module)}',
        'badge':'SYSTEM DESIGN CRASH COURSE','title':title,'subtitle':lesson['hook'],
        'accentColor':PALETTE[lesson['series']-1], 'tags':[node[0].title() for node in nodes],
        'diagramType':'load_balancer'},
        'sectionLabel':lesson['series_title'].upper(),
        'footerLabel':f'SYSTEM DESIGN CRASH COURSE · LESSON {lesson["number"]:02} / {len(lessons)}',
        'diagram':{'title':diagram_title,'nodes':nodes,'note':note},
        'module':{'number':lesson['series'],'title':lesson['series_title'],'video':position,'total':len(module)}}

def render_cover(lesson, lessons, project, content=None):
    project = Path(project)
    project.mkdir(parents=True, exist_ok=True)
    spec = specification(lesson, lessons, content)
    write_json(project / 'cover-input.json', [spec])
    subprocess.run(['node',str(DIRECTORY/'render.cjs'),'--input',str(project/'cover-input.json'),
                    '--output-dir',str(project),'--name','cover'], cwd=ROOT, check=True, timeout=300)
    cover = project / 'cover.jpg'
    if not cover.is_file() or not 10000 < cover.stat().st_size < 8 * 1024 * 1024:
        raise ValueError('Cover missing or outside image size budget')
    metadata = {'template_hash':identity(),'module':spec['module'],'width':1080,'height':1920,'format':'jpeg','theme':'dark-series'}
    write_json(project/'cover.json', metadata)
    return metadata

def main():
    from .catalog import build_catalog
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--lesson', required=True, help='Render only this lesson ID')
    parser.add_argument('--output-dir', type=Path, default=ROOT/'out/thumbnails')
    args=parser.parse_args();lessons=build_catalog()
    selected=[row for row in lessons if row['id']==args.lesson]
    if not selected:parser.error('Unknown lesson ID')
    jobs=[specification(row,lessons) for row in selected]
    manifest=WORK/'course-cover-input.json';write_json(manifest,jobs)
    subprocess.run(['node',str(DIRECTORY/'render.cjs'),'--input',str(manifest),
                    '--output-dir',str(args.output_dir.resolve())],cwd=ROOT,check=True,timeout=1800)
    write_json(args.output_dir/f'{args.lesson}-cover.json',{'template_hash':identity(),'lessons':jobs})

if __name__=='__main__':main()
