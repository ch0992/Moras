create table if not exists roulette_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists roulette_results (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references roulette_items(id) on delete cascade,
  participant_id uuid not null references participant_submissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (item_id, participant_id)
);

create index if not exists idx_roulette_results_item_id on roulette_results(item_id);
create index if not exists idx_roulette_results_created_at on roulette_results(created_at);
