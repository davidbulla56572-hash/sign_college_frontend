import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/auth.store";
import type { UserRole } from "../../features/auth/types/auth.types";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!accessToken || !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.rol))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
