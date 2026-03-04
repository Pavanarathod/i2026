import { Outlet } from "react-router-dom";
import { OtpDialog } from "@/features/auth/components/OtpDialog";

function PublicLayout() {
  return (
    <>
      <OtpDialog />
      <Outlet />
    </>
  );
}

export default PublicLayout;
