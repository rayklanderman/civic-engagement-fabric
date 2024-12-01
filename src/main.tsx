import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './styles/global.css'
import { Loading } from './components/Loading'
import { 
  createBrowserRouter,
  RouterProvider,
  Future
} from 'react-router-dom';

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

const routes = [
  {
    path: '/',
    element: <App />,
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
});

// Render app with error boundaries and suspense
createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  </React.StrictMode>
)
