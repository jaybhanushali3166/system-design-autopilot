"""Turn the approved curriculum into bounded generation packets and UTC schedules."""
from __future__ import annotations
import datetime as dt, json, re
from zoneinfo import ZoneInfo
from .common import ROOT, config, write_json
SOURCES = {
1: ['https://www.amazon.jobs/content/en/how-we-hire/sde-iii-interview-prep'],
2: ['https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', 'https://www.rfc-editor.org/rfc/rfc9110'],
3: ['https://www.postgresql.org/docs/current/indexes.html', 'https://www.postgresql.org/docs/current/wal.html'],
4: ['https://redis.io/docs/latest/develop/use/client-side-caching/'],
5: ['https://www.postgresql.org/docs/current/transaction-iso.html', 'https://raft.github.io/raft.pdf'],
6: ['https://kafka.apache.org/41/design/design/', 'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/'],
7: ['https://sre.google/sre-book/handling-overload/', 'https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/'],
8: ['https://sre.google/sre-book/service-level-objectives/', 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'],
9: ['https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API'],
10: ['https://www.amazon.jobs/content/en/how-we-hire/sde-iii-interview-prep']}

def build_catalog():
    text = (ROOT / 'SYSTEM_DESIGN_CRASH_COURSE_MASTER_PLAN.md').read_text()
    section = text.split('## 3. Episode inventory', 1)[1].split('## 4. Where depth', 1)[0]
    series = 0; lessons = []
    for line in section.splitlines():
        match = re.match(r'### Series (\d+) — (.+)', line)
        if match: series = int(match[1]); series_title = match[2]
        if not re.match(r'^\| \d{2} \| \*\*', line): continue
        columns = [x.strip() for x in line.strip('|').split('|')]
        number, topic, duration, outcome, boundary, pattern = columns
        title, hook = topic.split('<br>', 1)
        lessons.append({'id': f'lesson-{int(number):02}', 'number': int(number), 'series': series,
                        'series_title': series_title, 'title': title.strip('*'), 'hook': hook,
                        'target_seconds': int(duration.rstrip('s')), 'outcome': outcome,
                        'boundary': boundary, 'interview_pattern': pattern, 'sources': SOURCES[series],
                        'template_version': 1})
    if [x['number'] for x in lessons] != list(range(1, 61)): raise ValueError('Curriculum must contain exactly 60 ordered lessons')
    write_json(ROOT / 'automation/lessons/catalog.json', lessons)
    return lessons

def schedule(lessons, settings, first_date):
    day = dt.date.fromisoformat(first_date)
    zone = ZoneInfo(settings['timezone']); hour, minute = map(int, settings['publish_time'].split(':'))
    rows = []
    for lesson in lessons:
        while day.weekday() not in settings['weekdays']: day += dt.timedelta(days=1)
        timestamp = dt.datetime.combine(day, dt.time(hour, minute), zone).astimezone(dt.timezone.utc)
        rows.append({'id': lesson['id'], 'ordinal': lesson['number'], 'course_id': settings['course_id'],
                     'title': lesson['title'], 'publish_at': int(timestamp.timestamp()),
                     'generate_at': int(timestamp.timestamp()) - settings['generation_lead_minutes'] * 60,
                     'state': 'PLANNED'})
        day += dt.timedelta(days=1)
    return rows

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(); parser.add_argument('--start-date'); args = parser.parse_args()
    lessons = build_catalog()
    if args.start_date:
        settings = config(); rows = schedule(lessons, settings, args.start_date)
        now = dt.datetime.now(dt.timezone.utc).timestamp()
        if rows[0]['generate_at'] <= now: parser.error('Choose a first slot at least six hours in the future')
        write_json(ROOT / '.autopilot/schedule.json', rows)
        print(f'Prepared {len(rows)} dated entries; first UTC epoch {rows[0]["publish_at"]}. Not imported or enabled.')
    else: print(f'Prepared {len(lessons)} lesson specifications. No dates assigned.')
