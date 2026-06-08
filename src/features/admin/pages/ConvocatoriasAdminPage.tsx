import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Input } from "../../../components/ui/Input";
import {
  useActivateConvocatoriaMutation,
  useAllConvocatoriasQuery,
  useCloseConvocatoriaMutation,
  useCreateConvocatoriaMutation,
  useCreateReglaMutation,
  useDeleteReglaMutation,
  useReglasConvocatoriaQuery,
  useUpdateConvocatoriaMutation,
  useUpdateReglaMutation,
} from "../../convocatorias/hooks/convocatoria.hooks";
import type {
  ConvocatoriaDetail,
  ConvocatoriaEstado,
} from "../../convocatorias/types/convocatoria.types";
import type {
  ReglaEvaluacion,
  ReglaEvaluacionPayload,
  TipoItemHojaVida,
} from "../../convocatorias/types/reglaEvaluacion.types";

const estadoStyles: Record<ConvocatoriaEstado, string> = {
  BORRADOR: "bg-amber-50 text-amber-700",
  ACTIVA: "bg-green-50 text-green-700",
  CERRADA: "bg-slate-100 text-slate-600",
};

const estadoLabels: Record<ConvocatoriaEstado, string> = {
  BORRADOR: "Borrador",
  ACTIVA: "Activa",
  CERRADA: "Cerrada",
};

const tipoItemOptions: TipoItemHojaVida[] = [
  "FORMACION",
  "EXPERIENCIA",
  "PRODUCCION",
  "DOCUMENTO",
  "OTRO",
  "PONENCIA",
  "INVESTIGACION",
];

const convocatoriaSchema = Yup.object({
  titulo: Yup.string()
    .min(3, "Minimo 3 caracteres")
    .max(180, "Maximo 180 caracteres")
    .required("El titulo es obligatorio"),
  descripcion: Yup.string().nullable(),
  fecha_inicio: Yup.string().required("La fecha de inicio es obligatoria"),
  fecha_cierre: Yup.string()
    .required("La fecha de cierre es obligatoria")
    .test(
      "fecha_cierre_mayor",
      "La fecha de cierre debe ser posterior o igual a la de inicio",
      function (value) {
        const { fecha_inicio } = this.parent;
        if (!value || !fecha_inicio) {
          return true;
        }
        return new Date(value) >= new Date(fecha_inicio);
      },
    ),
});

const reglaSchema = Yup.object({
  tipo_item: Yup.string().required("El tipo de item es obligatorio"),
  descripcion_regla: Yup.string()
    .min(3, "Minimo 3 caracteres")
    .max(2000, "Maximo 2000 caracteres")
    .required("La descripcion es obligatoria"),
  puntaje_unitario: Yup.number()
    .min(0, "No puede ser negativo")
    .required("El puntaje unitario es obligatorio"),
  maximo_acumulable: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" || Number.isNaN(value) ? null : value,
    )
    .min(0, "No puede ser negativo"),
  unidad: Yup.string()
    .min(1, "La unidad es obligatoria")
    .max(80, "Maximo 80 caracteres")
    .required("La unidad es obligatoria"),
});

