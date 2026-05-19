export type PostulacionSummary = {
  id_postulacion: number;
  id_convocatoria: number;
  titulo_convocatoria: string | null;
  estado: string;
  puntaje_total: number | null;
  fecha_envio: string | null;
};

export type ActiveDraftResponse = {
  id_postulacion: number;
  id_convocatoria: number;
  estado: string;
  ya_existia: boolean;
};

export type ApplyResponse = {
  id_postulacion: number;
  estado: string;
  puntaje_total: number | null;
  mensaje: string;
};

export type HojaVidaDraftResponse = {
  id_postulacion: number;
  id_convocatoria: number;
  titulo_convocatoria: string;
  estado: string;
  url_cv_original: string | null;
  datos_personales: {
    nombre: string;
    apellido: string;
    email: string | null;
    telefono: string | null;
    municipio: string | null;
    departamento: string | null;
    pais: string;
  };
  items: Record<string, {
    descripcion: string;
    institucion: string | null;
    fecha_inicio: string | null;
    fecha_fin: string | null;
    cantidad: number | null;
  }[]>;
};
