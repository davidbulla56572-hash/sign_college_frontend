export type UserRole = "ASPIRANTE" | "ADMIN";

export type AuthUser = {
  id_usuario: number;
  nombre: string;
  apellido: string;
  cedula: string;
  email: string;
  telefono?: string | null;
  municipio?: string | null;
  departamento?: string | null;
  pais?: string | null;
  rol: UserRole;
  activo: boolean;
  fecha_registro: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
};
