import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Card, EmptyState } from "../../../components/ui";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  useAllConvocatoriasQuery,
  useCreateConvocatoriaMutation,
  useToggleConvocatoriaMutation,
} from "../../convocatorias/hooks/convocatoria.hooks";

const convocatoriaSchema = Yup.object({
  titulo: Yup.string()
    .min(3, "Minimo 3 caracteres")
    .max(180, "Maximo 180 caracteres")
    .required("El titulo es obligatorio"),
  descripcion: Yup.string().nullable(),
  fecha_inicio: Yup.string().required("La fecha de inicio es obligatoria"),
  fecha_cierre: Yup.string().required("La fecha de cierre es obligatoria"),
});

export function ConvocatoriasAdminPage() {
  const { data: convocatorias, isLoading, error } = useAllConvocatoriasQuery();
  const createMutation = useCreateConvocatoriaMutation();
  const toggleMutation = useToggleConvocatoriaMutation();
  const [showForm, setShowForm] = useState(false);

  const formik = useFormik({
    initialValues: {
      titulo: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_cierre: "",
    },
    validationSchema: convocatoriaSchema,
    onSubmit: (values) => {
      createMutation.mutate(
        {
          titulo: values.titulo,
          descripcion: values.descripcion || null,
          fecha_inicio: new Date(values.fecha_inicio).toISOString(),
          fecha_cierre: new Date(values.fecha_cierre).toISOString(),
        },
        {
          onSuccess: () => {
            setShowForm(false);
            formik.resetForm();
          },
        }
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Cargando convocatorias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-semibold text-ink">Convocatorias</h3>
          <Button
            variant="primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancelar" : "Nueva convocatoria"}
          </Button>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          No se pudieron cargar las convocatorias. Verifica que estés autenticado como admin.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-ink">
          Convocatorias ({convocatorias?.length ?? 0})
        </h3>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancelar" : "Nueva convocatoria"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <h3 className="text-base font-semibold text-ink">
            Nueva convocatoria
          </h3>
          <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
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
            <Input
              label="Descripcion"
              name="descripcion"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.descripcion && formik.errors.descripcion
                  ? String(formik.errors.descripcion)
                  : undefined
              }
            />
            <div className="grid grid-cols-2 gap-4">
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
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="rounded-lg border border-gray-200 bg-white shadow-soft">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Titulo
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Estado
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Inicio
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Cierre
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {convocatorias?.map((c) => (
              <tr key={c.id_convocatoria} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-medium text-ink">
                  {c.titulo}
                </td>
                <td className="px-5 py-3 text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.activa
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {c.activa ? "Activa" : "Cerrada"}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">
                  {new Date(c.fecha_inicio).toLocaleDateString("es-CO")}
                </td>
                <td className="px-5 py-3 text-sm text-gray-500">
                  {new Date(c.fecha_cierre).toLocaleDateString("es-CO")}
                </td>
                <td className="px-5 py-3 text-sm">
                  <button
                    type="button"
                    className="text-brand-700 hover:text-brand-600 font-medium"
                    onClick={() => toggleMutation.mutate(c.id_convocatoria)}
                  >
                    {c.activa ? "Cerrar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
