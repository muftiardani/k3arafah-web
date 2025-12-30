-- Create article_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS article_tags (
    article_id INTEGER NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_article_tags_article ON article_tags(article_id);
CREATE INDEX IF NOT EXISTS idx_article_tags_tag ON article_tags(tag_id);

-- Add category_id column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
