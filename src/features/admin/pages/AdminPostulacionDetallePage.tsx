import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { PageContainer } from "../../../components/ui";
import { useToggleItemValidationMutation, usePostulacionReviewQuery, useEvaluationTraceQuery } from "../hooks/admin.hooks";
import { AdminPostulacionHeader } from "../components/AdminPostulacionHeader";
import { AdminItemReviewCard } from "../components/AdminItemReviewCard";
import { EvaluationTraceCard } from "../components/EvaluationTraceCard";
import { AdminObservacionesPanel } from "../components/AdminObservacionesPanel";
import { useNavigate } from "react-router-dom";

const tipoItemLabels: Record<string, string> = {
  FORMACION: "Formacion",
  EXPERIENCIA: "Experiencia",
  PRODUCCION: "Produccion",
  PONENCIA: "Ponencia",
  INVESTIGACION: "Investigacion",
  DOCUMENTO: "Documento",
  OTRO: "Otro",
};

const tipoItemOrder: string[] = [
  "EXPERIENCIA",
  "FORMACION",
  "PRODUCCION",
  "INVESTIGACION",
  "PONENCIA",
  "DOCUMENTO",
  "OTRO",
];

type ItemSectionFilter = "todos" | string;

export function AdminPostulacionDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postulacionId = Number(id ?? 0);
  const [activeSection, setActiveSection] = useState<ItemSectionFilter>("todos");
  const [validatingId, setValidatingId] = useState<number | null>(null);

  const { data, isLoading } = usePostulacionReviewQuery(postulacionId);
  const { data: traceData } = useEvaluationTraceQuery(postulacionId);
  const toggleValidation = useToggleItemValidationMutation();

  const handleToggleValidation = (itemId: number) => {
    setValidatingId(itemId);
    toggleValidation.mutate(itemId, {
      onSettled: () => setValidatingId(null),
    });
  };

  const handleBack = () => {
    navigate("/admin");
  };

  // Group items by tipo_item
  const itemsBySection = useMemo(() => {
    if (!data) return {};
    const grouped: Record<string, typeof data.items> = {};
    for (const item of data.items) {
      if (!grouped[item.tipo_item]) {
        grouped[item.tipo_item] = [];
      }
      grouped[item.tipo_item].push(item);
    }
    return grouped;
  }, [data?.items]);

  const sections = useMemo(() => {
    const keys = Object.keys(itemsBySection);
    return keys.sort((a, b) => {
      const ia = tipoItemOrder.indexOf(a);
      const ib = tipoItemOrder.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [itemsBySection]);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    if (activeSection === "todos") return data.items;
    return data.items.filter((i) => i.tipo_item === activeSection);
  }, [data?.items, activeSection]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-gray-500">Cargando revision...</p>
        </div>
      </PageContainer>
    );
  }

  if (!data) {
    return (
      <PageContainer>
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
          No se encontro la postulacion
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <AdminPostulacionHeader data={data} onBack={handleBack} />

        {/* Observaciones */}
        <AdminObservacionesPanel
          postulacionId={postulacionId}
          observaciones={data.observaciones_admin}
        />

        {/* Items section filter */}
        {sections.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                activeSection === "todos"
                  ? "bg-brand-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection("todos")}
            >
              Todos ({data.items.length})
            </button>
            {sections.map((section) => {
              const count = itemsBySection[section]?.length ?? 0;
              return (
                <button
                  key={section}
                  type="button"
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    activeSection === section
                      ? "bg-brand-700 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveSection(section)}
                >
                  {tipoItemLabels[section] ?? section} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Items */}
        {filteredItems.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
            No hay items en esta seccion
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <AdminItemReviewCard
                key={item.id_item}
                item={item}
                onToggleValidation={handleToggleValidation}
                validatingId={validatingId}
              />
            ))}
          </div>
        )}

        {/* Evaluation trace */}
        {traceData && traceData.detalle_evaluacion.length > 0 && (
          <EvaluationTraceCard trace={traceData} />
        )}
      </div>
    </PageContainer>
  );
}
