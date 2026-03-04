import { useAuthStore } from "@/features/auth/store";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { token, user } = useAuthStore();

  if (token || user?.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
