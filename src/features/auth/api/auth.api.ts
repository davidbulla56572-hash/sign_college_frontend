import { httpClient } from "../../../lib/api/httpClient";
import type { AuthResponse, LoginPayload } from "../types/auth.types";

export async function login(payload: LoginPayload) {
  const response = await httpClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function getMe() {
  const response = await httpClient.get<AuthResponse["user"]>("/auth/me");
  return response.data;
}
