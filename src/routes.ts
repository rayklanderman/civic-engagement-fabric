import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load components
const Index = lazy(() => import('./pages/Index'));
const Counties = lazy(() => import('./pages/Counties'));
const Bills = lazy(() => import('./pages/Bills'));
const Statistics = lazy(() => import('./pages/Statistics'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <ErrorBoundary><Index /></ErrorBoundary>,
    errorElement: <NotFound />,
  },
  {
    path: "/counties",
    element: <ErrorBoundary><Counties /></ErrorBoundary>,
    errorElement: <NotFound />,
  },
  {
    path: "/bills",
    element: <ErrorBoundary><Bills /></ErrorBoundary>,
    errorElement: <NotFound />,
  },
  {
    path: "/statistics",
    element: <ErrorBoundary><Statistics /></ErrorBoundary>,
    errorElement: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />
  }
];
