-- Add participant_mode to roulette_settings
-- Allows admins to restrict roulette to event applicants only

ALTER TABLE roulette_settings
  ADD COLUMN IF NOT EXISTS participant_mode TEXT NOT NULL DEFAULT 'open'
    CHECK (participant_mode IN ('open', 'event_only'));
