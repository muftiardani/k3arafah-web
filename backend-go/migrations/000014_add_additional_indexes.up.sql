-- Additional Performance Indexes for new tables
-- Categories, Tags, and Activity Logs

-- Categories indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_created_at ON categories(created_at DESC);

-- Tags indexes
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_created_at ON tags(created_at DESC);

-- Activity Logs indexes (for audit queries)
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_action ON activity_logs(user_id, action);

