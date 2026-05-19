import { ClipboardList, FileText, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card, PageContainer } from "../../../components/ui";
import { Button } from "../../../components/ui/Button";
import { useAuthStore } from "../../auth/store/auth.store";
import { useConvocatoriaActivaQuery } from "../../convocatorias/hooks/convocatoriaActiva.hook";
import { useMyPostulacionesQuery } from "../../postulaciones/hooks/postulacion.hooks";
import { useAspirantesQuery, useAllPostulacionesQuery } from "../../admin/hooks/admin.hooks";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (user?.rol === "ADMIN") {
    return <AdminDashboard />;
  }

  return <AspiranteDashboard />;
}

function AspiranteDashboard() {
  const navigate = useNavigate();
  const { data: activaResp, isLoading: loadingActiva } = useConvocatoriaActivaQuery();
  const { data: postulaciones, isLoading: loadingPostulaciones } = useMyPostulacionesQuery();

  const isLoading = loadingActiva || loadingPostulaciones;
  const hasActiveConvocatoria = activaResp?.hay_convocatoria_activa ?? false;
  const hasPostulacion = postulaciones && postulaciones.length > 0;

  const estadoLabels: Record<string, string> = {
    BORRADOR: "Borrador",
    ENVIADA: "Enviada",
    EN_EVALUACION: "En evaluacion",
    EVALUADA: "Evaluada",
    RECHAZADA: "Rechazada",
  };

  const estadoColors: Record<string, string> = {
    BORRADOR: "bg-gray-100 text-gray-600",
    ENVIADA: "bg-blue-50 text-blue-700",
    EN_EVALUACION: "bg-amber-50 text-amber-700",
    EVALUADA: "bg-green-50 text-green-700",
    RECHAZADA: "bg-red-50 text-red-700",
  };

  return (
    <PageContainer>
      <Card>
        <p className="text-sm font-medium text-brand-700">ASPIRANTE</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          Hola, {useAuthStore.getState().user?.nombre ?? "usuario"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Estado de tu proceso docente y acciones disponibles.
        </p>
      </Card>

      {hasActiveConvocatoria && activaResp?.convocatoria && (
        <Card>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
                Convocatoria activa
              </p>
              <h3 className="mt-1 text-lg font-semibold text-ink">
                {activaResp.convocatoria.titulo}
              </h3>
              <div className="mt-2 flex gap-4 text-xs text-gray-500">
                <span>
                  Inicio:{" "}
                  {new Date(activaResp.convocatoria.fecha_inicio).toLocaleDateString("es-CO")}
                </span>
                <span>
                  Cierre:{" "}
                  {new Date(activaResp.convocatoria.fecha_cierre).toLocaleDateString("es-CO")}
                </span>
              </div>
            </div>
            {!hasPostulacion && (
              <Button type="button" variant="primary" onClick={() => navigate("/hoja-vida")}>
                Iniciar postulacion
              </Button>
            )}
          </div>
        </Card>
      )}

      {!hasActiveConvocatoria && !isLoading && (
        <Card>
          <p className="text-sm font-medium text-gray-500">
            {activaResp?.mensaje ?? "No hay convocatorias activas en este momento."}
          </p>
        </Card>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Hoja de vida",
            description: hasPostulacion
              ? `${postulaciones.length} postulacion(es)`
              : hasActiveConvocatoria
                ? "Sin archivo cargado"
                : "No hay convocatoria activa",
            icon: FileText,
            action: hasActiveConvocatoria ? "/hoja-vida" : undefined,
            actionLabel: hasActiveConvocatoria ? "Ir a hoja de vida" : undefined,
          },
          {
            title: "Postulaciones",
            description: hasPostulacion
              ? estadoLabels[postulaciones[0]?.estado] ?? "Sin postulacion"
              : hasActiveConvocatoria
                ? "Sin postulacion creada"
                : "No hay convocatoria activa",
            icon: ClipboardList,
            action: hasActiveConvocatoria && !hasPostulacion ? "/hoja-vida" : undefined,
            actionLabel: hasActiveConvocatoria && !hasPostulacion ? "Iniciar postulacion" : undefined,
          },
          {
            title: "Resultados",
            description: postulaciones?.some((p) => p.estado === "EVALUADA")
              ? "Resultados disponibles"
              : "Pendiente de evaluacion",
            icon: Trophy,
            action: postulaciones?.some((p) => p.estado === "EVALUADA") ? "/resultados" : undefined,
            actionLabel: postulaciones?.some((p) => p.estado === "EVALUADA") ? "Ver resultados" : undefined,
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-ink">{stat.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{stat.description}</p>
              {stat.action && (
                <Button
                  variant="ghost"
                  className="mt-3 h-auto px-0 py-0 text-sm text-brand-700 hover:text-brand-600"
                  onClick={() => navigate(stat.action!)}
                >
                  {stat.actionLabel} →
                </Button>
              )}
            </Card>
          );
        })}
      </section>

      {hasPostulacion && (
        <section>
          <h3 className="mb-3 text-lg font-semibold text-ink">Mis postulaciones</h3>
          <div className="rounded-lg border border-gray-200 bg-white shadow-soft">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Convocatoria</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Puntaje</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Envio</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {postulaciones!.map((p) => (
                  <tr key={p.id_postulacion} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-ink">{p.titulo_convocatoria ?? "Sin titulo"}</td>
                    <td className="px-5 py-3 text-sm">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoColors[p.estado] ?? "bg-gray-100 text-gray-600"}`}>
                        {estadoLabels[p.estado] ?? p.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">{p.puntaje_total != null ? p.puntaje_total.toFixed(2) : "—"}</td>
                    <td className="px-5 py-3 text-sm text-gray-500">{p.fecha_envio ? new Date(p.fecha_envio).toLocaleDateString("es-CO") : "—"}</td>
                    <td className="px-5 py-3 text-sm">
                      <Button variant="ghost" className="h-auto px-0 py-0 text-xs text-brand-700" onClick={() => navigate("/resultados")}>
                        Ver detalle
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </PageContainer>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const { data: aspirantes } = useAspirantesQuery();
  const { data: postulaciones } = useAllPostulacionesQuery();

  const estadoLabels: Record<string, string> = {
    BORRADOR: "Borrador",
    ENVIADA: "Enviada",
    EN_EVALUACION: "En evaluacion",
    EVALUADA: "Evaluada",
    RECHAZADA: "Rechazada",
  };

  const estadoColors: Record<string, string> = {
    BORRADOR: "bg-gray-100 text-gray-600",
    ENVIADA: "bg-blue-50 text-blue-700",
    EN_EVALUACION: "bg-amber-50 text-amber-700",
    EVALUADA: "bg-green-50 text-green-700",
    RECHAZADA: "bg-red-50 text-red-700",
  };

  return (
    <PageContainer>
      <Card>
        <p className="text-sm font-medium text-brand-700">ADMINISTRADOR</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">Panel de control</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Resumen del sistema de evaluacion de aspirantes docentes.
        </p>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
            <Users className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-ink">Aspirantes</h3>
          <p className="mt-2 text-3xl font-bold text-brand-700">{aspirantes?.length ?? "—"}</p>
          <Button
            variant="ghost"
            className="mt-3 h-auto px-0 py-0 text-sm text-brand-700 hover:text-brand-600"
            onClick={() => navigate("/admin")}
          >
            Ver listado →
          </Button>
        </Card>

        <Card>
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-ink">Postulaciones</h3>
          <p className="mt-2 text-3xl font-bold text-brand-700">{postulaciones?.length ?? "—"}</p>
          <Button
            variant="ghost"
            className="mt-3 h-auto px-0 py-0 text-sm text-brand-700 hover:text-brand-600"
            onClick={() => navigate("/admin")}
          >
            Ver listado →
          </Button>
        </Card>

        <Card>
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-ink">Ranking</h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">Consulta el ranking de postulaciones evaluadas</p>
          <Button
            variant="ghost"
            className="mt-3 h-auto px-0 py-0 text-sm text-brand-700 hover:text-brand-600"
            onClick={() => navigate("/admin")}
          >
            Ver ranking →
          </Button>
        </Card>
      </section>

      {postulaciones && postulaciones.length > 0 && (
        <section className="mt-6">
          <h3 className="mb-3 text-lg font-semibold text-ink">Ultimas postulaciones</h3>
          <div className="rounded-lg border border-gray-200 bg-white shadow-soft">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Convocatoria</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Estado</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Puntaje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {postulaciones.slice(0, 5).map((p) => (
                  <tr key={p.id_postulacion} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-medium text-ink">{p.titulo_convocatoria ?? "Sin titulo"}</td>
                    <td className="px-5 py-3 text-sm">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${estadoColors[p.estado] ?? "bg-gray-100 text-gray-600"}`}>
                        {estadoLabels[p.estado] ?? p.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-700">{p.puntaje_total != null ? p.puntaje_total.toFixed(2) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </PageContainer>
  );
}
