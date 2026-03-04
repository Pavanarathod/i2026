import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="h-screen bg-red-400">
      <Outlet />
    </div>
  );
}
