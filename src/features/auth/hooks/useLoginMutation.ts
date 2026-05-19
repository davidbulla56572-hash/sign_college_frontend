import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getApiErrorMessage } from "../../../lib/api/apiError";
import { login } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import type { LoginPayload } from "../types/auth.types";

export function useLoginMutation() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      setSession(data.access_token, data.user);
      toast.success("Sesion iniciada");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
}
