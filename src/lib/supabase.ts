import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client with custom theme
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
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
