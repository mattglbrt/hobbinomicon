-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  approved INTEGER DEFAULT 0,
  ip_hash TEXT,
  parent_id INTEGER REFERENCES comments(id)
);

-- Index for faster lookups by post
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  ip_hash TEXT PRIMARY KEY,
  count INTEGER DEFAULT 1,
  window_start TEXT DEFAULT (datetime('now'))
);
