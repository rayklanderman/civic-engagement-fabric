import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load components
const Index = lazy(() => import('./pages/Index'));
const Counties = lazy(() => import('./pages/Counties'));
const Bills = lazy(() => import('./pages/Bills'));
const Statistics = lazy(() => import('./pages/Statistics'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Wrap lazy components with Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<div>Loading...</div>}>
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  </Suspense>
);

export const routes: RouteObject[] = [
  {
    path: "/",
    element: withSuspense(Index),
    errorElement: withSuspense(NotFound),
  },
  {
    path: "/counties",
    element: withSuspense(Counties),
    errorElement: withSuspense(NotFound),
  },
  {
    path: "/bills",
    element: withSuspense(Bills),
    errorElement: withSuspense(NotFound),
  },
  {
    path: "/statistics",
    element: withSuspense(Statistics),
    errorElement: withSuspense(NotFound),
  },
  {
    path: '*',
    element: withSuspense(NotFound)
  }
];
