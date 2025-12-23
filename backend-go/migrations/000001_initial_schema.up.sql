CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_deleted_at ON users(deleted_at);

CREATE TABLE santris (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    nik VARCHAR(50) UNIQUE,
    birth_place VARCHAR(100),
    birth_date TIMESTAMP WITH TIME ZONE,
    gender VARCHAR(10),
    address TEXT,
    parent_name VARCHAR(255),
    parent_phone VARCHAR(50),
    photo_url TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_santris_deleted_at ON santris(deleted_at);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    content TEXT,
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_deleted_at ON articles(deleted_at);
