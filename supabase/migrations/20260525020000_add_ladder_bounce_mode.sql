-- Add bounce_mode setting to ladder_settings
ALTER TABLE ladder_settings ADD COLUMN IF NOT EXISTS bounce_mode TEXT NOT NULL DEFAULT 'random';
