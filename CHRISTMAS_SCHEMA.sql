-- Create table for people on the christmas list
create table if not exists christmas_people (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text not null, -- Clerk user ID
  name text not null,
  budget numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create table for gifts
create table if not exists christmas_gifts (
  id uuid default gen_random_uuid() primary key,
  person_id uuid references christmas_people(id) on delete cascade not null,
  name text not null,
  link text,
  cost numeric default 0,
  status text check (status in ('idea', 'bought')) default 'idea',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Default deny for public/anon, Service Role bypasses this)
alter table christmas_people enable row level security;
alter table christmas_gifts enable row level security;

