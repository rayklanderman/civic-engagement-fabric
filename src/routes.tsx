import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from "@/components/Layout";

// Lazy load components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Counties = lazy(() => import('./pages/Counties'));
const Bills = lazy(() => import('./pages/Bills'));
const Statistics = lazy(() => import('./pages/Statistics'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#BB0000]"></div>
  </div>
);

// Wrap lazy components with Suspense and ErrorBoundary
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loading />}>
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: withSuspense(NotFound),
    children: [
      {
        path: "/",
        element: withSuspense(LandingPage),
      },
      {
        path: "/counties",
        element: withSuspense(Counties),
      },
      {
        path: "/bills",
        element: withSuspense(Bills),
      },
      {
        path: "/bills/national",
        element: withSuspense(Bills),
      },
      {
        path: "/statistics",
        element: withSuspense(Statistics),
      },
      {
        path: "*",
        element: withSuspense(NotFound),
      }
    ],
  },
];
