import { EmptyState, PageContainer } from "../../../components/ui";

export function ResultsPage() {
  return (
    <PageContainer>
      <EmptyState
        title="Resultados pendientes"
        description="Cuando exista una postulacion evaluada, aqui se mostrara el estado, puntaje y resumen del proceso."
      />
    </PageContainer>
  );
}
