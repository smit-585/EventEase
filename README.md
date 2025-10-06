# EventEase – College Event Management

A React + Vite + TypeScript app for managing college events with role-based access, Supabase auth, and student registrations.

## Features

- Landing page with highlights
- Email/password authentication (Supabase)
- Roles: student, faculty, admin
- Create and browse events
- Student registrations with live seat availability
- Admin moderation (optional)

## Tech Stack

- Vite, React, TypeScript
- Tailwind CSS, shadcn/ui
- Supabase (Auth, Postgres, RLS)

## Getting Started

1) Install dependencies
```sh
npm install
```

2) Set environment variables in `.env.local`
```sh
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
```

3) Start the dev server
```sh
npm run dev
```
Open http://localhost:8080

## Database Setup (Supabase)

Run these in Supabase SQL Editor to create enums, tables, RLS, and policies:

```sql
-- Enums
create type public.user_role as enum ('student','faculty','admin');
create type public.event_status as enum ('pending','approved','rejected','cancelled','completed');
create type public.event_category as enum ('academic','cultural','technical','sports','workshop','seminar','other');

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role public.user_role not null default 'student',
  department text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy if not exists "Users can view their own profile"
  on public.profiles for select using (auth.uid() = id);
create policy if not exists "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category public.event_category not null,
  event_date date not null,
  start_time time not null,
  end_time time not null,
  venue text not null,
  max_seats integer not null check (max_seats > 0),
  available_seats integer not null check (available_seats >= 0),
  coordinator_id uuid not null references public.profiles(id),
  status public.event_status not null default 'pending',
  banner_image text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.events enable row level security;
drop policy if exists "Anyone can view events" on public.events;
create policy "Anyone can view events" on public.events for select using (true);
drop policy if exists "Faculty can create events" on public.events;
create policy "Faculty can create events" on public.events for insert
  with check (exists (select 1 from public.profiles where id = auth.uid() and role in ('faculty','admin')));
drop policy if exists "Faculty can update their own events" on public.events;
create policy "Faculty can update their own events" on public.events for update using (coordinator_id = auth.uid());
drop policy if exists "Admins can update any event" on public.events;
create policy "Admins can update any event" on public.events for update
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- Registrations
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  registered_at timestamptz default now(),
  attended boolean default false,
  certificate_issued boolean default false,
  unique(event_id, student_id)
);
alter table public.registrations enable row level security;
drop policy if exists "Students can view their own registrations" on public.registrations;
create policy "Students can view their own registrations" on public.registrations for select using (student_id = auth.uid());
drop policy if exists "Students can register for events" on public.registrations;
create policy "Students can register for events" on public.registrations for insert
  with check (student_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and role = 'student'));

-- Signup trigger creates profile row
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name','User'), coalesce((new.raw_user_meta_data->>'role')::public.user_role,'student'))
  on conflict (id) do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
```

## Notes

- Dev server runs on port 8080 (see `vite.config.ts`).
- For local testing you can keep events visible to everyone; for production you may switch back to showing only approved events.
