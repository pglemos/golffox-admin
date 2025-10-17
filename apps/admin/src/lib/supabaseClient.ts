import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

if (!url || !key) {
  console.warn('Supabase client missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
} else {
  client = createClient(url, key)
}

export const supabaseClient = client
