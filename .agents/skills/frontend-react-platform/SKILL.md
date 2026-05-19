---
name: frontend-react-platform
description: build and evolve the react frontend for a greenfield software project with a quality-first architecture. use when creating pages, components, forms, state management, routing, api clients, ui feedback, validation, feature folders, and delivery plans for a react + vite + tailwind project. prioritize ecosystem libraries before custom logic, especially formik, yup, zustand, react toastify, react router, tanstack query, axios, and react hook patterns. especially relevant for authentication, profile or hoja de vida flows, file upload, editable extracted data, dashboards, result views, and maintainable frontend architecture.
---

# Frontend React Platform

Build production-ready frontend code with a consistent architecture for this project.

## Default stack

Use these defaults unless the user explicitly overrides them:

- React + Vite + TypeScript
- Tailwind CSS for styling
- React Router for routing
- Formik for forms
- Yup for validation
- Zustand for lightweight client state
- TanStack Query for server state, caching, retries, and invalidation
- Axios for HTTP client
- React Toastify for notifications
- clsx and tailwind-merge for class composition
- react-dropzone for file upload UX
- zod is allowed only when needed for parsing external data, but do not replace Formik + Yup for forms unless the user asks

## Core rule: prefer libraries before custom logic

When implementing frontend features, do not invent infrastructure that the chosen ecosystem already solves well.

Follow this priority order:

1. Use a proven library already in the stack
2. Use a tiny wrapper around that library if project conventions need it
3. Write custom logic only for domain rules unique to this product

Apply this rule strictly for:

- form state and submission -> Formik
- validation -> Yup
- notifications -> React Toastify
- client state -> Zustand
- server state -> TanStack Query
- routing and guards -> React Router
- API calls -> Axios instance + interceptors
- file selection and drag/drop -> react-dropzone
- class merging -> clsx + tailwind-merge

Do not create:

- custom form engines
- homemade validation frameworks
- ad hoc fetch wrappers on every page
- scattered localStorage auth logic across components
- duplicated loading and error handling patterns

## Project architecture

Use this feature-first structure:

```text
src/
  app/
    router/
    providers/
    store/
  components/
    ui/
    feedback/
    data-display/
  features/
    auth/
      api/
      components/
      hooks/
      pages/
      schemas/
      store/
      types/
    profile/
    cv-upload/
    application/
    results/
    admin/
    calls/
  lib/
    api/
    utils/
    constants/
  layouts/
  pages/
  types/
```

Rules:

- Keep domain code inside `features/*`
- Keep reusable presentational building blocks in `components/ui`
- Keep shared infrastructure in `lib/*`
- Prefer page containers that compose smaller feature components
- Keep route definitions centralized
- Keep API DTOs and mappers near each feature
- Keep form schemas in `schemas/`

## Frontend delivery workflow

1. Read the requested feature and identify whether it is auth, hoja de vida, postulation, results, or admin
2. Check `references/project-context.md` for domain language and main flows
3. Check `references/frontend-architecture.md` for folder placement and implementation conventions
4. Check `references/frontend-feature-playbook.md` for the build checklist
5. Produce the smallest correct architecture slice first: route, page shell, schema, API hook, UI states
6. Add polish only after the happy path, loading state, empty state, and error state exist

## Required engineering standards

Every generated feature must include:

- route definition or route integration note
- typed API contract interfaces
- loading, empty, error, and success states
- user feedback via toast for async mutations
- validation schema for every user-editable form
- accessibility basics: labels, button types, focus states, aria attributes when needed
- responsive layout using Tailwind
- no business rules embedded in generic presentational components

## Required patterns by feature type

### Authentication

For login and protected flows:

- Use Formik + Yup for login form
- Use Axios instance with request and response interceptors
- Store auth session summary in Zustand, not raw sprawling localStorage calls
- Centralize token persistence in one auth store or auth service
- Use route guards with React Router
- Redirect by role only if role-aware UX is needed

### Hoja de vida and extracted profile data

For editable extracted data from CV:

- Split the page into sections: personal data, academic formation, experience, production, documents
- Use nested Formik values and section components
- Use Yup schemas per section, then compose if needed
- Keep extracted backend payload separate from editable form model when the shapes differ
- Preserve server identifiers in hidden form fields or view models to support updates
- Use field arrays for repeated blocks such as experience and formation items

### File upload

For CV or support uploads:

- Use react-dropzone for drag/drop
- Validate mime type and size in both UI and backend contract handling
- Show upload progress or at least processing state
- Distinguish upload failure from extraction failure
- Show extracted result summary before navigating to the edit form when possible

### Results and dashboard views

For results, ranking, and admin tables:

- Use TanStack Query for listing and refetching
- Normalize filters in URL query params when useful
- Separate filter form state from table rendering
- Always include empty and no-results states
- Format scores, dates, and statuses with helper utilities

## Output format for implementation requests

When the user asks for a feature or module, respond in this order unless they explicitly ask only for code:

1. Brief implementation plan
2. File tree to create or edit
3. Code for each file
4. Integration notes
5. Risks or follow-up items

## Project-specific priorities

This project currently centers on:

- login
- formato de hoja de vida editable from extracted CV data
- muestras de resultados for aspirants and admin
- quality-first foundations for future convocatoria, rules engine, and dashboard modules

Bias generated solutions toward those flows first.

## Quality gates before finishing

Before finalizing any frontend deliverable, verify:

- library-first rule was respected
- no duplicated API logic across files
- form validation exists and matches visible fields
- queries and mutations handle pending, success, and failure
- state location is intentional: local state vs Zustand vs TanStack Query
- Tailwind classes are readable and not excessively duplicated
- code is modular enough for future admin and aspirant flows

## References

- Use `references/project-context.md` for domain context and current scope
- Use `references/frontend-architecture.md` for code organization and design rules
- Use `references/frontend-feature-playbook.md` for implementation checklists and templates
