import * as Yup from "yup";

export const hojaVidaSchema = Yup.object({
  datos_personales: Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido es obligatorio"),
    email: Yup.string().email("Correo invalido").nullable(),
    telefono: Yup.string().nullable(),
    municipio: Yup.string().nullable(),
    departamento: Yup.string().nullable(),
    pais: Yup.string().required("El pais es obligatorio"),
  }),
  items: Yup.object({
    formacion: Yup.array().of(
      Yup.object({
        descripcion: Yup.string()
          .max(2000, "Maximo 2000 caracteres")
          .required("La descripcion es obligatoria"),
        institucion: Yup.string().nullable(),
        fecha_inicio: Yup.string().nullable(),
        fecha_fin: Yup.string().nullable(),
        cantidad: Yup.number()
          .nullable()
          .min(0, "Debe ser mayor o igual a cero")
          .transform((v, o) => (o === "" ? null : v)),
      })
    ),
    experiencia: Yup.array().of(
      Yup.object({
        descripcion: Yup.string()
          .max(2000, "Maximo 2000 caracteres")
          .required("La descripcion es obligatoria"),
        institucion: Yup.string().nullable(),
        fecha_inicio: Yup.string().nullable(),
        fecha_fin: Yup.string().nullable(),
        cantidad: Yup.number()
          .nullable()
          .min(0, "Debe ser mayor o igual a cero")
          .transform((v, o) => (o === "" ? null : v)),
      })
    ),
    produccion: Yup.array().of(
      Yup.object({
        descripcion: Yup.string()
          .max(2000, "Maximo 2000 caracteres")
          .required("La descripcion es obligatoria"),
        institucion: Yup.string().nullable(),
        fecha_inicio: Yup.string().nullable(),
        fecha_fin: Yup.string().nullable(),
        cantidad: Yup.number()
          .nullable()
          .min(0, "Debe ser mayor o igual a cero")
          .transform((v, o) => (o === "" ? null : v)),
      })
    ),
    ponencia: Yup.array().of(
      Yup.object({
        descripcion: Yup.string()
          .max(2000, "Maximo 2000 caracteres")
          .required("La descripcion es obligatoria"),
        institucion: Yup.string().nullable(),
        fecha_inicio: Yup.string().nullable(),
        fecha_fin: Yup.string().nullable(),
        cantidad: Yup.number()
          .nullable()
          .min(0, "Debe ser mayor o igual a cero")
          .transform((v, o) => (o === "" ? null : v)),
      })
    ),
    investigacion: Yup.array().of(
      Yup.object({
        descripcion: Yup.string()
          .max(2000, "Maximo 2000 caracteres")
          .required("La descripcion es obligatoria"),
        institucion: Yup.string().nullable(),
        fecha_inicio: Yup.string().nullable(),
        fecha_fin: Yup.string().nullable(),
        cantidad: Yup.number()
          .nullable()
          .min(0, "Debe ser mayor o igual a cero")
          .transform((v, o) => (o === "" ? null : v)),
      })
    ),
  }),
});
