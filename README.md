# Sign College Frontend

SPA para el sistema inteligente de evaluacion de aspirantes docentes.

## Stack base

- React + Vite + TypeScript
- Tailwind CSS
- React Router DOM
- Formik + Yup
- Zustand
- TanStack Query
- Axios
- React Toastify
- React Dropzone

## Arranque local

1. Instalar dependencias:

```bash
npm install
```

En PowerShell, si `npm` esta bloqueado por politicas de ejecucion, usa:

```bash
npm.cmd install
```

2. Copiar `.env.example` a `.env` si necesitas cambiar la URL del backend.
3. Levantar el servidor local:

```bash
npm run dev
```

La aplicacion queda disponible en `http://localhost:5173`.

## Base tecnica de Fase 2

- Router con rutas publicas y privadas.
- Rutas iniciales: `/login`, `/dashboard`, `/perfil`, `/resultados` y `/admin`.
- `QueryClientProvider`, Toastify y Axios centralizado.
- Store de sesion con Zustand.
- Componentes base: Button, Input, Card, PageContainer, Spinner, EmptyState y ErrorState.
- Estructura por features preparada para auth, hoja de vida, resultados, admin y convocatorias.

## Flujo funcional de Fase 3

- Login con Formik, Yup, TanStack Query y Toastify.
- Sesion persistida en Zustand con `isAuthenticated`, token y usuario.
- Axios adjunta `Authorization: Bearer <token>` en solicitudes autenticadas.
- La sesion persistida se valida contra `/api/v1/auth/me`.
- `/login` redirige si ya existe sesion activa.
- Rutas privadas y ruta `/admin` protegida por rol.
