import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="h-screen bg-green-300">
      <h2>Dashboard Layout</h2>
      <Outlet />
    </div>
  );
}
