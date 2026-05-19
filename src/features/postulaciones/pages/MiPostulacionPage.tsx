import { useNavigate } from "react-router-dom";

import { Card, PageContainer } from "../../../components/ui";
import { Button } from "../../../components/ui/Button";
import { useConvocatoriaActivaQuery } from "../../convocatorias/hooks/convocatoriaActiva.hook";
import { useMyPostulacionesQuery, useCreateDraftMutation, useHojaVidaDraftQuery } from "../hooks/postulacion.hooks";
import { UploadCvStep } from "../components/UploadCvStep";
import { EditPostulacionStep } from "../components/EditPostulacionStep";

export function MiPostulacionPage() {
  const navigate = useNavigate();
  const { data: activaResp, isLoading: loadingActiva } = useConvocatoriaActivaQuery();
  const { data: postulaciones, isLoading: loadingPost } = useMyPostulacionesQuery();

  if (loadingActiva || loadingPost) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500">Cargando...</p>
        </div>
      </PageContainer>
    );
  }

  if (!activaResp?.hay_convocatoria_activa) {
    return (
      <PageContainer>
        <Card>
          <h2 className="text-xl font-semibold text-ink">
            No hay convocatoria activa
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {activaResp?.mensaje ?? "No hay convocatorias activas en este momento."}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Cuando el administrador abra una nueva convocatoria, podras comenzar tu postulacion.
          </p>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PostulacionFlow
      convocatoriaTitulo={activaResp.convocatoria!.titulo}
      convocatoriaDescripcion={activaResp.convocatoria!.descripcion}
      fechaInicio={activaResp.convocatoria!.fecha_inicio}
      fechaCierre={activaResp.convocatoria!.fecha_cierre}
      postulaciones={postulaciones ?? []}
      convocatoriaId={activaResp.convocatoria!.id_convocatoria}
    />
  );
}

function PostulacionFlow({
  convocatoriaTitulo,
  convocatoriaDescripcion,
  fechaInicio,
  fechaCierre,
  postulaciones,
  convocatoriaId,
}: {
  convocatoriaTitulo: string;
  convocatoriaDescripcion: string | null;
  fechaInicio: string;
  fechaCierre: string;
  postulaciones: Array<{
    id_postulacion: number;
    id_convocatoria: number;
    estado: string;
    fecha_envio: string | null;
  }>;
  convocatoriaId: number;
}) {
  const navigate = useNavigate();
  const createDraftMutation = useCreateDraftMutation();

  const draft = postulaciones.find(
    (p) =>
      p.id_convocatoria === convocatoriaId &&
      p.estado !== "EVALUADA" &&
      p.estado !== "RECHAZADA"
  );

  // Check if the draft has a CV uploaded
  const { data: hojaVidaDraft, isLoading: loadingDraft } = useHojaVidaDraftQuery(
    draft?.id_postulacion ?? null
  );

  const isEnviada = draft?.estado === "ENVIADA";

  if (loadingDraft || createDraftMutation.isPending) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500">Cargando postulacion...</p>
        </div>
      </PageContainer>
    );
  }

  if (isEnviada) {
    return (
      <PageContainer>
        <ConvocatoriaHeader
          titulo={convocatoriaTitulo}
          descripcion={convocatoriaDescripcion}
          fechaInicio={fechaInicio}
          fechaCierre={fechaCierre}
        />
        <Card className="mt-4">
          <h3 className="text-lg font-semibold text-ink">Postulacion enviada</h3>
          <p className="mt-2 text-sm text-gray-600">
            Tu postulacion ha sido enviada correctamente. Podras consultar los resultados cuando el administrador complete la evaluacion.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Estado: <span className="font-medium text-blue-700">ENVIADA</span>
            {draft.fecha_envio && (
              <> · Enviada el {new Date(draft.fecha_envio).toLocaleDateString("es-CO")}</>
            )}
          </p>
          <Button
            type="button"
            variant="primary"
            className="mt-4"
            onClick={() => navigate("/resultados")}
          >
            Ir a resultados
          </Button>
        </Card>
      </PageContainer>
    );
  }

  if (draft) {
    // Draft exists — check if CV was uploaded
    const hasCv = hojaVidaDraft?.url_cv_original != null;

    if (!hasCv) {
      // No CV yet — show upload step
      return (
        <PageContainer>
          <ConvocatoriaHeader
            titulo={convocatoriaTitulo}
            descripcion={convocatoriaDescripcion}
            fechaInicio={fechaInicio}
            fechaCierre={fechaCierre}
          />
          <UploadCvStep
            postulacionId={draft.id_postulacion}
            onUploadComplete={() => {
              // After upload, page will re-render and show edit step
            }}
          />
        </PageContainer>
      );
    }

    // CV uploaded — show edit step
    return (
      <PageContainer>
        <ConvocatoriaHeader
          titulo={convocatoriaTitulo}
          descripcion={convocatoriaDescripcion}
          fechaInicio={fechaInicio}
          fechaCierre={fechaCierre}
        />
        <EditPostulacionStep
          postulacionId={draft.id_postulacion}
          onApplied={() => navigate("/resultados")}
        />
      </PageContainer>
    );
  }

  // No draft — show "Postularse" button
  return (
    <PageContainer>
      <ConvocatoriaHeader
        titulo={convocatoriaTitulo}
        descripcion={convocatoriaDescripcion}
        fechaInicio={fechaInicio}
        fechaCierre={fechaCierre}
      />
      <Card className="mt-4">
        <h3 className="text-lg font-semibold text-ink">Iniciar postulacion</h3>
        <p className="mt-2 text-sm text-gray-600">
          Al postularte, podras cargar tu hoja de vida y el sistema la procesara automaticamente.
        </p>
        <Button
          type="button"
          variant="primary"
          className="mt-4"
          disabled={createDraftMutation.isPending}
          onClick={() => createDraftMutation.mutate()}
        >
          Postularse
        </Button>
      </Card>
    </PageContainer>
  );
}

function ConvocatoriaHeader({
  titulo,
  descripcion,
  fechaInicio,
  fechaCierre,
}: {
  titulo: string;
  descripcion: string | null;
  fechaInicio: string;
  fechaCierre: string;
}) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
        Convocatoria activa
      </p>
      <h2 className="mt-1 text-xl font-semibold text-ink">{titulo}</h2>
      {descripcion && (
        <p className="mt-2 text-sm text-gray-600">{descripcion}</p>
      )}
      <div className="mt-3 flex gap-4 text-xs text-gray-500">
        <span>Inicio: {new Date(fechaInicio).toLocaleDateString("es-CO")}</span>
        <span>Cierre: {new Date(fechaCierre).toLocaleDateString("es-CO")}</span>
      </div>
    </Card>
  );
}
