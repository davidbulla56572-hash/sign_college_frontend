export type TipoItemHojaVida =
  | "FORMACION"
  | "EXPERIENCIA"
  | "PRODUCCION"
  | "DOCUMENTO"
  | "OTRO"
  | "PONENCIA"
  | "INVESTIGACION";

export type ReglaEvaluacion = {
  id_regla: number;
  id_convocatoria: number;
  tipo_item: TipoItemHojaVida;
  descripcion_regla: string;
  puntaje_unitario: number;
  maximo_acumulable: number | null;
  unidad: string;
};

export type ReglaEvaluacionPayload = {
  tipo_item: TipoItemHojaVida;
  descripcion_regla: string;
  puntaje_unitario: number;
  maximo_acumulable?: number | null;
  unidad: string;
};
