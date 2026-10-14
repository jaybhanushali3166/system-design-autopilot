CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
INSERT OR IGNORE INTO settings VALUES ('generation_enabled','false'),('publishing_enabled','false');
CREATE TABLE IF NOT EXISTS lessons (
 id TEXT PRIMARY KEY, course_id TEXT NOT NULL, ordinal INTEGER NOT NULL,
 title TEXT NOT NULL, publish_at INTEGER NOT NULL, generate_at INTEGER NOT NULL,
 state TEXT NOT NULL DEFAULT 'PLANNED', job_token TEXT, lease_until INTEGER,
 attempts INTEGER NOT NULL DEFAULT 0, next_retry_at INTEGER NOT NULL DEFAULT 0,
 video_url TEXT, cover_url TEXT, content_hash TEXT, validation_json TEXT,
 caption TEXT, container_id TEXT, container_created_at INTEGER,
 publish_started_at INTEGER, post_id TEXT, published_at INTEGER, error TEXT,
 UNIQUE(course_id,ordinal)
);
CREATE INDEX IF NOT EXISTS due_generation ON lessons(state, generate_at, next_retry_at);
CREATE INDEX IF NOT EXISTS due_publication ON lessons(state, publish_at);
CREATE TABLE IF NOT EXISTS dry_runs (
 run_id TEXT PRIMARY KEY, lesson_id TEXT NOT NULL, video_url TEXT NOT NULL,
 validation_json TEXT NOT NULL, completed_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS audit (
 id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id TEXT, event TEXT NOT NULL,
 at INTEGER NOT NULL, detail TEXT
);
