-- Performance Indexes for K3 Arafah Database
-- Improves query performance for common operations

-- Articles indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_is_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);

-- Santris indexes
CREATE INDEX IF NOT EXISTS idx_santris_status ON santris(status);
CREATE INDEX IF NOT EXISTS idx_santris_nik ON santris(nik);
CREATE INDEX IF NOT EXISTS idx_santris_created_at ON santris(created_at DESC);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Photos indexes (for gallery queries)
CREATE INDEX IF NOT EXISTS idx_photos_gallery_id ON photos(gallery_id);

-- Galleries indexes
CREATE INDEX IF NOT EXISTS idx_galleries_created_at ON galleries(created_at DESC);

-- Videos indexes
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_achievements_created_at ON achievements(created_at DESC);
