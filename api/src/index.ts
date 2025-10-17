import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { Client } from 'pg'

config()

const app = new Hono()
app.use('*', cors())
app.use('*', prettyJSON())

app.get('/', (c) =>
  c.json({
    ok: true,
    name: 'golffox-api',
    endpoints: ['/health', '/ai/suggest', '/admin/trips'],
  })
)

app.get('/health', (c) => c.json({ ok: true }))

app.post('/admin/setup', async (c) => {
  const tokenHeader = c.req.header('x-setup-token')
  const expected = process.env.SETUP_TOKEN
  if (!expected || tokenHeader !== expected) {
    return c.json({ ok: false, error: 'Unauthorized' }, 401)
  }
  try {
    await runSql(MIGRATION_SQL)
    await runSql(SEED_SQL)
    return c.json({ ok: true })
  } catch (error) {
    console.error('[setup] failed', error)
    return c.json({ ok: false, error: (error as Error).message }, 500)
  }
})

// Minimal AI endpoint; in production, secure + rate-limit
app.post('/ai/suggest', async (c) => {
  try {
    const body = await c.req.json()
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      return c.json({ ok: true, summary: 'Resposta simulada (sem chave Gemini configurada).' })
    }
    // TODO: Use @google/genai here with apiKey
    return c.json({ ok: true, summary: 'Resposta real da IA (placeholder).' })
  } catch (e) {
    return c.json({ ok: false, error: String(e) }, 500)
  }
})

// Example secure admin use of Supabase Service Role
app.get('/admin/trips', async (c) => {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE
  if (!url || !key) return c.json({ ok: false, error: 'Missing SUPABASE envs' }, 500)
  const admin = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await admin.from('trips').select('*').limit(50)
  if (error) return c.json({ ok: false, error: error.message }, 500)
  return c.json({ ok: true, data })
})

const port = Number(process.env.PORT || 8787)
console.log(`[API] listening on :${port}`)
serve({ fetch: app.fetch, port })
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

async function runSql(sql: string) {
  if (!DB_CONFIG.password) throw new Error('Missing SUPABASE_DB_PASSWORD env')
  const client = new Client({
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    database: DB_CONFIG.database,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  try {
    await client.query(sql)
  } finally {
    await client.end()
  }
}
