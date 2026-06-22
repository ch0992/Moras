create table if not exists public.friendship_recommendations (
  id uuid primary key default gen_random_uuid(),
  match_run_id uuid not null references public.match_runs(id) on delete cascade,
  participant_id uuid not null references public.participant_submissions(id) on delete cascade,
  recommended_participant_id uuid not null references public.participant_submissions(id) on delete cascade,
  rank integer not null check (rank between 1 and 3),
  score numeric not null,
  score_detail jsonb null,
  created_at timestamptz not null default now(),
  constraint friendship_recommendations_unique_rank unique (match_run_id, participant_id, rank),
  constraint friendship_recommendations_unique_target unique (match_run_id, participant_id, recommended_participant_id),
  constraint friendship_recommendations_no_self check (participant_id <> recommended_participant_id)
);

alter table public.friendship_recommendations enable row level security;

create index if not exists idx_friendship_recommendations_run_participant
  on public.friendship_recommendations(match_run_id, participant_id, rank);

create index if not exists idx_friendship_recommendations_recommended
  on public.friendship_recommendations(recommended_participant_id);

comment on table public.friendship_recommendations is
  'Per-participant friendship recommendation results. Each friendship participant can receive up to three opposite-gender recommendations.';

comment on column public.friendship_recommendations.rank is
  'Recommendation rank for one participant within a match run. 1 is the strongest friendship recommendation.';
