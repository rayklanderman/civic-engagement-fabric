import { createBrowserRouter, RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loading } from '@/components/Loading';
import { Layout } from "@/components/Layout";
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Lazy load components
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Counties = lazy(() => import('./pages/Counties').then(m => ({ default: m.Counties })));
const Bills = lazy(() => import('./pages/Bills').then(m => ({ default: m.Bills })));
const Statistics = lazy(() => import('./pages/Statistics').then(m => ({ default: m.Statistics })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Wrap components with Suspense
const withSuspense = (Component: React.ComponentType) => (props: any) => (
  <Suspense fallback={<Loading />}>
    <Component {...props} />
  </Suspense>
);

// Define routes
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: withSuspense(LandingPage)({})
      },
      {
        path: "counties",
        element: withSuspense(Counties)({})
      },
      {
        path: "bills",
        children: [
          {
            index: true,
            element: withSuspense(Bills)({})
          },
          {
            path: ":countyId",
            element: withSuspense(Bills)({})
          }
        ]
      },
      {
        path: "statistics",
        element: withSuspense(Statistics)({})
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
];

export const router = createBrowserRouter(routes);
