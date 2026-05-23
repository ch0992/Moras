create table if not exists public.roulette_participants (
  id uuid primary key default gen_random_uuid(),
  roster_participant_id uuid null references public.event_participants(id) on delete set null,
  display_name text not null,
  gender text null check (gender is null or gender in ('남', '여')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint roulette_participants_roster_unique unique (roster_participant_id)
);

alter table public.roulette_participants enable row level security;
grant all on table public.roulette_participants to service_role;

alter table public.roulette_results
  alter column participant_id drop not null,
  add column if not exists roulette_participant_id uuid null references public.roulette_participants(id) on delete cascade;

create unique index if not exists roulette_results_item_roulette_participant_unique
  on public.roulette_results(item_id, roulette_participant_id)
  where roulette_participant_id is not null;

create index if not exists idx_roulette_results_roulette_participant_id
  on public.roulette_results(roulette_participant_id);

alter table public.roulette_settings
  add column if not exists selected_item_ids jsonb not null default '[]'::jsonb,
  add column if not exists sequence_started_at timestamptz null,
  add column if not exists sequence_completed_at timestamptz null;
