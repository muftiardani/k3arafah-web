-- Rollback Performance Indexes

DROP INDEX IF EXISTS idx_articles_slug;
DROP INDEX IF EXISTS idx_articles_is_published;
DROP INDEX IF EXISTS idx_articles_created_at;
DROP INDEX IF EXISTS idx_articles_author_id;

DROP INDEX IF EXISTS idx_santris_status;
DROP INDEX IF EXISTS idx_santris_nik;
DROP INDEX IF EXISTS idx_santris_created_at;

DROP INDEX IF EXISTS idx_messages_is_read;
DROP INDEX IF EXISTS idx_messages_created_at;

DROP INDEX IF EXISTS idx_photos_gallery_id;

DROP INDEX IF EXISTS idx_galleries_created_at;

DROP INDEX IF EXISTS idx_videos_created_at;

DROP INDEX IF EXISTS idx_achievements_created_at;
