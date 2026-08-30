-- Clean Wipe Script for Batwaara Database
-- Run this in Supabase SQL Editor to wipe all sample data and start completely fresh!

TRUNCATE TABLE public.settlements CASCADE;
TRUNCATE TABLE public.expense_splits CASCADE;
TRUNCATE TABLE public.expenses CASCADE;
TRUNCATE TABLE public.group_members CASCADE;
TRUNCATE TABLE public.groups CASCADE;

-- Optional: To also clear user profiles so everyone re-syncs fresh upon login:
-- TRUNCATE TABLE public.profiles CASCADE;
