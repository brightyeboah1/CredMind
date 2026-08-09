-- ═══════════════════════════════════════════════════════════════════════
-- MVP DATABASE SCHEMA
-- Run this in Supabase → SQL Editor → New Query, in one go.
-- ═══════════════════════════════════════════════════════════════════════

-- PROFILES (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  credit_score int,
  monthly_income numeric,
  goal text,
  subscription_tier text default 'free',
  credit_balance numeric default 0,
  referral_code text unique default substr(md5(random()::text), 1, 8),
  referred_by uuid references profiles(id),
  created_at timestamptz default now()
);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- CREDIT CARDS
create table credit_cards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  bank text not null,
  network text,
  card_type text,
  annual_fee numeric default 0,
  annual_fee_note text,
  purchase_rate numeric,
  welcome_bonus_text text,
  min_spend_amount numeric,
  min_spend_period text,
  reward_type text,
  reward_program text,
  rewards jsonb,
  insurance jsonb,
  lounge_access boolean default false,
  lounge_details text,
  min_credit_score text,
  income_req text,
  is_featured boolean default false,
  featured_bonus_text text,
  affiliate_link text,
  affiliate_commission numeric,
  card_highlights jsonb,
  balance_transfer boolean default false,
  bt_rate numeric,
  bt_months int,
  bt_fee numeric,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- USER DEBTS
create table user_debts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  debt_name text,
  balance numeric,
  interest_rate numeric,
  minimum_payment numeric,
  created_at timestamptz default now()
);

-- USAGE TRACKING (free tier caps — enforced by /api/chat)
create table usage_tracking (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  feature text,
  month text,
  count int default 0,
  unique(user_id, feature, month)
);

-- CLICK EVENTS (affiliate + investor metrics)
create table click_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete set null,
  card_id uuid references credit_cards(id),
  event_type text,
  created_at timestamptz default now()
);

-- WAITLIST (fake-door test for premium)
create table waitlist_emails (
  id uuid default gen_random_uuid() primary key,
  email text unique,
  source text,
  created_at timestamptz default now()
);

-- QUIZ RESULTS
create table quiz_results (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  answers jsonb,
  recommended_cards jsonb,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════════════
-- HOME PAGE ADDITIONS — current stack, watchlist, notification prefs
-- If you already ran this file once, run just this block against your
-- existing project (SQL Editor → New Query → paste this section only).
-- ═══════════════════════════════════════════════════════════════════════

alter table profiles add column if not exists push_notifications boolean default true;

-- USER'S CURRENT CARD STACK ("your stack" on Home)
-- card_id is text (matches data/cards.ts ids), not a FK — the credit_cards
-- table above isn't populated from the static seed yet, same decoupling
-- the rest of the MVP already relies on.
create table user_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  card_id text not null,
  added_at timestamptz default now(),
  unique(user_id, card_id)
);

-- WATCHLIST ("cards you're eyeing" on Home)
create table watchlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  card_id text not null,
  added_at timestamptz default now(),
  unique(user_id, card_id)
);

alter table user_cards enable row level security;
alter table watchlist enable row level security;

create policy "Users manage own stack" on user_cards
  for all using (auth.uid() = user_id);
create policy "Users manage own watchlist" on watchlist
  for all using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY — do not skip this section
-- ═══════════════════════════════════════════════════════════════════════

alter table profiles enable row level security;
alter table user_debts enable row level security;
alter table usage_tracking enable row level security;
alter table quiz_results enable row level security;

create policy "Users manage own profile" on profiles
  for all using (auth.uid() = id);
create policy "Users manage own debts" on user_debts
  for all using (auth.uid() = user_id);
create policy "Users manage own usage" on usage_tracking
  for all using (auth.uid() = user_id);
create policy "Users manage own quiz results" on quiz_results
  for all using (auth.uid() = user_id);

alter table credit_cards enable row level security;
create policy "Anyone can view active cards" on credit_cards
  for select using (is_active = true);

alter table click_events enable row level security;
create policy "Anyone can log clicks" on click_events
  for insert with check (true);

alter table waitlist_emails enable row level security;
create policy "Anyone can join waitlist" on waitlist_emails
  for insert with check (true);
