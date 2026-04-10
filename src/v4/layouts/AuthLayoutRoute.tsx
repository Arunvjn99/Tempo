import { Outlet } from "react-router-dom";
import { AuthLayout } from "@/ui/auth/AuthLayout";

export function AuthLayoutRoute() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
