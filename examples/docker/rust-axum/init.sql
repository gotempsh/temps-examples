CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  language VARCHAR(50) DEFAULT 'plaintext',
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notes_tags ON notes USING GIN (tags);
CREATE INDEX idx_notes_language ON notes (language);
CREATE INDEX idx_notes_created_at ON notes (created_at DESC);

INSERT INTO notes (title, content, language, tags) VALUES
  ('Hello World', 'fn main() { println!("Hello, world!"); }', 'rust', ARRAY['rust', 'beginner']),
  ('Fibonacci', 'function fib(n) { return n <= 1 ? n : fib(n-1) + fib(n-2); }', 'javascript', ARRAY['javascript', 'algorithm']),
  ('Docker Compose', 'services:\n  app:\n    build: .\n    ports:\n      - "3000:3000"', 'yaml', ARRAY['docker', 'devops']),
  ('SQL Join', 'SELECT u.name, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id;', 'sql', ARRAY['sql', 'database']);
