<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project structure and implementation rules

### General principles

- Keep code simple, direct, and maintainable. Prefer straightforward implementations over clever abstractions.
- Follow SOLID and separation-of-concerns, but do not over-engineer.
- Optimize for consistency across the codebase. When a pattern already exists in the project, follow it unless there is a clear reason not to.
- Before introducing a new abstraction, confirm there is an actual second use case or a strong maintainability reason.
- Favor small focused functions and components. Avoid large files that mix unrelated concerns.

### Feature-local organization

- Prefer feature-local organization over global dumping grounds.
- Route or feature-specific files should live in the same feature folder.
- Keep `actions.ts`, `schemas.ts`, `types.ts`, `utils.ts`, and feature-only reusable components inside the relevant route or feature folder.
- Example pattern:
  - `app/auth/actions.ts`
  - `app/auth/schemas.ts`
  - `app/auth/types.ts`
  - `app/auth/utils.ts`
  - `app/auth/components/*`
- If logic or UI is only used by one feature, keep it inside that feature.
- Only move code to global folders when it is genuinely reused across unrelated features.

### Components

- Keep app-wide shared primitives in global component folders.
- `components/ui/*` is for shared shadcn/ui primitives and shared UI building blocks.
- `components/icons/*` is for shared icons or brand marks used across multiple features.
- Feature-specific components should not go into global `components/` unless they are truly cross-feature.
- Prefer `app/<feature>/components/*` for feature-only reusable components.
- Do not create global components prematurely.

### Utilities and helpers

- Feature-specific helpers belong in feature-local `utils.ts` or `lib.ts`.
- Do not move feature-only helpers into root `lib/` unless they are reused across multiple unrelated parts of the app.
- Keep helper files cohesive. Do not create many tiny files unless there is clear value.

### Schemas and types

- Validation schemas should live close to the feature they validate.
- Shared feature-specific types should live in that feature’s `types.ts`.
- Reuse existing types instead of repeating inline object shapes across pages, forms, and actions.
- Keep naming consistent across actions, pages, forms, and types.

### Next.js and App Router conventions

- Use `layout.tsx` only for broad shared wrappers and stable route-level structure.
- Do not force page-specific copy or per-page state into layouts.
- Use page-level components for page-specific content.
- Use route handlers and server actions only where they are the correct App Router primitive.
- Keep server-side auth, redirects, and request-dependent logic on the server.

### Forms and actions

- Prefer server actions for form submission flows unless a client-side requirement clearly justifies otherwise.
- Keep form validation in the relevant server action using schemas from the same feature folder.
- Keep action files focused on workflow/business logic, and move reusable helper logic into feature-local utilities.
- Avoid invalid HTML structures such as nested forms.

### shadcn/ui usage

- Use existing shadcn/ui components and project primitives before creating custom markup.
- Prefer composition over reinvention.
- Use semantic tokens and existing variants instead of ad-hoc styling.
- Follow existing shadcn patterns already established in the repo.
- For forms, prefer the repo’s existing field composition patterns instead of inventing new layout patterns.
- Use `Alert` for feedback states instead of custom styled error/success boxes when appropriate.

### Styling and UI discipline

- Keep styling intentional and restrained. Avoid unnecessary visual complexity.
- Reuse existing spacing, radius, typography, and component conventions.
- Do not introduce inconsistent patterns within similar flows.
- Keep assets in predictable locations:
  - shared static images: `public/images/*`
- If an asset will be served directly by the app, prefer `public/`.

### Refactoring and maintainability

- When repeated patterns appear, extract only the stable shared part.
- Extract broad wrappers into layouts when appropriate.
- Extract feature-local repeated logic into feature-local utilities or components.
- Do not extract abstractions that make the code harder to read than the duplication they remove.

### Safety and discipline

- Never read `.env` or `.env.local`.
- Do not add placeholder implementations or partial scaffolding without making it explicit.
- If provider or third-party setup cannot be fully verified locally, complete the app-side integration and clearly state the remaining external setup.
