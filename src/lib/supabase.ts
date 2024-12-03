import { createClient } from '@supabase/supabase-js'

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

const supabaseUrl = `https://${import.meta.env.VITE_SUPABASE_URL}`
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: Log environment setup (remove in production)
console.log('Environment variables:', {
  VITE_SUPABASE_URL: supabaseUrl,
  HAS_ANON_KEY: !!supabaseAnonKey
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
