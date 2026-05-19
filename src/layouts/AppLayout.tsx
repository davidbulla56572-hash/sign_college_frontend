import { BarChart3, CalendarDays, FileText, LayoutDashboard, LogOut, Trophy, UploadCloud, UserRound, Users } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { useAuthStore } from "../features/auth/store/auth.store";
import { cn } from "../lib/utils/cn";

const aspiranteNavigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Mi postulación", to: "/mi-postulacion", icon: FileText },
  { label: "Resultados", to: "/resultados", icon: BarChart3 },
];

const adminNavigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Admin", to: "/admin", icon: Users },
];

export function AppLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const navItems = user?.rol === "ADMIN" ? adminNavigation : aspiranteNavigation;

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <header className="border-b border-border bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <img src="/logo_ucaldas.png" alt="Logo" className="h-12 w-12 object-contain" />
              <div>
                <p className="font-serif text-sm font-bold tracking-wide text-brand-primary">
                  Universidad de Caldas
                </p>
                <h1 className="text-base font-semibold text-ink">
                  {user?.rol === "ADMIN"
                    ? "Panel administrativo"
                    : "Gestión de aspirantes"}
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <nav aria-label="Principal" className="flex flex-wrap gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          "inline-flex min-h-10 items-center gap-2 rounded-brand-sm px-3 py-2 text-sm font-semibold transition",
                          isActive
                            ? "bg-brand-veryPale text-brand-primary"
                            : "text-ink-mid hover:bg-brand-veryPale"
                        )
                      }
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
              <div className="hidden items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-ink-mid sm:flex">
                <FileText className="h-4 w-4 text-brand-primary" aria-hidden="true" />
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
