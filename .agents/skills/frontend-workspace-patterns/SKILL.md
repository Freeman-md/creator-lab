---
name: frontend-workspace-patterns
description:
  Use before implementing new workspace pages or refactoring existing ones in
  Creator Lab. Captures the established page architecture, extraction rules,
  mutation placement, naming, and Next.js conventions from the posts refactors.
---

# Frontend Workspace Patterns

Use this skill before implementing or refactoring route pages in this repo.

This guidance is the source of truth for the architectural patterns established
across the posts pages:

- post library
- create post
- post detail

Apply the same direction to analysis pages, brief pages, and future workspace
pages unless there is a strong repo-specific reason not to.

## Core Direction

Prefer a page-first architecture:

- route pages are orchestration layers
- focused child components own isolated feature behavior
- shared components are introduced only when there is real reuse or clear page cleanup
- logic stays colocated unless extraction produces a real benefit

Avoid introducing wrapper `*View` components when they do not add meaningful
architectural value.

## Route Page Rules

Page components should generally own:

- route params
- page-level Convex query loading
- page-level loading states
- top-level `AppShell`
- page layout and section composition

Page components should generally not own:

- isolated mutation handlers for one section
- local pending state for one section
- large feature-specific UI branches that can be moved into a named section component

For reactive workspace pages, prefer client pages using Convex React hooks.

## Responsibility Split

Keep in the page:

- shared read state
- route param handling
- loading / empty / populated page branching when the state is page-level
- section composition

Move into child components:

- isolated UI sections
- one-section mutations
- local pending state
- local submit handlers
- local toast / error handling
- presentational subsections with non-trivial branching

Default rule:

- shared reads at page level
- isolated writes near the UI that triggers them

## Extraction Rules

Introduce a new component file when at least one is true:

- the UI is reused
- the section is a meaningful feature boundary
- the render logic is large enough to hurt page readability
- the component owns its own mutation/state
- the page becomes materially clearer as composition after extraction

Keep code inline when:

- it is tiny
- it is page-specific and trivial
- extraction would create a named file without improving clarity or reuse

Do not extract just for symmetry or “clean architecture” aesthetics.

## Shared Components

Create shared components only when reuse is real.

Good examples from the posts refactors:

- shared status badges used across pages
- a reusable empty state wrapper
- reusable library card / grid / loading pieces

Do not create shared components for one consumer unless the page becomes
meaningfully easier to scan and the extracted file still represents a real UI
section.

## Hooks, Helpers, Types, and Schemas

Do not extract hooks, schemas, or types by default.

Keep them colocated when they are:

- used once
- tightly coupled to one component
- not reused across feature boundaries

Move them only when they are genuinely shared.

Good candidates for shared utilities:

- reusable formatting helpers
- reusable visual status mapping helpers

Poor candidates for early extraction:

- one-off form schemas
- one-off form prop types
- a hook that only wraps one mutation used in one page

## Mutation and State Placement

For one-section actions, colocate:

- `useMutation`
- local `isSaving` / `isTriggering` state
- submit handlers
- toast handling

Keep mutation logic in the page only when:

- multiple sections must coordinate one flow
- one submit spans several child components
- the page truly owns the transaction boundary

## Naming Rules

Prefer descriptive section names based on responsibility:

- `post-library-card`
- `post-library-content`
- `post-detail-editor`
- `post-detail-analysis-trigger`
- `post-detail-feedback-summary`

Avoid vague wrappers such as `PostLibraryView` or `PostDetailView` unless the
file truly represents a durable route-level assembled view with independent
value.

## Folder Structure Rules

Keep page-specific and domain-specific components near their domain:

- `src/modules/posts/components`
- `src/modules/analyses/components`
- `src/modules/briefs/components`

Use `src/components/ui` only for broadly reusable UI primitives or shared UI
wrappers that are not tied to one domain.

## Next.js Conventions To Preserve

- For workspace routes that rely on live Convex reactivity, prefer client pages.
- Use `useQuery` in the route page when the page owns the main read model.
- Do not force server fetching when reactivity is the actual requirement.
- Use inline loading UI for client-side Convex queries instead of relying on `loading.tsx`.
- Keep `loading.tsx` for route-level async loading only.
- Use the current Next.js param conventions already present in this repo.

## Practical Defaults For Future Work

When building or refactoring a page, default to this sequence:

1. Put the main query in the route page.
2. Render the page shell and layout in the route page.
3. Keep loading and empty states at the page level if they describe the page as a whole.
4. Split large subsections into focused components.
5. Colocate mutations with the subsection that owns the action.
6. Extract shared UI only when reuse or clarity justifies it.
7. Avoid introducing generic `View` wrappers without real value.

## Use This Skill For

- refactoring a route page
- adding a new workspace page
- deciding whether a section should become its own component
- deciding whether a hook/helper/schema/type should stay colocated
- keeping analyses and briefs aligned with the patterns already established in posts

## Escalation Rule

If a proposed extraction increases file count without improving reuse,
readability, or state boundaries, do not do it.

When in doubt, prefer:

- fewer files
- clearer ownership
- colocated one-off logic

over speculative abstraction.
