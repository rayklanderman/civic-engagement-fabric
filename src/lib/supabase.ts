import { createClient } from '@supabase/supabase-js'

// Debug: Log environment variables
console.log('Environment variables:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  // Don't log the actual key in production
  HAS_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY
})

// Ensure URLs are properly formatted with protocol
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
  ? `https://${import.meta.env.VITE_SUPABASE_URL?.trim().replace(/^https?:\/\//, '')}`
  : ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', { supabaseUrl, hasAnonKey: !!supabaseAnonKey })
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with custom theme
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key) => {
        try {
          return Promise.resolve(localStorage.getItem(key))
        } catch {
          return Promise.resolve(null)
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value)
          return Promise.resolve()
        } catch {
          return Promise.resolve()
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key)
          return Promise.resolve()
        } catch {
          return Promise.resolve()
        }
      },
    },
  },
  theme: {
    default: {
      colors: {
        brand: '#BB0000',  // Kenyan Red
        brandAccent: '#006600',  // Kenyan Green
        brandButtonText: 'white',
        defaultButtonBackground: '#BB0000',
        defaultButtonBackgroundHover: '#990000',
        inputBackground: 'white',
        inputBorder: '#cccccc',
        inputBorderHover: '#BB0000',
        inputBorderFocus: '#006600',
      },
    },
  },
})
