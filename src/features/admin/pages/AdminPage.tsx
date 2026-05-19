import { EmptyState, PageContainer } from "../../../components/ui";

export function AdminPage() {
  return (
    <PageContainer>
      <EmptyState
        title="Panel administrativo listo"
        description="La base de rutas por rol esta preparada para construir listados, ranking y revision de postulaciones."
      />
    </PageContainer>
  );
}
