# Frontend Feature Playbook

## Default build checklist
1. Define route and page responsibility
2. Define UI states: loading, empty, error, success
3. Define API contract types
4. Create Axios request functions
5. Create TanStack Query hooks
6. Create Formik form and Yup schema if user input exists
7. Add toast notifications for mutations
8. Split page into reusable sections
9. Verify responsive behavior
10. Add integration notes

## Template: CRUD-like feature
- `pages/<Feature>Page.tsx`
- `components/<Feature>Form.tsx`
- `components/<Feature>Section.tsx`
- `schemas/<feature>.schema.ts`
- `api/<feature>.api.ts`
- `hooks/use<Feature>Query.ts`
- `hooks/use<Feature>Mutation.ts`
- `types/<feature>.types.ts`

## Template: login feature
- login page
- login form component
- yup schema
- auth API module
- auth mutation hook
- auth store for session summary
- route guard integration

## Template: hoja de vida editor
- page container
- section components for personal data, formación, experiencia, producción, soportes
- field array wrappers for repeated records
- extraction result mapper
- save draft mutation
- submit postulation mutation
