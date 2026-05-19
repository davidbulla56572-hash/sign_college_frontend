import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .email("Ingresa un correo valido")
    .required("El correo es obligatorio"),
  password: Yup.string()
    .min(8, "La contrasena debe tener minimo 8 caracteres")
    .required("La contrasena es obligatoria")
});
