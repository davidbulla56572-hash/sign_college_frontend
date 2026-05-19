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

2. Copiar `.env.example` a `.env` si necesitas cambiar la URL del backend.
3. Levantar el servidor local:

```bash
npm run dev
```

La aplicacion queda disponible en `http://localhost:5173`.

## Scripts

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run typecheck` | Verificacion de tipos |
| `npm run preview` | Preview del build |

## Estructura

```
src/
├── app/              # Router, providers, store
├── components/ui/    # Componentes base reutilizables
├── features/         # Modulos por dominio
│   ├── admin/        # Panel administrativo
│   ├── auth/         # Autenticacion y sesion
│   ├── convocatorias/
│   ├── dashboard/    # Dashboard aspirante
│   ├── hoja-vida/    # Carga y edicion de CV
│   ├── postulaciones/
│   ├── profile/      # Perfil de usuario
│   └── resultados/   # Resultados y ranking
├── layouts/          # Layouts publico y privado
├── lib/              # HTTP client, utilidades
└── styles/           # CSS global (Tailwind)
```

## Endpoints del frontend

### Aspirante
| Ruta | Descripcion |
|------|-------------|
| `/login` | Inicio de sesion |
| `/dashboard` | Vista general de estado y postulaciones |
| `/convocatorias` | Convocatorias activas disponibles |
| `/hoja-vida` | Carga de CV y edicion de datos |
| `/perfil` | Datos personales |
| `/resultados` | Resultados de evaluacion con desglose |

### Administrador
| Ruta | Descripcion |
|------|-------------|
| `/admin` | Panel con 4 tabs: Aspirantes, Postulaciones, Ranking, Convocatorias |

## Funcionalidades implementadas

### Autenticacion
- Login con Formik + Yup + TanStack Query
- Persistencia de sesion en localStorage (Zustand)
- Redireccion por rol (Admin -> /admin, Aspirante -> /dashboard)
- Cierre de sesion automatico en 401

### Hoja de Vida
- Upload PDF/DOCX con react-dropzone (max 10MB)
- Edicion de datos personales e items por seccion
- Secciones dinamicas: Formacion, Experiencia, Produccion, Ponencias, Investigacion
- Guardado y opcion de enviar postulacion

### Resultados
- Vista de resultados con puntaje total y desglose
- Detalle expandible por tipo de item
- Estados visuales: loading, empty, error

### Dashboard Admin
- **Aspirantes**: lista con busqueda y detalle
- **Postulaciones**: tabla con estado y puntaje
- **Ranking**: tabla con filtros, busqueda y ordenamiento
- **Convocatorias**: crear, activar/cerrar

## Proteccion de rutas

- Rutas publicas: `/login` (redirige si autenticado)
- Rutas privadas: todas las demas (redirige a `/login` si no autenticado)
- Rutas admin: `/admin` (solo rol ADMIN)
