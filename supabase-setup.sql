-- Run this entire snippet in your Supabase SQL Editor

-- 1. Create the resumes table
create table if not exists resumes (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade,
  data jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table resumes enable row level security;

-- Create policies for resumes
-- Note: 'id' is the resume's unique string ID (slug)
create policy "Users can view their own resumes" on resumes for select using (auth.uid() = user_id);
create policy "Users can insert their own resumes" on resumes for insert with check (auth.uid() = user_id);
create policy "Users can update their own resumes" on resumes for update using (auth.uid() = user_id);
create policy "Users can delete their own resumes" on resumes for delete using (auth.uid() = user_id);

-- 3. Create a profiles table to store extended user data
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  provider text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create policies for profiles
create policy "User can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "User can update own profile" on public.profiles for update using (auth.uid() = id);

-- 4. Automatically sync Supabase Auth users to the profiles table
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, provider)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.app_metadata->>'provider'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
