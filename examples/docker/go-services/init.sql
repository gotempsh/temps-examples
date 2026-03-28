CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO users (username, email, bio) VALUES
  ('alice', 'alice@example.com', 'Software engineer'),
  ('bob', 'bob@example.com', 'DevOps specialist'),
  ('carol', 'carol@example.com', 'Product designer');
