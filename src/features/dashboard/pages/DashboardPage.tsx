import { ClipboardList, FileText, Trophy } from "lucide-react";

import { Card, PageContainer } from "../../../components/ui";
import { useAuthStore } from "../../auth/store/auth.store";

const nextModules = [
  {
    title: "Hoja de vida",
    description: "Sin archivo cargado",
    icon: FileText
  },
  {
    title: "Postulaciones",
    description: "Sin postulacion enviada",
    icon: ClipboardList
  },
  {
    title: "Resultados",
    description: "Pendiente de evaluacion",
    icon: Trophy
  }
];

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <PageContainer>
      <Card>
        <p className="text-sm font-medium text-brand-700">{user?.rol ?? "ASPIRANTE"}</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          Hola, {user?.nombre ?? "usuario"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Estado inicial de tu proceso docente.
        </p>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {nextModules.map((module) => {
          const Icon = module.icon;

          return (
            <Card key={module.title}>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-ink">{module.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{module.description}</p>
            </Card>
          );
        })}
      </section>
    </PageContainer>
  );
}
