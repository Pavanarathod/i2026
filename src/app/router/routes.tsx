import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";
import { createHashRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

export const router = createHashRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/",
            element: <LandingPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/students",
            element: <>Students</>,
          },
          {
            path: "/applications",
            element: <>applications</>,
          },
          {
            path: "/universities",
            element: <>universities</>,
          },
        ],
      },
    ],
  },
]);
