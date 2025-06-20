-- Apply psql -d insert_your_repo_here -f src/db/schema.sql

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  -- username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  repo_id TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  description TEXT,
  stars INTEGER,
  language TEXT,
  html_url TEXT NOT NULL
);
