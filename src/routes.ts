import { RouteObject } from 'react-router-dom';
import Index from "./pages/Index";
import Counties from "./pages/Counties";
import Bills from "./pages/Bills";
import Statistics from "./pages/Statistics";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/counties",
    element: <Counties />,
  },
  {
    path: "/bills",
    element: <Bills />,
  },
  {
    path: "/statistics",
    element: <Statistics />,
  }
];
