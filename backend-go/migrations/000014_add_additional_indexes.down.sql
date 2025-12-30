-- Rollback additional performance indexes

DROP INDEX IF EXISTS idx_categories_slug;
DROP INDEX IF EXISTS idx_categories_created_at;
DROP INDEX IF EXISTS idx_tags_slug;
DROP INDEX IF EXISTS idx_tags_created_at;
DROP INDEX IF EXISTS idx_activity_logs_user_id;
DROP INDEX IF EXISTS idx_activity_logs_action;
DROP INDEX IF EXISTS idx_activity_logs_entity_type;
DROP INDEX IF EXISTS idx_activity_logs_created_at;
DROP INDEX IF EXISTS idx_activity_logs_user_action;

