-- Core schema for Golffox
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists carriers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists passengers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists vehicles (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid references carriers(id) on delete set null,
  plate text not null unique,
  capacity int not null default 30,
  created_at timestamptz not null default now()
);

create table if not exists routes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references routes(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  driver_id uuid references drivers(id) on delete set null,
  status text not null default 'scheduled', -- scheduled|ongoing|completed|canceled
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists driver_positions (
  id bigint generated always as identity primary key,
  driver_id uuid references drivers(id) on delete set null,
  trip_id uuid references trips(id) on delete set null,
  lat double precision not null,
  lng double precision not null,
  speed double precision,
  heading double precision,
  created_at timestamptz not null default now()
);

create table if not exists checklists (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  items jsonb not null default '[]'::jsonb,
  notes text,
  created_at timestamptz not null default now()
);

-- RLS
alter table companies enable row level security;
alter table carriers enable row level security;
alter table drivers enable row level security;
alter table passengers enable row level security;
alter table vehicles enable row level security;
alter table routes enable row level security;
alter table trips enable row level security;
alter table driver_positions enable row level security;
alter table checklists enable row level security;

-- Basic policies (anonymous read-only for demo; tighten for production)
create policy if not exists "public read companies" on companies for select using (true);
create policy if not exists "public read carriers" on carriers for select using (true);
create policy if not exists "public read drivers" on drivers for select using (true);
create policy if not exists "public read passengers" on passengers for select using (true);
create policy if not exists "public read vehicles" on vehicles for select using (true);
create policy if not exists "public read routes" on routes for select using (true);
create policy if not exists "public read trips" on trips for select using (true);
create policy if not exists "public read driver_positions" on driver_positions for select using (true);
create policy if not exists "public insert driver_positions" on driver_positions for insert with check (true);
create policy if not exists "public read checklists" on checklists for select using (true);

-- Realtime
alter publication supabase_realtime add table driver_positions;
alter publication supabase_realtime add table trips;
alter publication supabase_realtime add table routes;

-- Trigger example: auto-start trip on first position
create or replace function fn_auto_start_trip()
returns trigger language plpgsql as $$
begin
  if NEW.trip_id is not null then
    update trips set status = 'ongoing', started_at = coalesce(started_at, now()) where id = NEW.trip_id and status = 'scheduled';
  end if;
  return NEW;
end;$$;

drop trigger if exists trg_auto_start_trip on driver_positions;
create trigger trg_auto_start_trip after insert on driver_positions for each row execute procedure fn_auto_start_trip();

