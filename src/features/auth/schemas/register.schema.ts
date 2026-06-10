import { object, string, ref } from "yup";

export const registerSchema = object({
  nombre: string().required("El nombre es requerido"),
  apellido: string().required("El apellido es requerido"),
  cedula: string()
    .matches(/^\d+$/, "La cedula solo puede contener numeros")
    .min(4, "La cedula debe tener al menos 4 digitos")
    .required("La cedula es requerida"),
  email: string().email("Correo invalido").required("El correo es requerido"),
  password: string().min(8, "La contraseña debe tener al menos 8 caracteres").required("La contraseña es requerida"),
  confirmPassword: string()
    .oneOf([ref("password")], "Las contraseñas deben coincidir")
    .required("Confirmar contraseña es requerida"),
});
