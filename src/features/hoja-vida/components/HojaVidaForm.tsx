import { Formik, Form } from "formik";

import { Button, Card } from "../../../components/ui";
import { hojaVidaSchema } from "../schemas/hojaVida.schema";
import type {
  HojaVidaProcesadaResponse,
  HojaVidaSavePayload,
} from "../types/hojaVida.types";
import { DynamicItemsSection } from "./DynamicItemsSection";
import { PersonalInfoSection } from "./PersonalInfoSection";

type HojaVidaFormProps = {
  data: HojaVidaProcesadaResponse;
  isSaving: boolean;
  savingError?: string | null;
  onBack: () => void;
  onSubmit: (values: HojaVidaSavePayload) => void;
};

const sections = [
  { sectionKey: "formacion" as const, title: "Formacion", description: "Titulos, cursos o estudios relevantes." },
  { sectionKey: "experiencia" as const, title: "Experiencia", description: "Experiencia docente, profesional o investigativa." },
  { sectionKey: "produccion" as const, title: "Produccion", description: "Publicaciones, libros, articulos o material academico." },
  { sectionKey: "ponencia" as const, title: "Ponencias", description: "Participaciones en eventos academicos o conferencias." },
  { sectionKey: "investigacion" as const, title: "Investigacion", description: "Proyectos, grupos o productos de investigacion." },
];

export function HojaVidaForm({ data, isSaving, savingError, onBack, onSubmit }: HojaVidaFormProps) {
  const initialValues: HojaVidaSavePayload = {
    documento: data.documento,
    datos_personales: data.datos_personales,
    items: data.items,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={hojaVidaSchema}
      enableReinitialize
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-6">
          <Card className="space-y-6">
            <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-brand-700">
                  Postulacion #{data.postulacion_id}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-ink">
                  Formato de hoja de vida
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Archivo procesado: {data.documento.nombre_archivo}
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={onBack}>
                Cambiar archivo
              </Button>
            </div>

            {data.metadata_extraccion.warnings.length > 0 && (
              <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {data.metadata_extraccion.warnings[0]}
              </div>
            )}

            <PersonalInfoSection />

            {sections.map((section) => (
              <DynamicItemsSection
                key={section.sectionKey}
                sectionKey={section.sectionKey}
                title={section.title}
                description={section.description}
              />
            ))}

            <div className="flex justify-end border-t border-gray-200 pt-5">
              {savingError && (
                <div className="mr-auto rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  {savingError}
                </div>
              )}
              <Button type="submit" disabled={isSubmitting || isSaving}>
                {isSaving ? "Guardando..." : "Guardar hoja de vida"}
              </Button>
            </div>
          </Card>
        </Form>
      )}
    </Formik>
  );
}
