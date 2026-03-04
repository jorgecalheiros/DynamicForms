# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This project is in the **pre-development planning phase**. Only documentation exists under `docs/mvp/`. Source code has not been written yet. The three planning docs are:
- `docs/mvp/01_MVP_Overview.md` — architecture, schema spec, success criteria
- `docs/mvp/02_MVP_Tasks.md` — detailed 9-phase task breakdown
- `docs/mvp/03_AI_Assisted_Estimates.md` — AI-assisted workflow strategies

## Setup & Commands

Use **Yarn** (not npm) for all package management.

```bash
# Initial project scaffolding (run once)
yarn create vite dynamic-forms-mvp --template react-ts
yarn install
yarn add react-hook-form zod @hookform/resolvers
yarn add date-fns clsx
yarn add -D tailwindcss postcss autoprefixer
yarn dlx tailwindcss init -p

# Development
yarn dev      # Vite dev server at localhost:5173
yarn build    # Production build
yarn lint     # ESLint
```

No test runner is configured for MVP (manual testing only). If Vitest is added later: `yarn test`.

## Architecture

The app renders forms entirely from JSON schemas — the frontend has no prior knowledge of any specific form's structure.

**Data flow**: JSON schema file → `useFormSchema` hook → `DynamicForm` container → `FieldRenderer` (factory) → field component

**Key layers:**

- `public/schemas/` — Static JSON schema files (contact-form, survey-form, registration-form)
- `src/types/schema.types.ts` — TypeScript interfaces for the schema structure
- `src/utils/schemaValidator.ts` — Validates JSON conforms to schema spec
- `src/utils/fieldTypeRegistry.ts` — Registry of allowed field types
- `src/hooks/useFormSchema.ts` — Loads and validates a schema JSON
- `src/components/DynamicForm/FieldRenderer.tsx` — Factory: maps `field.type` → React component
- `src/components/fields/FieldWrapper.tsx` — Shared wrapper providing label + error display for all fields

**State management**: React Hook Form (`useForm`, `register`) handles all form state and validation. No global state manager (no Redux/Zustand).

## JSON Schema Structure

Every schema must have:
```json
{
  "formId": "unique-id",
  "title": "Form Title",
  "description": "optional",
  "fields": [{ "key": "fieldName", "type": "text", "label": "Label", "order": 1, "config": {} }]
}
```

The 7 supported `type` values and their `config` keys:
- `text` — `required`, `minLength`, `maxLength`, `placeholder`, `pattern` (regex)
- `number` — `required`, `min`, `max`, `step`, `placeholder`
- `select` — `required`, `multiple`, `options: [{value, label}]`
- `textarea` — `required`, `minLength`, `maxLength`, `rows`, `placeholder`
- `checkbox` — `required`
- `radio` — `required`, `options: [{value, label}]`
- `date` — `required`, `min`, `max` (YYYY-MM-DD format)

## Styling

TailwindCSS utility classes only — no custom CSS. Key patterns:
- Card: `shadow rounded-lg`
- Focus ring: `focus:ring-2 focus:ring-blue-500`
- Conditional classes: use `clsx`

## ESLint

TypeScript strict rules, React hooks linting, PropTypes disabled (TypeScript handles types), `_`-prefixed variables allowed as unused.

## Post-MVP Roadmap

Future phases planned: .NET backend API → dynamic field registry → form builder UI → microservices. The JSON schema structure is designed to map directly to a SQL schema (Forms, FormVersions, Questions, Responses tables).
