import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { Button, Card } from "../../../components/ui";
import {
  useApplyMutation,
  useHojaVidaDraftQuery,
  useSaveDraftMutation,
} from "../hooks/postulacion.hooks";
import { PersonalInfoSection } from "../../hoja-vida/components/PersonalInfoSection";
import { DynamicItemsSection } from "../../hoja-vida/components/DynamicItemsSection";
import type { HojaVidaSavePayload } from "../../hoja-vida/types/hojaVida.types";

const hojaVidaSchema = Yup.object({
  datos_personales: Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido es obligatorio"),
    email: Yup.string().email("Correo invalido").nullable(),
    telefono: Yup.string().nullable(),
    municipio: Yup.string().nullable(),
    departamento: Yup.string().nullable(),
    pais: Yup.string().required("El pais es obligatorio"),
  }),
  items: Yup.object({
    formacion: Yup.array().of(
      Yup.object({
        descripcion: Yup.string()
          .max(2000, "Maximo 2000 caracteres")
          .required("La descripcion es obligatoria"),
        institucion: Yup.string().nullable(),
        fecha_inicio: Yup.string().nullable(),
        fecha_fin: Yup.string().nullable(),
        cantidad: Yup.number()
          .nullable()
          .min(0, "Debe ser mayor o igual a cero")
          .transform((v, o) => (o === "" ? null : v)),
      })
    ),
    experiencia: Yup.array().of(
      Yup.object({
        descripcion: Yup.string()
          .max(2000, "Maximo 2000 caracteres")
          .required("La descripcion es obligatoria"),
        institucion: Yup.string().nullable(),
        fecha_inicio: Yup.string().nullable(),
        fecha_fin: Yup.string().nullable(),
        cantidad: Yup.number()
          .nullable()
          .min(0, "Debe ser mayor o igual a cero")
          .transform((v, o) => (o === "" ? null : v)),
      })
    ),
    produccion: Yup.array().of(
      Yup.object({
        descripcion: Yup.string()
          .max(2000, "Maximo 2000 caracteres")
          .required("La descripcion es obligatoria"),
        institucion: Yup.string().nullable(),
        fecha_inicio: Yup.string().nullable(),
        fecha_fin: Yup.string().nullable(),
        cantidad: Yup.number()
          .nullable()
          .min(0, "Debe ser mayor o igual a cero")
          .transform((v, o) => (o === "" ? null : v)),
      })
    ),
    ponencia: Yup.array().of(
      Yup.object({
        descripcion: Yup.string()
          .max(2000, "Maximo 2000 caracteres")
          .required("La descripcion es obligatoria"),
        institucion: Yup.string().nullable(),
        fecha_inicio: Yup.string().nullable(),
        fecha_fin: Yup.string().nullable(),
        cantidad: Yup.number()
          .nullable()
          .min(0, "Debe ser mayor o igual a cero")
          .transform((v, o) => (o === "" ? null : v)),
      })
    ),
    investigacion: Yup.array().of(
      Yup.object({
        descripcion: Yup.string()
          .max(2000, "Maximo 2000 caracteres")
          .required("La descripcion es obligatoria"),
        institucion: Yup.string().nullable(),
        fecha_inicio: Yup.string().nullable(),
        fecha_fin: Yup.string().nullable(),
        cantidad: Yup.number()
          .nullable()
          .min(0, "Debe ser mayor o igual a cero")
          .transform((v, o) => (o === "" ? null : v)),
      })
    ),
  }),
});

const sections = [
  { sectionKey: "formacion" as const, title: "Formacion", description: "Titulos, cursos o estudios relevantes." },
  { sectionKey: "experiencia" as const, title: "Experiencia", description: "Experiencia docente, profesional o investigativa." },
  { sectionKey: "produccion" as const, title: "Produccion", description: "Publicaciones, libros, articulos o material academico." },
  { sectionKey: "ponencia" as const, title: "Ponencias", description: "Participaciones en eventos academicos o conferencias." },
  { sectionKey: "investigacion" as const, title: "Investigacion", description: "Proyectos, grupos o productos de investigacion." },
];

type EditPostulacionStepProps = {
  postulacionId: number;
  onApplied: () => void;
};

export function EditPostulacionStep({
  postulacionId,
  onApplied,
}: EditPostulacionStepProps) {
  const { data: draftData } = useHojaVidaDraftQuery(postulacionId);
  const saveMutation = useSaveDraftMutation(postulacionId);
  const applyMutation = useApplyMutation(postulacionId);
  const [draftSaved, setDraftSaved] = useState(false);

  if (!draftData) {
    return (
      <Card className="mt-4">
        <p className="text-sm text-gray-500">Cargando datos...</p>
      </Card>
    );
  }

  const initialValues: HojaVidaSavePayload = {
    documento: draftData.url_cv_original
      ? {
          nombre_archivo: draftData.url_cv_original.split("/").pop() ?? "cv",
          tipo_archivo: "application/pdf",
          tamanio_bytes: 0,
          url_archivo: draftData.url_cv_original,
        }
      : null,
    datos_personales: draftData.datos_personales,
    items: {
      formacion: draftData.items.formacion ?? [],
      experiencia: draftData.items.experiencia ?? [],
      produccion: draftData.items.produccion ?? [],
      ponencia: draftData.items.ponencia ?? [],
      investigacion: draftData.items.investigacion ?? [],
    },
  };

  if (draftSaved) {
    return (
      <Card className="mt-4">
        <h3 className="text-lg font-semibold text-ink">Datos guardados</h3>
        <p className="mt-2 text-sm text-gray-600">
          Tu informacion ha sido guardada correctamente. Puedes enviar tu postulacion cuando estes listo.
        </p>
        <div className="mt-5 flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setDraftSaved(false)}
          >
            Seguir editando
          </Button>
          <Button
            type="button"
            variant="primary"
            disabled={applyMutation.isPending}
            onClick={() => applyMutation.mutate(undefined, { onSuccess: () => onApplied() })}
          >
            {applyMutation.isPending ? "Enviando..." : "Enviar postulacion"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={hojaVidaSchema}
      enableReinitialize
      onSubmit={(values) => {
        saveMutation.mutate(values, { onSuccess: () => setDraftSaved(true) });
      }}
    >
      {({ isSubmitting }) => (
        <Form className="mt-4 space-y-6">
          <Card className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-ink">
                Editar datos de la postulacion
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Revisa y completa la informacion extraida de tu hoja de vida antes de enviar.
              </p>
            </div>

            <PersonalInfoSection />

            {sections.map((section) => (
              <DynamicItemsSection
                key={section.sectionKey}
                sectionKey={section.sectionKey}
                title={section.title}
                description={section.description}
              />
            ))}

            <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
              <Button
                type="submit"
                variant="secondary"
                disabled={isSubmitting || saveMutation.isPending}
              >
                {saveMutation.isPending ? "Guardando..." : "Guardar borrador"}
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={isSubmitting || applyMutation.isPending}
                onClick={() => applyMutation.mutate(undefined, { onSuccess: () => onApplied() })}
              >
                {applyMutation.isPending ? "Enviando..." : "Enviar postulacion"}
              </Button>
            </div>
          </Card>
        </Form>
      )}
    </Formik>
  );
}
