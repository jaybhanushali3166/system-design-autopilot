CREATE TABLE IF NOT EXISTS insight_snapshots (
 media_id TEXT NOT NULL, observed_at INTEGER NOT NULL, lesson_id TEXT,
 age_hours REAL NOT NULL, cohort TEXT NOT NULL, window_hours INTEGER,
 metrics_json TEXT NOT NULL, PRIMARY KEY(media_id,observed_at)
);
CREATE INDEX IF NOT EXISTS insight_snapshot_window ON insight_snapshots(window_hours,observed_at);
CREATE TABLE IF NOT EXISTS insight_windows (
 media_id TEXT NOT NULL, window_hours INTEGER NOT NULL,
 state TEXT NOT NULL, claim_token TEXT, lease_until INTEGER NOT NULL DEFAULT 0,
 retry_at INTEGER NOT NULL DEFAULT 0, attempts INTEGER NOT NULL DEFAULT 0,
 observed_at INTEGER, PRIMARY KEY(media_id,window_hours)
);
