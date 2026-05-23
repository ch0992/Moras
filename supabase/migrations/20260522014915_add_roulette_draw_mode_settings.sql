alter table public.roulette_settings
  add column if not exists draw_mode text not null default 'instant',
  add column if not exists scheduled_item_id uuid null references public.roulette_items(id) on delete set null,
  add column if not exists auto_spin_executed_at timestamptz null;

alter table public.roulette_settings
  drop constraint if exists roulette_settings_draw_mode_check;

alter table public.roulette_settings
  add constraint roulette_settings_draw_mode_check
  check (draw_mode in ('instant', 'timer'));

update public.roulette_settings
set draw_mode = coalesce(draw_mode, 'instant');