function toDateTimeLocal(value: string) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const normalized = new Date(date.getTime() - offset * 60_000);
  return normalized.toISOString().slice(0, 16);
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function EstadoBadge({ estado }: { estado: ConvocatoriaEstado }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estadoStyles[estado]}`}>
      {estadoLabels[estado]}
    </span>
  );
}

function ReglaForm({
  convocatoriaId,
  editingRule,
  onCancelEdit,
}: {
  convocatoriaId: number;
  editingRule: ReglaEvaluacion | null;
  onCancelEdit: () => void;
}) {
  const createRuleMutation = useCreateReglaMutation();
  const updateRuleMutation = useUpdateReglaMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      tipo_item: editingRule?.tipo_item ?? "FORMACION",
      descripcion_regla: editingRule?.descripcion_regla ?? "",
      puntaje_unitario: editingRule?.puntaje_unitario?.toString() ?? "",
      maximo_acumulable:
        editingRule?.maximo_acumulable != null
          ? editingRule.maximo_acumulable.toString()
          : "",
      unidad: editingRule?.unidad ?? "",
    },
    validationSchema: reglaSchema,
    onSubmit: (values, helpers) => {
      const payload: ReglaEvaluacionPayload = {
        tipo_item: values.tipo_item as TipoItemHojaVida,
        descripcion_regla: values.descripcion_regla,
        puntaje_unitario: Number(values.puntaje_unitario),
        maximo_acumulable:
          values.maximo_acumulable === "" ? null : Number(values.maximo_acumulable),
        unidad: values.unidad,
      };

      if (editingRule) {
        updateRuleMutation.mutate(
          {
            reglaId: editingRule.id_regla,
            convocatoriaId,
            payload,
          },
          {
            onSuccess: () => {
              onCancelEdit();
              helpers.resetForm();
            },
          },
        );
        return;
      }

      createRuleMutation.mutate(
        {
          convocatoriaId,
          payload,
        },
        {
          onSuccess: () => {
            helpers.resetForm();
          },
        },
      );
    },
  });

  const isSubmitting = createRuleMutation.isPending || updateRuleMutation.isPending;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-semibold text-ink">
            {editingRule ? "Editar regla" : "Nueva regla"}
          </h4>
          <p className="text-sm text-gray-500">
            Define el criterio que aplicara el motor de evaluacion para esta convocatoria.
          </p>
        </div>
        {editingRule ? (
          <Button variant="secondary" className="px-4 py-2" onClick={onCancelEdit}>
            Cancelar edicion
          </Button>
        ) : null}
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="tipo_item" className="block text-sm font-semibold text-ink-mid">
              Tipo de item
            </label>
            <select
              id="tipo_item"
              name="tipo_item"
              value={formik.values.tipo_item}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-12 w-full rounded-brand-sm border-[1.5px] border-border bg-white px-4 text-base text-ink outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-pale"
            >
              {tipoItemOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {formik.touched.tipo_item && formik.errors.tipo_item ? (
              <p className="text-sm text-red-600">{String(formik.errors.tipo_item)}</p>
            ) : null}
          </div>
          <Input
            label="Unidad"
            name="unidad"
            value={formik.values.unidad}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.unidad && formik.errors.unidad
                ? String(formik.errors.unidad)
                : undefined
            }
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="descripcion_regla"
            className="block text-sm font-semibold text-ink-mid"
          >
            Descripcion de la regla
          </label>
          <textarea
            id="descripcion_regla"
            name="descripcion_regla"
            value={formik.values.descripcion_regla}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            rows={4}
            className="w-full rounded-brand-sm border-[1.5px] border-border bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-pale"
          />
          {formik.touched.descripcion_regla && formik.errors.descripcion_regla ? (
            <p className="text-sm text-red-600">{String(formik.errors.descripcion_regla)}</p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Puntaje unitario"
            name="puntaje_unitario"
            type="number"
            step="0.01"
            min="0"
            value={formik.values.puntaje_unitario}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.puntaje_unitario && formik.errors.puntaje_unitario
                ? String(formik.errors.puntaje_unitario)
                : undefined
            }
          />
          <Input
            label="Maximo acumulable"
            name="maximo_acumulable"
            type="number"
            step="0.01"
            min="0"
            value={formik.values.maximo_acumulable}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.maximo_acumulable && formik.errors.maximo_acumulable
                ? String(formik.errors.maximo_acumulable)
                : undefined
            }
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" className="px-5 py-3" disabled={isSubmitting}>
            {isSubmitting
              ? "Guardando..."
              : editingRule
                ? "Actualizar regla"
                : "Agregar regla"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function ReglasSection({
  convocatoria,
}: {
  convocatoria: ConvocatoriaDetail;
}) {
  const { data: reglas, isLoading, error } = useReglasConvocatoriaQuery(
    convocatoria.id_convocatoria,
  );
  const deleteRuleMutation = useDeleteReglaMutation();
  const [editingRule, setEditingRule] = useState<ReglaEvaluacion | null>(null);

  useEffect(() => {
    setEditingRule(null);
  }, [convocatoria.id_convocatoria]);

  return (
    <div className="space-y-4">
      <ReglaForm
        convocatoriaId={convocatoria.id_convocatoria}
        editingRule={editingRule}
        onCancelEdit={() => setEditingRule(null)}
      />

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-semibold text-ink">Reglas configuradas</h4>
            <p className="text-sm text-gray-500">
              Cada regla queda asociada solo a esta convocatoria.
            </p>
          </div>
          <span className="text-sm font-medium text-gray-500">
            {reglas?.length ?? 0} reglas
          </span>
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">Cargando reglas...</p>
        ) : null}

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            No se pudieron cargar las reglas de esta convocatoria.
          </div>
        ) : null}

        {!isLoading && !error && (!reglas || reglas.length === 0) ? (
          <EmptyState
            title="Sin reglas aun"
            description="Agrega al menos una regla antes de activar la convocatoria."
          />
        ) : null}

        {reglas && reglas.length > 0 ? (
          <div className="overflow-hidden rounded-brand-sm border border-border">
            <table className="w-full">
              <thead className="bg-cream/70">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Regla
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Puntaje
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Maximo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Unidad
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reglas.map((regla) => (
                  <tr key={regla.id_regla} className="align-top">
                    <td className="px-4 py-3 text-sm font-semibold text-ink">{regla.tipo_item}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{regla.descripcion_regla}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{regla.puntaje_unitario}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {regla.maximo_acumulable ?? "Sin tope"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{regla.unidad}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          className="px-4 py-2"
                          onClick={() => setEditingRule(regla)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          className="px-4 py-2 text-red-700 hover:bg-red-50"
                          onClick={() =>
                            deleteRuleMutation.mutate({
                              reglaId: regla.id_regla,
                              convocatoriaId: convocatoria.id_convocatoria,
                            })
                          }
                          disabled={deleteRuleMutation.isPending}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Card>
    </div>
  );
}

export function ConvocatoriasAdminPage() {
  const { data: convocatorias, isLoading, error } = useAllConvocatoriasQuery();
  const createMutation = useCreateConvocatoriaMutation();
  const updateMutation = useUpdateConvocatoriaMutation();
  const activateMutation = useActivateConvocatoriaMutation();
  const closeMutation = useCloseConvocatoriaMutation();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const selectedConvocatoria = useMemo(
    () => {
      if (isCreatingNew) {
        return null;
      }

      if (selectedId != null) {
        return (
          convocatorias?.find(
            (convocatoria) => convocatoria.id_convocatoria === selectedId,
          ) ?? null
        );
      }

      return convocatorias?.[0] ?? null;
    },
    [convocatorias, isCreatingNew, selectedId],
  );

  useEffect(() => {
    if (!isCreatingNew && selectedConvocatoria && selectedId == null) {
      setSelectedId(selectedConvocatoria.id_convocatoria);
    }
  }, [isCreatingNew, selectedConvocatoria, selectedId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      titulo: selectedConvocatoria?.titulo ?? "",
      descripcion: selectedConvocatoria?.descripcion ?? "",
      fecha_inicio: selectedConvocatoria ? toDateTimeLocal(selectedConvocatoria.fecha_inicio) : "",
      fecha_cierre: selectedConvocatoria ? toDateTimeLocal(selectedConvocatoria.fecha_cierre) : "",
    },
    validationSchema: convocatoriaSchema,
    onSubmit: (values, helpers) => {
      const payload = {
        titulo: values.titulo,
        descripcion: values.descripcion || null,
        fecha_inicio: new Date(values.fecha_inicio).toISOString(),
        fecha_cierre: new Date(values.fecha_cierre).toISOString(),
      };

      if (selectedConvocatoria) {
        updateMutation.mutate(
          {
            id: selectedConvocatoria.id_convocatoria,
            payload,
          },
          {
            onSuccess: () => {
              helpers.resetForm({ values });
            },
          },
        );
        return;
      }

      createMutation.mutate(payload, {
        onSuccess: (created) => {
          setIsCreatingNew(false);
          setSelectedId(created.id_convocatoria);
        },
      });
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Cargando convocatorias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        No se pudo cargar la configuracion de convocatorias.
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-ink">Convocatorias</h3>
            <p className="text-sm text-gray-500">
              Administra el ciclo de vida y selecciona una para editarla.
            </p>
          </div>
          <Button
            variant="secondary"
            className="px-4 py-2"
            onClick={() => {
              setIsCreatingNew(true);
              setSelectedId(null);
              formik.resetForm({
                values: {
                  titulo: "",
                  descripcion: "",
                  fecha_inicio: "",
                  fecha_cierre: "",
                },
              });
            }}
          >
            Nueva
          </Button>
        </div>

        {!convocatorias || convocatorias.length === 0 ? (
          <EmptyState
            title="No hay convocatorias"
            description="Crea la primera convocatoria para habilitar postulaciones reales."
          />
        ) : (
          <div className="space-y-3">
            {convocatorias.map((convocatoria) => (
              <button
                key={convocatoria.id_convocatoria}
                type="button"
                className={`w-full rounded-brand-sm border p-4 text-left transition ${
                  !isCreatingNew &&
                  selectedConvocatoria?.id_convocatoria === convocatoria.id_convocatoria
                    ? "border-brand-primary bg-brand-veryPale"
                    : "border-border hover:border-brand-primary/40"
                }`}
                onClick={() => {
                  setIsCreatingNew(false);
                  setSelectedId(convocatoria.id_convocatoria);
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{convocatoria.titulo}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(convocatoria.fecha_inicio)} - {formatDate(convocatoria.fecha_cierre)}
                    </p>
                  </div>
                  <EstadoBadge estado={convocatoria.estado} />
                </div>
              </button>
            ))}
          </div>
        )}
      </Card>

      <div className="space-y-5">
        <Card className="space-y-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-ink">
                  {selectedConvocatoria ? "Detalle de convocatoria" : "Crear convocatoria"}
                </h3>
                {selectedConvocatoria ? (
                  <EstadoBadge estado={selectedConvocatoria.estado} />
                ) : null}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Define los datos base, luego configura las reglas y activa solo cuando este lista.
              </p>
            </div>

            {selectedConvocatoria ? (
              <div className="flex gap-3">
                <Button
                  className="px-4 py-2"
                  onClick={() => activateMutation.mutate(selectedConvocatoria.id_convocatoria)}
                  disabled={
                    activateMutation.isPending || selectedConvocatoria.estado === "CERRADA"
                  }
                >
                  Activar
                </Button>
                <Button
                  variant="secondary"
                  className="px-4 py-2"
                  onClick={() => closeMutation.mutate(selectedConvocatoria.id_convocatoria)}
                  disabled={closeMutation.isPending || selectedConvocatoria.estado === "CERRADA"}
                >
                  Cerrar
                </Button>
              </div>
            ) : null}
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <Input
              label="Titulo"
              name="titulo"
              value={formik.values.titulo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.titulo && formik.errors.titulo
                  ? String(formik.errors.titulo)
                  : undefined
              }
            />

            <div className="space-y-1.5">
              <label htmlFor="descripcion" className="block text-sm font-semibold text-ink-mid">
                Descripcion
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                rows={4}
                className="w-full rounded-brand-sm border-[1.5px] border-border bg-white px-4 py-3 text-base text-ink outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-pale"
              />
              {formik.touched.descripcion && formik.errors.descripcion ? (
                <p className="text-sm text-red-600">{String(formik.errors.descripcion)}</p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Fecha inicio"
                name="fecha_inicio"
                type="datetime-local"
                value={formik.values.fecha_inicio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.fecha_inicio && formik.errors.fecha_inicio
                    ? String(formik.errors.fecha_inicio)
                    : undefined
                }
              />
              <Input
                label="Fecha cierre"
                name="fecha_cierre"
                type="datetime-local"
                value={formik.values.fecha_cierre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.fecha_cierre && formik.errors.fecha_cierre
                    ? String(formik.errors.fecha_cierre)
                    : undefined
                }
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="px-5 py-3" disabled={isSaving}>
                {isSaving
                  ? "Guardando..."
                  : selectedConvocatoria
                    ? "Actualizar convocatoria"
                    : "Crear convocatoria"}
              </Button>
            </div>
          </form>
        </Card>

        {selectedConvocatoria ? <ReglasSection convocatoria={selectedConvocatoria} /> : null}
      </div>
    </div>
  );
}
