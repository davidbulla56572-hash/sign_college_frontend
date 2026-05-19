# Frontend Architecture

## Guiding principles
- Prefer composition over giant pages
- Prefer feature folders over type-based sprawl
- Prefer library defaults over custom abstractions
- Keep domain behavior close to the feature that owns it
- Make async state visible in the UI

## Shared infrastructure

### app/providers
Register app-wide providers here:
- Router provider
- Query client provider
- Toast container
- Theme or app shell providers if needed

### lib/api
Create one Axios instance with:
- base URL
- auth token injection
- unified error mapping
- optional refresh-token handling if the backend supports it later

### store
Use Zustand only for cross-page client concerns such as:
- auth session summary
- lightweight UI preferences
- wizard progress if truly cross-route

Do not use Zustand for server collections that belong in TanStack Query.

## Form conventions
- One Formik form per main page or main section
- Extract reusable field groups into components
- Keep Yup schemas beside the feature
- Keep default values in factory functions, not inline giant objects in pages

## API conventions
- `features/<feature>/api/*.ts` for raw request functions
- `features/<feature>/hooks/*.ts` for query and mutation hooks
- Map backend DTOs into UI-friendly models when the backend shape is awkward

## Styling conventions
- Use Tailwind utility classes directly for most components
- Extract repeated class groups into helper functions only when repetition is meaningful
- Use `clsx` and `tailwind-merge` for variant-heavy reusable UI components

## Testing direction
When asked for tests, prioritize:
- validation schema tests
- component interaction tests for critical forms
- hook tests for query/mutation logic when valuable
