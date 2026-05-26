-- Create unified prize wins table to track Roulette, Ladder, and Gachapon drawings
create table if not exists public.prize_wins (
  id uuid primary key default gen_random_uuid(),
  prize_name text not null,
  participant_name text not null,
  roster_participant_id uuid null references public.event_participants(id) on delete set null,
  game_type text not null check (game_type in ('roulette', 'ladder', 'gachapon')),
  is_used boolean not null default false,
  used_at timestamptz null,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.prize_wins enable row level security;

-- Grant permissions to service_role (backend API operations use this privilege)
grant all on table public.prize_wins to service_role;

-- Allow public read access to prize wins table (everyone needs to see results)
create policy "Allow public read access to prize_wins"
  on public.prize_wins for select
  using (true);

-- Create indexes to optimize pagination, sorting and searching
create index if not exists idx_prize_wins_participant_name on public.prize_wins(participant_name);
create index if not exists idx_prize_wins_prize_name on public.prize_wins(prize_name);
create index if not exists idx_prize_wins_game_type on public.prize_wins(game_type);
create index if not exists idx_prize_wins_is_used on public.prize_wins(is_used);
create index if not exists idx_prize_wins_created_at on public.prize_wins(created_at desc);
