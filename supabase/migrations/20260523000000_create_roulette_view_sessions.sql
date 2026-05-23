create table if not exists public.roulette_view_sessions (
  session_id text primary key,
  page text not null default 'roulette',
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.roulette_view_sessions enable row level security;
grant all on table public.roulette_view_sessions to service_role;

create index if not exists idx_roulette_view_sessions_last_seen_at
  on public.roulette_view_sessions(last_seen_at);
