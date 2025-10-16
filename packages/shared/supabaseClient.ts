import { createClient } from '@supabase/supabase-js'

// Browser/client-side Supabase instance (Anon Key)
export const supabaseClient = (() => {
  const url = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.warn('Supabase client missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  }
  return createClient(url ?? '', key ?? '')
})()

// Server-side admin client (Service Role) — use only in API
export const supabaseAdmin = (() => {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
})()

