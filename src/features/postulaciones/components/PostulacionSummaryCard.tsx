import { Button, Card } from "../../../components/ui";
import { useApplyMutation, usePostulacionSummaryQuery } from "../hooks/postulacion.hooks";

type PostulacionSummaryCardProps = {
  postulacionId: number;
  onBack: () => void;
  onApplied: () => void;
};

const labels: Record<string, string> = {
  BORRADOR: "Borrador",
  ENVIADA: "Enviada",
  EN_EVALUACION: "En evaluacion",
  EVALUADA: "Evaluada",
  RECHAZADA: "Rechazada",
};

export function PostulacionSummaryCard({
  postulacionId,
  onBack,
  onApplied,
}: PostulacionSummaryCardProps) {
  const { data, isLoading } = usePostulacionSummaryQuery(postulacionId);
  const applyMutation = useApplyMutation(postulacionId);

  if (isLoading || !data) {
    return (
      <Card className="mt-4">
        <p className="text-sm text-gray-500">Cargando resumen de postulacion...</p>
      </Card>
    );
  }

  const sections = [
    { key: "formacion", label: "Formacion", value: data.resumen_items.formacion },
    { key: "experiencia", label: "Experiencia", value: data.resumen_items.experiencia },
    { key: "produccion", label: "Produccion", value: data.resumen_items.produccion },
    { key: "ponencia", label: "Ponencias", value: data.resumen_items.ponencia },
    { key: "investigacion", label: "Investigacion", value: data.resumen_items.investigacion },
  ];

  return (
    <Card className="mt-4 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
          Resumen previo al envio
        </p>
        <h3 className="mt-1 text-lg font-semibold text-ink">Revisa tu postulacion</h3>
        <p className="mt-2 text-sm text-gray-600">
          Esta es la revision final antes de enviar formalmente tu postulacion.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-brand-sm border border-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Convocatoria
          </p>
          <p className="mt-2 text-base font-semibold text-ink">{data.convocatoria.titulo}</p>
          <p className="mt-3 text-sm text-gray-600">
            Estado actual: <span className="font-medium text-ink">{labels[data.estado] ?? data.estado}</span>
          </p>
        </div>

        <div className="rounded-brand-sm border border-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Datos personales
          </p>
          <p className="mt-2 text-base font-semibold text-ink">
            {data.datos_personales.nombre} {data.datos_personales.apellido}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {data.datos_personales.email ?? "Sin correo registrado"}
          </p>
        </div>
      </div>

      <div className="rounded-brand-sm border border-border p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Resumen de hoja de vida
          </p>
          <span className="text-sm font-medium text-gray-600">{data.total_items} items</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {sections.map((section) => (
            <div key={section.key} className="rounded-md bg-cream/70 px-3 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {section.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-brand-700">{section.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-brand-sm border border-border p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Validacion final
        </p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li>CV cargado: {data.tiene_cv_cargado ? "Si" : "No"}</li>
          <li>Items registrados: {data.total_items > 0 ? "Si" : "No"}</li>
          <li>Lista para aplicar: {data.lista_para_aplicar ? "Si" : "No"}</li>
        </ul>
        {!data.lista_para_aplicar ? (
          <p className="mt-3 text-sm text-amber-700">
            Debes completar tu hoja de vida y guardar los cambios antes de enviar.
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onBack}>
          Volver a editar
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={!data.lista_para_aplicar || applyMutation.isPending}
          onClick={() => applyMutation.mutate(undefined, { onSuccess: () => onApplied() })}
        >
          {applyMutation.isPending ? "Enviando..." : "Enviar postulacion"}
        </Button>
      </div>
    </Card>
  );
}
