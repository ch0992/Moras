-- Migration to support Phase 5 Matching Engine and Voting system

-- 1. Add gender and vote_code columns to participant_submissions
alter table public.participant_submissions
  add column if not exists gender text null check (gender is null or gender in ('남', '여')),
  add column if not exists vote_code_hash text null,
  add column if not exists vote_code_generated_at timestamptz null;

comment on column public.participant_submissions.gender is
  'Participant gender: 남 (Male) or 여 (Female).';
comment on column public.participant_submissions.vote_code_hash is
  'SHA-256 hash of the participant''s secret voting/result passcode.';

-- 2. Create match_runs table to track batch executions
create table if not exists public.match_runs (
  id uuid primary key default gen_random_uuid(),
  event_id uuid null,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  prompt_version text null,
  gemini_model text null,
  started_at timestamptz null,
  completed_at timestamptz null,
  error_message text null,
  created_at timestamptz not null default now()
);

alter table public.match_runs enable row level security;
comment on table public.match_runs is 'Tracks matching engine batch runs.';

-- 3. Create compatibility_evaluations table for caching Gemini Saju evaluations
create table if not exists public.compatibility_evaluations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid null,
  match_run_id uuid null references public.match_runs(id) on delete set null,
  scorer_participant_id uuid not null references public.participant_submissions(id) on delete cascade,
  target_participant_id uuid not null references public.participant_submissions(id) on delete cascade,
  score integer not null check (score >= 0 and score <= 100),
  reason text null,
  reason_keywords text[] null,
  prompt_version text null,
  gemini_model text null,
  raw_gemini_response jsonb null,
  created_at timestamptz not null default now(),
  constraint unique_scorer_target unique (scorer_participant_id, target_participant_id)
);

alter table public.compatibility_evaluations enable row level security;
comment on table public.compatibility_evaluations is 'Caches single-direction Gemini Saju compatibility scores.';

-- 4. Create match_results table for final bipartite matches
create table if not exists public.match_results (
  id uuid primary key default gen_random_uuid(),
  match_run_id uuid not null references public.match_runs(id) on delete cascade,
  male_participant_id uuid not null references public.participant_submissions(id) on delete cascade,
  female_participant_id uuid not null references public.participant_submissions(id) on delete cascade,
  average_score numeric(5,2) not null check (average_score >= 0.00 and average_score <= 100.00),
  rank integer null,
  is_top_match boolean not null default false,
  confirmed_by_operator boolean not null default false,
  operator_notes text null,
  created_at timestamptz not null default now(),
  constraint unique_match_run_pair unique (match_run_id, male_participant_id, female_participant_id)
);

alter table public.match_results enable row level security;
comment on table public.match_results is 'Final optimal matches calculated by bipartite matching solver.';

-- 5. Create unmatched_participants table for residual group
create table if not exists public.unmatched_participants (
  id uuid primary key default gen_random_uuid(),
  match_run_id uuid not null references public.match_runs(id) on delete cascade,
  participant_id uuid not null references public.participant_submissions(id) on delete cascade,
  reason text null,
  created_at timestamptz not null default now()
);

alter table public.unmatched_participants enable row level security;
comment on table public.unmatched_participants is 'Participants left unmatched due to sex ratio imbalance.';

-- 6. Create match_votes table for private voting
create table if not exists public.match_votes (
  id uuid primary key default gen_random_uuid(),
  match_result_id uuid not null references public.match_results(id) on delete cascade,
  participant_id uuid not null references public.participant_submissions(id) on delete cascade,
  selection text not null check (selection in ('yes', 'no')),
  vote_code_hash text not null,
  revealed_at timestamptz null,
  created_at timestamptz not null default now(),
  constraint unique_vote_participant unique (match_result_id, participant_id)
);

alter table public.match_votes enable row level security;
comment on table public.match_votes is 'Private matches choice submission votes.';
