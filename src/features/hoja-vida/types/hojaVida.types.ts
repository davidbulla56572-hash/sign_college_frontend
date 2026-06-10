export type DocumentoProcesado = {
  nombre_archivo: string;
  tipo_archivo: string;
  tamanio_bytes: number;
  url_archivo: string;
};

export type DatosPersonalesHojaVida = {
  nombre: string;
  apellido: string;
  email: string | null;
  telefono: string | null;
  municipio: string | null;
  departamento: string | null;
  pais: string;
};

export type HojaVidaItem = {
  id_item?: number | null;
  descripcion: string;
  institucion: string | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  cantidad: number | null;
};

export type SoporteItem = {
  id_soporte: number;
  id_item: number;
  nombre_archivo: string;
  url_archivo: string;
  tipo_archivo: string;
  tamanio_bytes: number;
  fecha_carga: string | null;
};

export type HojaVidaSectionKey =
  | "formacion"
  | "experiencia"
  | "produccion"
  | "ponencia"
  | "investigacion";

export type HojaVidaItems = Record<HojaVidaSectionKey, HojaVidaItem[]>;

export type MetadataExtraccion = {
  origen: string;
  confidence: number | null;
  warnings: string[];
};

export type HojaVidaProcesadaResponse = {
  postulacion_id: number;
  documento: DocumentoProcesado;
  datos_personales: DatosPersonalesHojaVida;
  items: HojaVidaItems;
  metadata_extraccion: MetadataExtraccion;
};

export type HojaVidaSavePayload = {
  documento?: DocumentoProcesado | null;
  datos_personales: DatosPersonalesHojaVida;
  items: HojaVidaItems;
};

export type HojaVidaSaveResponse = {
  id_postulacion: number;
  estado: string;
  total_items: number;
  message: string;
};

export type HojaVidaDraftResponse = {
  id_postulacion: number;
  id_convocatoria: number;
  titulo_convocatoria: string;
  estado: string;
  url_cv_original: string | null;
  datos_personales: DatosPersonalesHojaVida;
  items: HojaVidaItems;
};
