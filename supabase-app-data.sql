-- Run this in the Supabase SQL editor for the Gym Tunisia project.
-- Profiles are already used by the app; the tables below move meals,
-- workout progress, and editable macro targets from local device storage
-- to account-scoped Supabase storage.

create table if not exists public.meal_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('breakfast', 'lunch', 'dinner', 'snack')),
  name text not null,
  calories integer not null default 0,
  protein integer not null default 0,
  carbs integer not null default 0,
  fat integer not null default 0,
  date date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists meal_entries_user_date_idx on public.meal_entries(user_id, date desc);

alter table public.meal_entries enable row level security;

drop policy if exists "Users can read their own meals" on public.meal_entries;
create policy "Users can read their own meals"
on public.meal_entries for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own meals" on public.meal_entries;
create policy "Users can insert their own meals"
on public.meal_entries for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own meals" on public.meal_entries;
create policy "Users can update their own meals"
on public.meal_entries for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own meals" on public.meal_entries;
create policy "Users can delete their own meals"
on public.meal_entries for delete
using (auth.uid() = user_id);

create table if not exists public.workout_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  day text not null,
  focus text not null,
  completed boolean not null default false,
  exercises jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, date, day)
);

create index if not exists workout_progress_user_date_idx on public.workout_progress(user_id, date desc);

alter table public.workout_progress enable row level security;

drop policy if exists "Users can read their own workout progress" on public.workout_progress;
create policy "Users can read their own workout progress"
on public.workout_progress for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own workout progress" on public.workout_progress;
create policy "Users can insert their own workout progress"
on public.workout_progress for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own workout progress" on public.workout_progress;
create policy "Users can update their own workout progress"
on public.workout_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own workout progress" on public.workout_progress;
create policy "Users can delete their own workout progress"
on public.workout_progress for delete
using (auth.uid() = user_id);

create table if not exists public.nutrition_target_overrides (
  user_id uuid primary key references auth.users(id) on delete cascade,
  calories integer not null,
  protein integer not null,
  carbs integer not null,
  fat integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.nutrition_target_overrides enable row level security;

drop policy if exists "Users can read their own nutrition targets" on public.nutrition_target_overrides;
create policy "Users can read their own nutrition targets"
on public.nutrition_target_overrides for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own nutrition targets" on public.nutrition_target_overrides;
create policy "Users can insert their own nutrition targets"
on public.nutrition_target_overrides for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own nutrition targets" on public.nutrition_target_overrides;
create policy "Users can update their own nutrition targets"
on public.nutrition_target_overrides for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own nutrition targets" on public.nutrition_target_overrides;
create policy "Users can delete their own nutrition targets"
on public.nutrition_target_overrides for delete
using (auth.uid() = user_id);
