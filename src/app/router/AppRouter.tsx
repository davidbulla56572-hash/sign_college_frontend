import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { AdminPage } from "../../features/admin/pages/AdminPage";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { SignUpPage } from "../../features/auth/pages/SignUpPage";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";
import { MiPostulacionPage } from "../../features/postulaciones/pages/MiPostulacionPage";
import { ResultsPage } from "../../features/results/pages/ResultsPage";
import { AppLayout } from "../../layouts/AppLayout";
import { PublicLayout } from "../../layouts/PublicLayout";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<SignUpPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mi-postulacion" element={<MiPostulacionPage />} />
          <Route path="/resultados" element={<ResultsPage />} />
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
