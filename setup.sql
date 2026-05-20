-- =============================================
-- Telegram Premium Bot - Supabase Setup SQL
-- Run this in Supabase SQL Editor
-- =============================================

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  first_name TEXT,
  last_name TEXT,
  is_banned BOOLEAN DEFAULT FALSE,
  message_count INT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- ADMINS TABLE
CREATE TABLE IF NOT EXISTS admins (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  username TEXT,
  added_by BIGINT,
  added_at TIMESTAMPTZ DEFAULT NOW()
);

-- SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BUTTONS TABLE
CREATE TABLE IF NOT EXISTS buttons (
  id BIGSERIAL PRIMARY KEY,
  channel_id TEXT NOT NULL,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONTENT CHANNELS TABLE (auto konten)
CREATE TABLE IF NOT EXISTS content_channels (
  id BIGSERIAL PRIMARY KEY,
  channel_id TEXT UNIQUE NOT NULL,
  label TEXT,
  limit_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LOGS TABLE
CREATE TABLE IF NOT EXISTS logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  action TEXT,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WELCOME MESSAGE TABLE
CREATE TABLE IF NOT EXISTS welcome_messages (
  id BIGSERIAL PRIMARY KEY,
  chat_id BIGINT UNIQUE NOT NULL,
  message TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- DEFAULT SETTINGS
-- =============================================
INSERT INTO settings (key, value) VALUES
  ('protect_content', 'false'),
  ('welcome_message', 'Selamat datang di bot kami! 👋'),
  ('maintenance_mode', 'false'),
  ('max_limit', '10')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at);
CREATE INDEX IF NOT EXISTS idx_buttons_channel_id ON buttons(channel_id);
