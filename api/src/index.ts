import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config()

const app = new Hono()
app.use('*', cors())
app.use('*', prettyJSON())

app.get('/health', (c) => c.json({ ok: true }))

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

