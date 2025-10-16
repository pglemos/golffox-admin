-- Golffox core schema aligned with multi-panel architecture
-- This migration can be executed inside Supabase SQL editor or the CLI
-- It creates essential tables, real-time publication bindings, role-based
-- policies and seed data to quickly bootstrap the environment.

-- Helper to read custom claims injected in Supabase JWT tokens
create or replace function public.current_app_role()
returns text
language sql
stable
as $$
  select coalesce((current_setting('request.jwt.claims', true)::jsonb)->>'role', 'anonymous');
$$;

-- Helper trigger for updated_at columns
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Core entities -----------------------------------------------------------

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.carriers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  contact_email text,
  contact_phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  carrier_id uuid references public.carriers(id) on delete set null,
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.passengers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid references public.carriers(id) on delete cascade,
  driver_id uuid references public.drivers(id) on delete set null,
  plate text not null unique,
  capacity integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  carrier_id uuid references public.carriers(id) on delete set null,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  driver_id uuid references public.drivers(id) on delete set null,
  name text not null,
  status text default 'scheduled',
  start_point jsonb,
  end_point jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references public.routes(id) on delete cascade,
  scheduled_at timestamptz not null,
  started_at timestamptz,
  finished_at timestamptz,
  status text default 'scheduled',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.driver_positions (
  id bigserial primary key,
  driver_id uuid references public.drivers(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete cascade,
  coordinates geography(point, 4326) not null,
  speed numeric,
  heading numeric,
  recorded_at timestamptz not null default now()
);

create table if not exists public.checklists (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  driver_id uuid references public.drivers(id) on delete set null,
  trip_id uuid references public.trips(id) on delete set null,
  items jsonb not null,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger wiring ---------------------------------------------------------

create trigger set_timestamp
before update on public.companies
for each row execute procedure public.handle_updated_at();

create trigger set_timestamp_carriers
before update on public.carriers
for each row execute procedure public.handle_updated_at();

create trigger set_timestamp_drivers
before update on public.drivers
for each row execute procedure public.handle_updated_at();

create trigger set_timestamp_passengers
before update on public.passengers
for each row execute procedure public.handle_updated_at();

create trigger set_timestamp_vehicles
before update on public.vehicles
for each row execute procedure public.handle_updated_at();

create trigger set_timestamp_routes
before update on public.routes
for each row execute procedure public.handle_updated_at();

create trigger set_timestamp_trips
before update on public.trips
for each row execute procedure public.handle_updated_at();

create trigger set_timestamp_checklists
before update on public.checklists
for each row execute procedure public.handle_updated_at();

-- Row Level Security -----------------------------------------------------

alter table public.companies enable row level security;
alter table public.carriers enable row level security;
alter table public.drivers enable row level security;
alter table public.passengers enable row level security;
alter table public.vehicles enable row level security;
alter table public.routes enable row level security;
alter table public.trips enable row level security;
alter table public.driver_positions enable row level security;
alter table public.checklists enable row level security;

-- Admins full access across the board
create policy "Admins manage everything" on public.companies
  for all using (current_app_role() = 'admin') with check (current_app_role() = 'admin');
create policy "Admins manage everything" on public.carriers
  for all using (current_app_role() = 'admin') with check (current_app_role() = 'admin');
create policy "Admins manage everything" on public.drivers
  for all using (current_app_role() = 'admin') with check (current_app_role() = 'admin');
create policy "Admins manage everything" on public.passengers
  for all using (current_app_role() = 'admin') with check (current_app_role() = 'admin');
create policy "Admins manage everything" on public.vehicles
  for all using (current_app_role() = 'admin') with check (current_app_role() = 'admin');
create policy "Admins manage everything" on public.routes
  for all using (current_app_role() = 'admin') with check (current_app_role() = 'admin');
create policy "Admins manage everything" on public.trips
  for all using (current_app_role() = 'admin') with check (current_app_role() = 'admin');
create policy "Admins manage everything" on public.driver_positions
  for all using (current_app_role() = 'admin') with check (current_app_role() = 'admin');
create policy "Admins manage everything" on public.checklists
  for all using (current_app_role() = 'admin') with check (current_app_role() = 'admin');

-- Operators: read everything, manage operational entities
create policy "Operators can read" on public.companies
  for select using (current_app_role() in ('admin','operator'));
create policy "Operators manage ops" on public.routes
  for all using (current_app_role() in ('admin','operator')) with check (current_app_role() in ('admin','operator'));
create policy "Operators manage ops" on public.trips
  for all using (current_app_role() in ('admin','operator')) with check (current_app_role() in ('admin','operator'));
create policy "Operators manage ops" on public.vehicles
  for all using (current_app_role() in ('admin','operator')) with check (current_app_role() in ('admin','operator'));
create policy "Operators manage ops" on public.checklists
  for all using (current_app_role() in ('admin','operator')) with check (current_app_role() in ('admin','operator'));
create policy "Operators read people" on public.drivers
  for select using (current_app_role() in ('admin','operator'));
create policy "Operators read people" on public.passengers
  for select using (current_app_role() in ('admin','operator'));
create policy "Operators read positions" on public.driver_positions
  for select using (current_app_role() in ('admin','operator'));
create policy "Operators read carriers" on public.carriers
  for select using (current_app_role() in ('admin','operator'));

-- Carriers: manage their own assets
create policy "Carriers manage fleet" on public.vehicles
  for all using (current_app_role() in ('admin','operator','carrier'))
  with check (current_app_role() in ('admin','operator','carrier'));
create policy "Carriers read routes" on public.routes
  for select using (current_app_role() in ('admin','operator','carrier'));
create policy "Carriers read trips" on public.trips
  for select using (current_app_role() in ('admin','operator','carrier'));
create policy "Carriers read drivers" on public.drivers
  for select using (current_app_role() in ('admin','operator','carrier'));
create policy "Carriers read positions" on public.driver_positions
  for select using (current_app_role() in ('admin','operator','carrier'));

-- Drivers: manage their own trip data & checklists
create policy "Drivers manage positions" on public.driver_positions
  for insert with check (current_app_role() = 'driver');
create policy "Drivers read positions" on public.driver_positions
  for select using (current_app_role() in ('driver','operator','admin','carrier','passenger'));
create policy "Drivers manage checklists" on public.checklists
  for insert with check (current_app_role() = 'driver');
create policy "Drivers read own trips" on public.trips
  for select using (current_app_role() in ('driver','operator','admin','carrier'));

-- Passengers: read routes and realtime information
create policy "Passengers read routes" on public.routes
  for select using (current_app_role() in ('passenger','admin','operator','carrier'));
create policy "Passengers read trips" on public.trips
  for select using (current_app_role() in ('passenger','admin','operator','carrier'));
create policy "Passengers read positions" on public.driver_positions
  for select using (current_app_role() in ('passenger','admin','operator','carrier','driver'));

-- Realtime publication ---------------------------------------------------
alter publication supabase_realtime add table public.driver_positions;
alter publication supabase_realtime add table public.trips;
alter publication supabase_realtime add table public.routes;

-- Seed data --------------------------------------------------------------
insert into public.companies (name)
values ('Golffox Tech'), ('SynVolt Logistics')
on conflict do nothing;

insert into public.carriers (name, company_id)
select 'TransFox', id from public.companies where name = 'Golffox Tech'
on conflict do nothing;

insert into public.drivers (name, phone, status)
values
  ('João Motorista', '(31) 99999-1111', 'active'),
  ('Carlos Freitas', '(31) 88888-2222', 'active')
on conflict do nothing;

insert into public.passengers (name, phone)
values
  ('Maria Lima', '(31) 99999-4444'),
  ('Lucas Silva', '(31) 97777-5555')
on conflict do nothing;

insert into public.vehicles (plate, capacity)
values
  ('ABC-1234', 30),
  ('XYZ-5678', 40)
on conflict (plate) do nothing;

insert into public.routes (name, status)
values
  ('Rota A - Centro', 'scheduled'),
  ('Rota B - Industrial', 'scheduled')
on conflict do nothing;

