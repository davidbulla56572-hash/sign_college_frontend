import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/auth.store";

export function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (isAuthenticated) {
    return <Navigate to={user?.rol === "ADMIN" ? "/admin" : "/dashboard"} replace />;
  }

  return <Outlet />;
}
