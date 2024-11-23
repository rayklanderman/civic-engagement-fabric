import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './styles/global.css'
import { Loading } from './components/Loading'

// Configure QueryClient with retries and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      suspense: true,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Get root element and validate
const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

// Render app with error boundaries and suspense
createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>
)
