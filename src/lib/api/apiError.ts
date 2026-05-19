import axios from "axios";

import type { ApiErrorResponse } from "../../types/api.types";

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? "No se pudo completar la solicitud";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrio un error inesperado";
}
