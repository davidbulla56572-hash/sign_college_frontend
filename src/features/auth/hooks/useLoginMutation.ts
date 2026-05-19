import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getApiErrorMessage } from "../../../lib/api/apiError";
import { login } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import type { LoginPayload } from "../types/auth.types";

export function useLoginMutation() {
  const location = useLocation();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setSession(data.access_token, data.user);
      toast.success("Sesion iniciada");
      const from = location.state?.from?.pathname as string | undefined;
      const fallbackPath = data.user.rol === "ADMIN" ? "/admin" : "/dashboard";
      navigate(from ?? fallbackPath, { replace: true });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
}
