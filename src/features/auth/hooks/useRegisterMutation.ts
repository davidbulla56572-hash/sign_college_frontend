import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { httpClient } from "../../../lib/api/httpClient";

type RegisterPayload = {
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  password: string;
};

export function useRegisterMutation() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: RegisterPayload) => {
      const { data } = await httpClient.post("/auth/register", {
        nombre: values.nombre,
        apellido: values.apellido,
        cedula: values.cedula,
        email: values.email,
        password: values.password,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Cuenta creada exitosamente. Ahora inicia sesión.");
      navigate("/login", { replace: true });
    },
    onError: () => {
      toast.error("No se pudo crear la cuenta. Intenta nuevamente.");
    },
  });
}
