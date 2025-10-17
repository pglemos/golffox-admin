import { createClient } from '@supabase/supabase-js'

export const supabaseClient = (() => {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) {
    console.warn('Supabase client missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
  }
  return createClient(url ?? '', key ?? '')
})()

