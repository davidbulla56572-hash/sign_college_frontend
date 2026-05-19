import { object, string, ref } from "yup";

export const registerSchema = object({
  nombreCompleto: string().required("El nombre completo es requerido"),
  email: string().email("Correo invalido").required("El correo es requerido"),
  password: string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es requerida"),
  confirmPassword: string()
    .oneOf([ref("password")], "Las contraseñas deben coincidir")
    .required("Confirmar contraseña es requerida"),
});
