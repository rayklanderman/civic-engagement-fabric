import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { Loading } from '@/components/Loading';
import { Layout } from "@/components/Layout";

// Lazy load components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Counties = lazy(() => import('./pages/Counties'));
const Bills = lazy(() => import('./pages/Bills'));
const Statistics = lazy(() => import('./pages/Statistics'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Define routes with proper configuration
export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "counties",
        element: <Counties />,
      },
      {
        path: "bills",
        children: [
          {
            index: true,
            element: <Bills />,
          },
          {
            path: "national",
            element: <Bills />,
          }
        ]
      },
      {
        path: "statistics",
        element: <Statistics />,
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ],
  },
];
