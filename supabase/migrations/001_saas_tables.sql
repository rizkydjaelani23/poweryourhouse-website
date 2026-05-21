-- ============================================================
-- SaaS tables for poweryourhouse.io AI Colour Remaker
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor)
-- ============================================================

-- saas_profiles: one row per authenticated user
create table if not exists saas_profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  marketing_consent   boolean not null default false,
  paddle_customer_id  text unique,
  plan                text not null default 'free',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- saas_credit_ledger: append-only ledger; balance = sum(delta) per user+type
create table if not exists saas_credit_ledger (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references saas_profiles(id) on delete cascade,
  type        text not null check (type in ('STANDARD', 'HD')),
  delta       integer not null,   -- positive = add, negative = deduct
  reason      text not null,      -- 'signup_bonus' | 'pack_purchase' | 'subscription' | 'generation'
  ref_id      text,               -- generation id or Paddle transaction id
  created_at  timestamptz not null default now()
);

-- saas_generations: one row per generation job
create table if not exists saas_generations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references saas_profiles(id) on delete cascade,
  type             text not null check (type in ('STANDARD', 'HD')),
  input_image_url  text not null,
  output_image_url text,
  colour_hex       text,
  swatch_url       text,
  status           text not null default 'pending' check (status in ('pending', 'processing', 'done', 'failed')),
  error            text,
  created_at       timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists idx_saas_ledger_user_type
  on saas_credit_ledger(user_id, type);

create index if not exists idx_saas_generations_user_created
  on saas_generations(user_id, created_at desc);

create index if not exists idx_saas_profiles_paddle
  on saas_profiles(paddle_customer_id)
  where paddle_customer_id is not null;

-- ── Row Level Security ────────────────────────────────────────
alter table saas_profiles      enable row level security;
alter table saas_credit_ledger enable row level security;
alter table saas_generations   enable row level security;

-- saas_profiles: each user can read and update their own row
create policy "saas_profiles_select_own"
  on saas_profiles for select
  using (auth.uid() = id);

create policy "saas_profiles_update_own"
  on saas_profiles for update
  using (auth.uid() = id);

-- saas_credit_ledger: each user can read their own ledger
create policy "saas_ledger_select_own"
  on saas_credit_ledger for select
  using (auth.uid() = user_id);

-- saas_generations: each user can read their own generations
create policy "saas_generations_select_own"
  on saas_generations for select
  using (auth.uid() = user_id);

-- NOTE: All INSERT / UPDATE operations on these tables are performed
-- by the server using the service-role key (createAdminClient), which
-- bypasses RLS automatically. No INSERT policies needed for normal users.
