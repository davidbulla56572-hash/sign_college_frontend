import { Card, EmptyState, PageContainer } from "../../../components/ui";
import { useAuthStore } from "../../auth/store/auth.store";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <EmptyState
        title="Perfil no disponible"
        description="Inicia sesion para consultar la informacion del usuario autenticado."
      />
    );
  }

  return (
    <PageContainer>
      <Card>
        <p className="text-sm font-medium text-brand-700">Perfil autenticado</p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">
          {user.nombre} {user.apellido}
        </h2>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-gray-500">Correo</dt>
            <dd className="mt-1 text-gray-900">{user.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Rol</dt>
            <dd className="mt-1 text-gray-900">{user.rol}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Cedula</dt>
            <dd className="mt-1 text-gray-900">{user.cedula}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Ubicacion</dt>
            <dd className="mt-1 text-gray-900">
              {[user.municipio, user.departamento, user.pais].filter(Boolean).join(", ") ||
                "Sin registrar"}
            </dd>
          </div>
        </dl>
      </Card>
    </PageContainer>
  );
}
