import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import { runSetup, runSql } from './dbSetup.js'

config()

const app = new Hono()
app.use('*', cors())
app.use('*', prettyJSON())

app.get('/', (c) =>
  c.json({
    ok: true,
    name: 'golffox-api',
    endpoints: ['/health', '/ai/suggest', '/admin/trips', '/admin/setup'],
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
    await runSetup()
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

// Optional auto-setup if enabled via env (e.g., during CI/build hooks)
if (process.env.AUTO_DB_SETUP === 'true') {
  runSetup()
    .then(() => console.log('[setup] Supabase schema ensured'))
    .catch((err) => console.error('[setup] failed during startup', err))
}

export { runSetup, runSql }
