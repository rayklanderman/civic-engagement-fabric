import { createClient } from '@supabase/supabase-js'

// Ensure URLs are properly formatted
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || ''

if (!supabaseUrl || !supabaseAnonKey) {
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
