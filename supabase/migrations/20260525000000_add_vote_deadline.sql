-- Add vote_deadline_at to match_runs for 24-hour voting window management
alter table public.match_runs
  add column if not exists vote_deadline_at timestamptz null;

comment on column public.match_runs.vote_deadline_at is
  'Deadline for participants to cast their match votes. Auto-X applied after this time.';

-- Make vote_code_hash nullable (switching from passcode-based to name-based auth)
alter table public.match_votes
  alter column vote_code_hash drop not null;
