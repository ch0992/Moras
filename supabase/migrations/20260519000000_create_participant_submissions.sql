create table if not exists public.participant_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_at timestamptz not null default now(),
  display_name text null,
  mbti text null check (mbti is null or mbti ~ '^[IE][NS][TF][JP]$'),
  birth_date date null,
  birth_time time null,
  birth_time_unknown boolean not null default false,
  calendar_type text null check (calendar_type is null or calendar_type in ('solar', 'lunar')),
  birth_place text null,
  calculation_policy jsonb not null default '{}'::jsonb,
  manse_result jsonb not null default '{}'::jsonb,
  raw_submission jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.participant_submissions enable row level security;

comment on table public.participant_submissions is
  'Moras participant submissions. Contains birth data and must be accessed only through server-side admin/API flows.';

comment on column public.participant_submissions.manse_result is
  'Calculated manseryeok/saju result JSON used for matching and admin review.';
