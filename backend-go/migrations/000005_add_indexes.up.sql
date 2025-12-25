CREATE INDEX IF NOT EXISTS idx_articles_is_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at);
CREATE INDEX IF NOT EXISTS idx_santris_status ON santris(status);
CREATE INDEX IF NOT EXISTS idx_santris_created_at ON santris(created_at);
CREATE INDEX IF NOT EXISTS idx_galleries_created_at ON galleries(created_at);
