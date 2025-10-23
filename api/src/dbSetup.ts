import pg from 'pg'
import { promises as fs } from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const { Client } = pg

const DB_CONFIG = {
  host: process.env.SUPABASE_DB_HOST ?? 'db.oulwcijxeklxllufyofb.supabase.co',
  port: Number(process.env.SUPABASE_DB_PORT ?? 5432),
  database: process.env.SUPABASE_DB_NAME ?? 'postgres',
  user: process.env.SUPABASE_DB_USER ?? 'postgres',
  password: process.env.SUPABASE_DB_PASSWORD,
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const REPO_ROOT = resolve(__dirname, '..', '..')
const DEFAULT_SUPABASE_DIR = resolve(REPO_ROOT, 'supabase')
const SUPABASE_SCRIPTS_DIR = process.env.SUPABASE_SCRIPTS_DIR
  ? resolve(process.env.SUPABASE_SCRIPTS_DIR)
  : DEFAULT_SUPABASE_DIR

function countStatements(sql: string) {
  return sql
    .split(';')
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0).length
}

async function readSqlFile(relativePath: string) {
  const candidates = [join(SUPABASE_SCRIPTS_DIR, relativePath), join(REPO_ROOT, 'supabase', relativePath)]
  const tried = new Set<string>()

  for (const candidate of candidates) {
    if (tried.has(candidate)) continue
    tried.add(candidate)

    try {
      const sql = await fs.readFile(candidate, 'utf-8')
      return sql
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        throw error
      }
    }
  }

  throw new Error(
    `Could not locate SQL file "${relativePath}". Checked: ${Array.from(tried)
      .map((path) => `\n - ${path}`)
      .join('')}`,
  )
}

export async function runSql(sql: string, label = 'SQL segment') {
  if (!DB_CONFIG.password) throw new Error('Missing SUPABASE_DB_PASSWORD env')

  const client = new Client({
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    database: DB_CONFIG.database,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    ssl: { rejectUnauthorized: false },
  })

  console.log(`[setup] connecting to Supabase host ${DB_CONFIG.host}`)
  await client.connect()

  try {
    const statements = countStatements(sql)
    console.log(`[setup] executing ${label} (${statements} statements)`) // eslint-disable-line no-console
    await client.query(sql)
    console.log(`[setup] ${label} executed successfully`)
  } catch (error) {
    console.error(`[setup] failed while executing ${label}`)
    throw error
  } finally {
    await client.end()
  }
}

export async function runSetup() {
  console.log('[setup] running Supabase migrations from supabase/schema.sql')
  const schemaSql = await readSqlFile('schema.sql')
  await runSql(schemaSql, 'schema.sql')

  console.log('[setup] applying RLS policies from supabase/rls_policies.sql')
  const rlsSql = await readSqlFile('rls_policies.sql')
  await runSql(rlsSql, 'rls_policies.sql')

  console.log('[setup] applying seed data from supabase/seed/000_seed.sql')
  const seedSql = await readSqlFile(join('seed', '000_seed.sql'))
  await runSql(seedSql, 'seed/000_seed.sql')
}
