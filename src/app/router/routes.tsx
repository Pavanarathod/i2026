import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";
import { createHashRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import ProtectedRoute from "./ProtectedRoute";

export const router = createHashRouter([
  {
    path: "/",
    element: <LandingPage />,
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
