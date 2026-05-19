import { BarChart3, FileText, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { useAuthStore } from "../features/auth/store/auth.store";
import { cn } from "../lib/utils/cn";

const navigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Perfil", to: "/perfil", icon: UserRound },
  { label: "Resultados", to: "/resultados", icon: BarChart3 }
];

export function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                Sign College
              </p>
              <h1 className="text-lg font-semibold text-ink">Gestion de aspirantes</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <nav aria-label="Principal" className="flex flex-wrap gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition",
                          isActive
                            ? "bg-brand-50 text-brand-700"
                            : "text-gray-700 hover:bg-gray-100"
                        )
                      }
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
              <div className="hidden items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 sm:flex">
                <FileText className="h-4 w-4 text-brand-700" aria-hidden="true" />
                <span>{user ? `${user.nombre} ${user.apellido}` : "Usuario"}</span>
              </div>
              <Button type="button" variant="secondary" onClick={handleLogout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
