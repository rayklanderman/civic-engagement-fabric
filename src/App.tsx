import { Toaster } from 'sonner';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import { supabase } from '@/lib/supabase';
import { createContext, useEffect, useState, Suspense } from 'react';
import { Loading } from '@/components/Loading';

// Create auth context with proper type
export const AuthContext = createContext<{
  session: any;
  supabase: typeof supabase;
} | null>(null);

// Error component
const ErrorFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h1 className="text-2xl font-bold text-[#BB0000] mb-4">Something went wrong</h1>
    <p className="text-gray-600 mb-4">Please try refreshing the page</p>
    <button 
      onClick={() => window.location.reload()} 
      className="px-4 py-2 bg-[#BB0000] text-white rounded hover:bg-[#990000]"
    >
      Refresh Page
    </button>
  </div>
);

// Create router with proper configuration
const router = createBrowserRouter(routes, {
  future: {
    v7_startTransition: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  }
});

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ session, supabase }}>
      <Suspense fallback={<Loading />}>
        <RouterProvider 
          router={router} 
          fallbackElement={<Loading />}
        />
      </Suspense>
      <Toaster position="top-right" />
    </AuthContext.Provider>
  );
}