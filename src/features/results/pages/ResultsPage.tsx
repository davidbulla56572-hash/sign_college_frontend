import { ErrorState, PageContainer, Spinner } from "../../../components/ui";
import { ResultadoCard } from "../../resultados/components/ResultadoCard";
import { ResultadoEmptyState } from "../../resultados/components/ResultadoEmptyState";
import { useMisResultadosQuery } from "../../resultados/hooks/resultados.hooks";

export function ResultsPage() {
  const { data, isLoading, isError } = useMisResultadosQuery();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center py-16">
          <Spinner label="Cargando tus resultados" />
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer>
        <ErrorState
          title="Error al cargar resultados"
          description="No pudimos cargar tus resultados. Intenta de nuevo en unos momentos."
        />
      </PageContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <PageContainer>
        <ResultadoEmptyState />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-ink">Mis resultados</h2>
        <p className="mt-1 text-sm text-gray-500">
          Estado y puntaje de tus postulaciones a convocatorias docentes
        </p>
      </div>

      <div className="space-y-5">
        {data.map((result) => (
          <ResultadoCard key={result.id_postulacion} resultado={result} />
        ))}
      </div>
    </PageContainer>
  );
}
