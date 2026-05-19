import { PageContainer } from "../../../components/ui";
import { useMisResultadosQuery } from "../../resultados/hooks/resultados.hooks";
import { ResultadoCard } from "../../resultados/components/ResultadoCard";

export function ResultsPage() {
  const { data, isLoading } = useMisResultadosQuery();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500">Cargando resultados...</p>
        </div>
      </PageContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <PageContainer>
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-soft">
          <h3 className="text-base font-semibold text-ink">
            Sin resultados disponibles
          </h3>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            No hay postulaciones evaluadas. Cuando tu postulacion sea evaluada,
            aqui veras el puntaje y desglose detallado.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div>
        <h2 className="text-xl font-semibold text-ink">Mis resultados</h2>
        <p className="mt-1 text-sm text-gray-500">
          Puntaje y desglose de evaluacion por postulacion
        </p>
      </div>

      <div className="space-y-4">
        {data.map((result) => (
          <ResultadoCard key={result.id_postulacion} resultado={result} />
        ))}
      </div>
    </PageContainer>
  );
}
