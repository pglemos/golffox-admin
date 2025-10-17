import pg from 'pg'

const { Client } = pg

const DB_CONFIG = {
  host: process.env.SUPABASE_DB_HOST ?? 'db.oulwcijxeklxllufyofb.supabase.co',
  port: Number(process.env.SUPABASE_DB_PORT ?? 5432),
  database: process.env.SUPABASE_DB_NAME ?? 'postgres',
  user: process.env.SUPABASE_DB_USER ?? 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
}

const MIGRATION_SQL = `-- Core schema for Golffox
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
  status text not null default 'scheduled',
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

alter table companies enable row level security;
alter table carriers enable row level security;
alter table drivers enable row level security;
alter table passengers enable row level security;
alter table vehicles enable row level security;
alter table routes enable row level security;
alter table trips enable row level security;
alter table driver_positions enable row level security;
alter table checklists enable row level security;

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

alter publication supabase_realtime add table driver_positions;
alter publication supabase_realtime add table trips;
alter publication supabase_realtime add table routes;

create or replace function fn_auto_start_trip()
returns trigger language plpgsql as $$
begin
  if NEW.trip_id is not null then
    update trips
      set status = 'ongoing', started_at = coalesce(started_at, now())
      where id = NEW.trip_id and status = 'scheduled';
  end if;
  return NEW;
end;$$;

drop trigger if exists trg_auto_start_trip on driver_positions;
create trigger trg_auto_start_trip after insert on driver_positions for each row execute procedure fn_auto_start_trip();
`

const SEED_SQL = `insert into companies (name) values ('Golffox Tech') on conflict do nothing;
insert into companies (name) values ('SynVolt Logistics') on conflict do nothing;

insert into carriers (name, company_id)
select 'TransFox', id from companies where name = 'Golffox Tech'
on conflict do nothing;

insert into drivers (name, phone)
values ('João Motorista', '(31) 99999-1111'), ('Carlos Freitas', '(31) 88888-2222')
on conflict do nothing;

insert into passengers (name, phone)
values ('Maria Lima', '(31) 99999-4444'), ('Lucas Silva', '(31) 97777-5555')
on conflict do nothing;

insert into vehicles (plate, capacity)
values ('ABC-1234', 30), ('XYZ-5678', 40)
on conflict do nothing;

insert into routes (name)
values ('Rota A - Centro'), ('Rota B - Industrial')
on conflict do nothing;`

export async function runSql(sql: string) {
  if (!DB_CONFIG.password) throw new Error('Missing SUPABASE_DB_PASSWORD env')
  const client = new Client({
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    database: DB_CONFIG.database,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    ssl: { rejectUnauthorized: false },
  })
  console.log('[setup] connecting to Supabase host', DB_CONFIG.host)
  await client.connect()
  try {
    console.log('[setup] executing SQL segment')
    await client.query(sql)
  } finally {
    await client.end()
  }
}

export async function runSetup() {
  console.log('[setup] running migrations')
  await runSql(MIGRATION_SQL)
  console.log('[setup] running seed')
  await runSql(SEED_SQL)
}
