// -- Fase 15: Tipos de resultados --

export type EstadoColor = "gray" | "blue" | "amber" | "green" | "red";

export type ResumenEvaluacion = {
  tipo_item: string;
  label: string;
  puntaje_obtenido: number;
  cantidad_items: number;
};

export type DetalleItemResultado = {
  id_item: number;
  tipo_item: string;
  descripcion: string;
  puntaje_asignado: number;
};

export type ConvocatoriaRef = {
  id_convocatoria: number;
  titulo: string;
};

export type MiResultado = {
  id_postulacion: number;
  estado: string;
  estado_label: string;
  estado_color: EstadoColor;
  mensaje_contextual: string;
  puntaje_total: number | null;
  fecha_evaluacion: string | null;
  convocatoria: ConvocatoriaRef;
  resumen_evaluacion: ResumenEvaluacion[];
  detalle: DetalleItemResultado[];
};

export type PostulacionStatus = {
  id_postulacion: number;
  estado: string;
  estado_label: string;
  estado_color: EstadoColor;
  mensaje_contextual: string;
  id_convocatoria: number;
  titulo_convocatoria: string;
  fecha_envio: string | null;
  fecha_evaluacion: string | null;
};
