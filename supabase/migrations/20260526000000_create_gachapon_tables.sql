-- 1. Create gachapon_settings
create table if not exists public.gachapon_settings (
  id text primary key default 'default',
  event_name text not null default 'Moras 가차폰 추첨 이벤트',
  starts_at timestamptz null,
  draw_mode text not null default 'instant',
  sequence_completed_at timestamptz null,
  auto_spin_executed_at timestamptz null,
  sequence_started_at timestamptz null,
  updated_at timestamptz not null default now()
);
alter table public.gachapon_settings enable row level security;
grant all on table public.gachapon_settings to service_role;

insert into public.gachapon_settings (id, event_name, draw_mode)
values ('default', 'Moras 가차폰 추첨 이벤트', 'instant')
on conflict (id) do nothing;

-- 2. Create gachapon_participants
create table if not exists public.gachapon_participants (
  id uuid primary key default gen_random_uuid(),
  roster_participant_id uuid null references public.event_participants(id) on delete set null,
  display_name text not null,
  gender text null check (gender is null or gender in ('남', '여')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gachapon_participants_roster_unique unique (roster_participant_id)
);
alter table public.gachapon_participants enable row level security;
grant all on table public.gachapon_participants to service_role;

-- 3. Create gachapon_results
create table if not exists public.gachapon_results (
  id uuid primary key default gen_random_uuid(),
  gachapon_participant_id uuid null references public.gachapon_participants(id) on delete cascade,
  item_id text not null,
  prize_label text not null,
  created_at timestamptz not null default now(),
  constraint gachapon_results_participant_unique unique (gachapon_participant_id)
);
alter table public.gachapon_results enable row level security;
grant all on table public.gachapon_results to service_role;

create index if not exists idx_gachapon_results_participant_id on public.gachapon_results(gachapon_participant_id);
create index if not exists idx_gachapon_results_created_at on public.gachapon_results(created_at);

-- 4. Create gachapon_view_sessions
create table if not exists public.gachapon_view_sessions (
  session_id text primary key,
  page text not null default 'gachapon',
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
alter table public.gachapon_view_sessions enable row level security;
grant all on table public.gachapon_view_sessions to service_role;

create index if not exists idx_gachapon_view_sessions_last_seen_at on public.gachapon_view_sessions(last_seen_at);
