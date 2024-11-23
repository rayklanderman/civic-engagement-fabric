import { RouteObject } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loading } from '@/components/Loading';
import { Layout } from "@/components/Layout";

// Lazy load components
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const Counties = lazy(() => import('./pages/Counties').then(m => ({ default: m.Counties })));
const Bills = lazy(() => import('./pages/Bills').then(m => ({ default: m.Bills })));
const Statistics = lazy(() => import('./pages/Statistics').then(m => ({ default: m.Statistics })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Wrap components with Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

// Define routes with proper configuration
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: withSuspense(NotFound),
    children: [
      {
        index: true,
        element: withSuspense(LandingPage),
      },
      {
        path: "counties",
        element: withSuspense(Counties),
      },
      {
        path: "bills",
        children: [
          {
            index: true,
            element: withSuspense(Bills),
          },
          {
            path: "national",
            element: withSuspense(Bills),
          }
        ]
      },
      {
        path: "statistics",
        element: withSuspense(Statistics),
      },
      {
        path: "*",
        element: withSuspense(NotFound),
      }
    ],
  },
];
