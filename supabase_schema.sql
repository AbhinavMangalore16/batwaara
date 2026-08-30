-- Batwaara Database Schema for Supabase

-- 1. Profiles Table
create table if not exists public.profiles (
  id text primary key, -- Clerk User ID
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Groups Table
create table if not exists public.groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  currency text default 'USD' not null,
  invite_code text unique not null,
  created_by text references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Group Members Table
create table if not exists public.group_members (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups(id) on delete cascade not null,
  user_id text references public.profiles(id) on delete set null,
  guest_name text,
  role text default 'member' not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint member_identity check (user_id is not null or guest_name is not null)
);

-- 4. Expenses Table
create table if not exists public.expenses (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups(id) on delete cascade not null,
  created_by text references public.profiles(id) on delete set null not null,
  paid_by_member_id uuid references public.group_members(id) on delete cascade not null,
  description text not null,
  amount numeric(12, 2) not null,
  currency text default 'USD' not null,
  category text not null default 'Other',
  split_type text not null default 'equal',
  receipt_url text,
  is_recurring boolean default false,
  recurrence_period text,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Expense Splits Table
create table if not exists public.expense_splits (
  id uuid default gen_random_uuid() primary key,
  expense_id uuid references public.expenses(id) on delete cascade not null,
  member_id uuid references public.group_members(id) on delete cascade not null,
  amount numeric(12, 2) not null,
  percentage numeric(5, 2),
  shares integer
);

-- 6. Settlements Table
create table if not exists public.settlements (
  id uuid default gen_random_uuid() primary key,
  group_id uuid references public.groups(id) on delete cascade not null,
  payer_member_id uuid references public.group_members(id) on delete cascade not null,
  payee_member_id uuid references public.group_members(id) on delete cascade not null,
  amount numeric(12, 2) not null,
  currency text default 'USD' not null,
  notes text,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index if not exists idx_group_members_group_id on public.group_members(group_id);
create index if not exists idx_group_members_user_id on public.group_members(user_id);
create index if not exists idx_expenses_group_id on public.expenses(group_id);
create index if not exists idx_expense_splits_expense_id on public.expense_splits(expense_id);
create index if not exists idx_settlements_group_id on public.settlements(group_id);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.expenses enable row level security;
alter table public.expense_splits enable row level security;
alter table public.settlements enable row level security;

-- Grants for Data API exposure
grant select, insert, update, delete on table public.profiles to authenticated, anon;
grant select, insert, update, delete on table public.groups to authenticated, anon;
grant select, insert, update, delete on table public.group_members to authenticated, anon;
grant select, insert, update, delete on table public.expenses to authenticated, anon;
grant select, insert, update, delete on table public.expense_splits to authenticated, anon;
grant select, insert, update, delete on table public.settlements to authenticated, anon;

-- RLS Policies
create policy "Allow all access to profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all access to groups" on public.groups for all using (true) with check (true);
create policy "Allow all access to group_members" on public.group_members for all using (true) with check (true);
create policy "Allow all access to expenses" on public.expenses for all using (true) with check (true);
create policy "Allow all access to expense_splits" on public.expense_splits for all using (true) with check (true);
create policy "Allow all access to settlements" on public.settlements for all using (true) with check (true);

-- Ensure upi_id column exists for Direct 1-Click UPI Deep-Linking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS upi_id TEXT;
ALTER TABLE public.group_members ADD COLUMN IF NOT EXISTS upi_id TEXT;

-- Create Supabase Storage Bucket for Receipts (1GB Free Storage)
INSERT INTO storage.buckets (id, name, public)
VALUES ('receipts', 'receipts', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Access Policies for Receipts Bucket
CREATE POLICY "Public Read Access for Receipts" ON storage.objects
  FOR SELECT USING (bucket_id = 'receipts');

CREATE POLICY "Authenticated Insert Access for Receipts" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'receipts');
