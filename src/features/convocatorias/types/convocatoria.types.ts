export type ConvocatoriaEstado = "BORRADOR" | "ACTIVA" | "CERRADA";

export type ConvocatoriaSummary = {
  id_convocatoria: number;
  titulo: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_cierre: string;
  estado: ConvocatoriaEstado;
  activa: boolean;
};

export type ConvocatoriaDetail = {
  id_convocatoria: number;
  titulo: string;
  descripcion: string | null;
  fecha_inicio: string;
  fecha_cierre: string;
  estado: ConvocatoriaEstado;
  activa: boolean;
  creado_por: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
};

export type ConvocatoriaCreatePayload = {
  titulo: string;
  descripcion?: string | null;
  fecha_inicio: string;
  fecha_cierre: string;
};

export type ConvocatoriaUpdatePayload = {
  titulo?: string | null;
  descripcion?: string | null;
  fecha_inicio?: string | null;
  fecha_cierre?: string | null;
};
