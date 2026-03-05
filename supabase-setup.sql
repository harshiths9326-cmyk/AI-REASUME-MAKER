-- Run this entire snippet in your Supabase SQL Editor

-- 1. Create the resumes table
create table if not exists resumes (
  id text primary key,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Turn off Row Level Security (RLS) entirely for easy development
--    WARNING: Only do this for development/prototyping!
alter table resumes disable row level security;

-- (Alternatively, if you strictly want RLS enabled, run the lines below instead of the alter table above)
-- alter table resumes enable row level security;
-- create policy "Allow public read access" on resumes for select using (true);
-- create policy "Allow public insert" on resumes for insert with check (true);
-- create policy "Allow public update" on resumes for update using (true);
