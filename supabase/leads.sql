-- Run this in your Supabase SQL editor to enable lead storage.
-- Then set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  budget text,
  usage text,
  accessories text[] default '{}',
  stage text,
  chat_history jsonb default '[]',
  source text default 'chat_widget',
  created_at timestamptz default now()
);

alter table public.leads enable row level security;

-- Service role bypasses RLS; no public policies needed for server-side inserts.
