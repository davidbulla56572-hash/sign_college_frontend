import { useNavigate } from "react-router-dom";

import { Card, PageContainer } from "../../../components/ui";
import { Button } from "../../../components/ui/Button";
import { useConvocatoriaActivaQuery } from "../../convocatorias/hooks/convocatoriaActiva.hook";
import { useMyPostulacionesQuery, useCreateDraftMutation, useHojaVidaDraftQuery } from "../hooks/postulacion.hooks";
import { UploadCvStep } from "../components/UploadCvStep";
import { EditPostulacionStep } from "../components/EditPostulacionStep";

const estadoLabels: Record<string, string> = {
  BORRADOR: "Borrador",
  ENVIADA: "Enviada",
  EN_EVALUACION: "En evaluacion",
  EVALUADA: "Evaluada",
  RECHAZADA: "Rechazada",
};

const estadoColors: Record<string, string> = {
  BORRADOR: "text-gray-600",
  ENVIADA: "text-blue-700",
  EN_EVALUACION: "text-amber-700",
  EVALUADA: "text-emerald-700",
  RECHAZADA: "text-red-700",
};

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
    puntaje_total: number | null;
    fecha_envio: string | null;
  }>;
  convocatoriaId: number;
}) {
  const navigate = useNavigate();
  const createDraftMutation = useCreateDraftMutation();

  // Find the user's postulation for the active convocatoria (any state)
  const miPostulacion = postulaciones.find(
    (p) => p.id_convocatoria === convocatoriaId
  );

  if (!miPostulacion) {
    // No postulation yet — show "Postularse" button
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

  // Postulation exists — handle by state
  const estado = miPostulacion.estado;

  // EVALUADA or RECHAZADA: show final state with link to results
  if (estado === "EVALUADA" || estado === "RECHAZADA") {
    return (
      <PageContainer>
        <ConvocatoriaHeader
          titulo={convocatoriaTitulo}
          descripcion={convocatoriaDescripcion}
          fechaInicio={fechaInicio}
          fechaCierre={fechaCierre}
        />
        <Card className="mt-4">
          <h3 className="text-lg font-semibold text-ink">Tu postulacion</h3>
          <p className="mt-2 text-sm text-gray-600">
            Estado:{" "}
            <span className={`font-medium ${estadoColors[estado] ?? "text-ink"}`}>
              {estadoLabels[estado] ?? estado}
            </span>
          </p>
          {miPostulacion.puntaje_total != null && (
            <p className="mt-1 text-sm text-gray-500">
              Puntaje:{" "}
              <span className="font-semibold text-brand-700">
                {miPostulacion.puntaje_total.toFixed(2)}
              </span>
            </p>
          )}
          <Button
            type="button"
            variant="primary"
            className="mt-4"
            onClick={() => navigate("/resultados")}
          >
            Ver mis resultados
          </Button>
        </Card>
      </PageContainer>
    );
  }

  // EN_EVALUACION: show waiting message
  if (estado === "EN_EVALUACION") {
    return (
      <PageContainer>
        <ConvocatoriaHeader
          titulo={convocatoriaTitulo}
          descripcion={convocatoriaDescripcion}
          fechaInicio={fechaInicio}
          fechaCierre={fechaCierre}
        />
        <Card className="mt-4">
          <h3 className="text-lg font-semibold text-ink">Tu postulacion</h3>
          <p className="mt-2 text-sm text-gray-600">
            Estado:{" "}
            <span className="font-medium text-amber-700">En evaluacion</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Tu postulacion esta siendo evaluada. Pronto podras consultar tu resultado.
          </p>
        </Card>
      </PageContainer>
    );
  }

  // BORRADOR or ENVIADA: show the active flow
  return <DraftPostulacionFlow postulacionId={miPostulacion.id_postulacion} estado={estado} />;
}

function DraftPostulacionFlow({
  postulacionId,
  estado,
}: {
  postulacionId: number;
  estado: string;
}) {
  const navigate = useNavigate();
  const { data: hojaVidaDraft, isLoading: loadingDraft } =
    useHojaVidaDraftQuery(postulacionId);

  const isEnviada = estado === "ENVIADA";

  if (loadingDraft) {
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
        <Card>
          <h3 className="text-lg font-semibold text-ink">Postulacion enviada</h3>
          <p className="mt-2 text-sm text-gray-600">
            Tu postulacion ha sido enviada correctamente. Podras consultar los resultados cuando el administrador complete la evaluacion.
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

  // BORRADOR: check if CV uploaded
  const hasCv = hojaVidaDraft?.url_cv_original != null;

  if (!hasCv) {
    return (
      <PageContainer>
        <UploadCvStep postulacionId={postulacionId} onUploadComplete={() => {}} />
      </PageContainer>
    );
  }

  // CV uploaded — show edit step
  return (
    <PageContainer>
      <EditPostulacionStep
        postulacionId={postulacionId}
        onApplied={() => navigate("/mi-postulacion", { replace: true })}
      />
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
