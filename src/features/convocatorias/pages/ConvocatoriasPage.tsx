import { useConvocatoriasQuery } from "../hooks/convocatoria.hooks";
import { EmptyState, PageContainer } from "../../../components/ui";

export function ConvocatoriasPage() {
  const { data, isLoading, error } = useConvocatoriasQuery();

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500">Cargando convocatorias...</p>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          title="Error al cargar"
          description="No se pudieron obtener las convocatorias disponibles."
        />
      </PageContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          title="Sin convocatorias"
          description="No hay convocatorias activas disponibles en este momento."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div>
        <h2 className="text-xl font-semibold text-ink">Convocatorias disponibles</h2>
        <p className="mt-1 text-sm text-gray-500">
          Proceso de seleccion docente abierto
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {data.map((conv) => (
          <div
            key={conv.id_convocatoria}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-soft"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-base font-semibold text-ink">{conv.titulo}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  conv.activa
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {conv.activa ? "Activa" : "Cerrada"}
              </span>
            </div>
            {conv.descripcion && (
              <p className="mt-2 text-sm text-gray-600">{conv.descripcion}</p>
            )}
            <div className="mt-4 flex gap-4 text-xs text-gray-500">
              <div>
                <span className="font-medium">Inicio: </span>
                {new Date(conv.fecha_inicio).toLocaleDateString("es-CO")}
              </div>
              <div>
                <span className="font-medium">Cierre: </span>
                {new Date(conv.fecha_cierre).toLocaleDateString("es-CO")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
