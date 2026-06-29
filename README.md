# Creator Lab

Creator Lab is a feedback engine for LinkedIn creators.

It helps a creator save a published post, add performance metrics, run AI analysis, extract reusable lessons and patterns, and turn that feedback into a practical brief for the next post.

Tagline: `Every post makes the next one better.`

## What Creator Lab Does

Creator Lab is built around one feedback loop:

`Post -> Metrics -> Analysis -> Lessons & Patterns -> Brief -> Better Next Post`

In practice, that means:

1. Save a published LinkedIn post and its metadata.
2. Attach a metrics snapshot for that post.
3. Trigger an AI analysis run.
4. Store structured lessons and patterns from that analysis.
5. Generate a Next Post Brief from the completed feedback.
6. Use that brief to write the next post more intentionally.

## Core Features

The current V1 implementation includes:

- Google-based authentication with Clerk.
- Protected workspace routes via Clerk middleware.
- Post library with status-aware post cards.
- Create and edit flows for posts.
- One metrics record per post, with upsert behavior.
- Analysis history per post.
- AI-powered analysis generation in background Convex jobs.
- Structured lesson extraction (`repeat`, `avoid`, `improve`).
- Structured pattern extraction (`positive` / `negative`, score, description).
- Brief generation from completed analysis output.
- Brief detail view with next-post guidance.
- Failure handling for both analyses and briefs.
- Stale-analysis detection when a post or its metrics change after completion.
- Thin route pages with module-level UI components and Convex hooks.
- Production-oriented frontend and backend separation for Vercel + Convex deployment.

## Product Philosophy

Creator Lab is not a generic AI writing tool.

It is a feedback and learning system. The product is designed to help creators learn from what they already published, see why something worked or failed, and carry that signal forward into the next post. The AI does not replace the creator's judgment; it structures reflection so each next post can be sharper than the last one.

## Tech Stack

The repository currently uses:

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Convex
- `convex-helpers`
- Clerk
- OpenAI Node SDK
- Zod
- React Hook Form
- Radix UI primitives
- shadcn-style UI components
- Vitest + Testing Library
- Vercel for frontend hosting

## Architecture Overview

Creator Lab is implemented as a modular monolith:

- The frontend is a Next.js App Router application.
- The backend is a Convex project in the same repository.
- Route files stay thin and mostly orchestrate page layout and Convex subscriptions.
- Feature UI lives in `src/modules/*`.
- Shared primitives and layout components live in `src/components` and `src/lib`.
- Convex public functions expose user-facing reads and writes.
- Convex internal mutations and actions handle background workflows and persistence details.
- AI prompt construction, formatting, and structured output validation live under `convex/ai`.

At a high level:

- Next.js renders the workspace UI.
- Convex stores posts, metrics, analyses, lessons, patterns, and briefs.
- Public Convex mutations record user intent.
- Internal Convex actions call OpenAI.
- Internal Convex mutations persist validated results.

## Project Structure

```text
src/
  app/
    page.tsx
    posts/
      page.tsx
      new/page.tsx
      [postId]/page.tsx
      [postId]/analyses/page.tsx
      [postId]/analyses/[analysisId]/page.tsx
      [postId]/analyses/[analysisId]/brief/page.tsx
    sign-in/[[...sign-in]]/page.tsx
    sso-callback/[[...sso-callback]]/page.tsx
  components/
    auth/
    ui/
    ConvexClientProvider.tsx
  lib/
    constants/
    utils.ts
  modules/
    analyses/
    briefs/
    metrics/
    posts/

convex/
  schema.ts
  server.ts
  auth.config.ts
  posts.ts
  metrics.ts
  analyses.ts
  briefs.ts
  lessons.ts
  patterns.ts
  ai/
    formatters/
    prompts.ts
    schemas.ts
    service.ts
  internal/
    analyses/
    briefs/
    lessons/
    patterns/
    triggers.ts
  lib/
    constants.ts
    guards.ts
    mappers.ts
    ownership.ts
    reads.ts
    stale.ts
```

## Convex Backend

Convex is the system of record for the application.

### Schema tables

The current schema defines:

- `posts`
- `metrics`
- `analyses`
- `lessons`
- `patterns`
- `briefs`

### Public queries and mutations

User-facing Convex functions live at the top level of `convex/`:

- `posts.ts`
- `metrics.ts`
- `analyses.ts`
- `briefs.ts`
- `lessons.ts`
- `patterns.ts`

These functions power the workspace UI directly. Examples:

- `posts.getAll`
- `posts.get`
- `posts.create`
- `posts.update`
- `metrics.getByPost`
- `metrics.upsert`
- `analyses.getAll`
- `analyses.get`
- `analyses.trigger`
- `briefs.get`
- `briefs.create`

### Authenticated function wrappers

`convex/server.ts` defines authenticated wrappers using `convex-helpers`:

- `authQuery`
- `authMutation`
- `authAction`

These wrappers enforce that public workspace functions only run for authenticated users. Ownership checks are then applied through helpers in `convex/lib/ownership.ts`.

### Internal functions

Internal functions live under `convex/internal/` and are used for private backend workflows:

- internal queries to load background-job inputs
- internal mutations to complete or fail analyses/briefs
- internal mutations to replace lessons and patterns
- internal actions to call OpenAI

This keeps the public API focused on user intent while internal functions handle persistence and orchestration details.

### Background scheduling

Analysis and brief generation are not run directly from the frontend.

The pattern is:

1. frontend calls a public mutation
2. Convex records the requested work
3. Convex schedules an internal action
4. the action calls OpenAI
5. internal mutations save validated output

### Triggers and stale feedback

`convex/internal/triggers.ts` wraps mutations with Convex triggers.

When a post or metrics record changes, the trigger logic checks whether the latest completed analysis should be marked stale. That prevents the UI from treating outdated feedback as current.

## AI Workflow

The AI layer lives in:

- `convex/ai/prompts.ts`
- `convex/ai/schemas.ts`
- `convex/ai/service.ts`
- `convex/ai/formatters/AnalysisSnapshot.ts`
- `convex/ai/formatters/BriefSnapshot.ts`

### Analysis Flow

`Post + Metrics -> Snapshot -> Formatter -> Prompt -> Structured Output -> Saved Analysis -> Lessons + Patterns -> Brief Trigger`

More concretely:

1. `analyses.trigger` creates an in-progress analysis record.
2. The post and latest metrics are copied into a snapshot.
3. `convex/internal/analyses/actions.ts` formats that snapshot into prompt input.
4. OpenAI returns structured output validated by `analysisOutputSchema`.
5. `convex/internal/analyses/mutations.ts` saves the completed analysis.
6. Internal lesson and pattern mutations replace any prior derived records.
7. Brief generation is triggered automatically.

### Brief Flow

`Post + Analysis + Lessons + Patterns -> Brief Snapshot -> Formatter -> Prompt -> Structured Output -> Saved Brief`

More concretely:

1. A brief record is created in progress.
2. The brief snapshot is built from the source post, completed analysis, lessons, and patterns.
3. `convex/internal/briefs/actions.ts` formats the snapshot and calls OpenAI.
4. OpenAI returns structured output validated by `briefOutputSchema`.
5. `convex/internal/briefs/mutations.ts` saves the completed brief.

### Model configuration

The current OpenAI service uses `OPENAI_API_KEY` and defaults to the model string `gpt-5.4-mini` in code. Separate analysis/brief model environment variables are not currently implemented.

## Data Model

The main entities are:

- `User`
  - handled through Clerk authentication
  - ownership is stored on posts via `userId`
- `Post`
  - the source LinkedIn post plus metadata such as goal, category, audience, and publish datetime
- `Metrics`
  - one metrics record per post
  - stores the latest saved performance snapshot
- `Analysis`
  - stores the immutable analysis snapshot, processing status, summary content, reasoning, confidence, and stale state
- `Lesson`
  - derived from an analysis
  - categorized as `repeat`, `avoid`, or `improve`
- `Pattern`
  - derived from an analysis
  - includes sentiment, score, name, and description
- `Brief`
  - generated from a completed analysis plus its lessons and patterns
  - stores repeat/avoid/improve guidance and next-post direction

Relationships are intentionally simple:

- one user owns many posts
- one post has zero or one metrics record
- one post has many analyses
- one analysis has many lessons
- one analysis has many patterns
- one analysis can have one generated brief lifecycle

## Environment Variables

The repository directly references these environment variables:

```bash
NEXT_PUBLIC_CONVEX_URL=
OPENAI_API_KEY=
CLERK_JWT_ISSUER_DOMAIN=
```

Notes:

- `NEXT_PUBLIC_CONVEX_URL` is required by the frontend Convex client provider.
- `OPENAI_API_KEY` is required by Convex background AI actions.
- `CLERK_JWT_ISSUER_DOMAIN` is required by `convex/auth.config.ts` so Convex can validate Clerk-issued JWTs.
- Clerk also requires its own application configuration, but those variable names are not referenced directly in this repository, so they are not enumerated here.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

### 3. Start Convex development

In a second terminal:

```bash
npm run dev:convex
```

### 4. Configure auth and AI

Before the app can work end to end, you need:

- a Clerk application configured for the frontend
- a Convex deployment configured to trust that Clerk issuer
- an OpenAI API key available to Convex

### 5. Open the app

Visit:

```text
http://localhost:3000
```

The root route redirects to `/posts`.

## Available Scripts

From `package.json`:

- `npm run dev` - start the Next.js dev server
- `npm run dev:convex` - start Convex development
- `npm run build` - production build for Next.js
- `npm run start` - start the built Next.js app
- `npm run lint` - run ESLint
- `npm run test` - run the Vitest suite once
- `npm run test:watch` - run Vitest in watch mode
- `npm run typecheck` - run TypeScript without emitting files

## Testing and Quality

The repository currently has:

- component tests for the post editor form
- component tests for the metrics form card
- AI formatter / schema tests
- ESLint configuration
- TypeScript typechecking

Current status at the time of writing:

- `npm run lint` passes
- `npm run test` fails because `tests/convex-ai.test.ts` still imports old formatter paths
- `npm run typecheck` fails for the same stale test imports

There is no committed end-to-end test suite in the repository right now.

## Deployment

The app is designed to deploy as:

- Next.js frontend on Vercel
- Convex backend on a Convex deployment

### Frontend

Deploy the Next.js app to Vercel with the required frontend environment variables, including the public Convex URL and Clerk frontend configuration.

### Backend

Deploy Convex separately with the Convex CLI. In practice that means promoting or deploying your Convex project and ensuring the backend environment has:

- `OPENAI_API_KEY`
- `CLERK_JWT_ISSUER_DOMAIN`

If you are deploying to a fresh environment, make sure the Clerk issuer configured in Convex matches the Clerk instance used by the frontend.

The repository does not currently include a committed `vercel.json`; deployment is expected to rely on standard Vercel + Convex project configuration.

## V1 Scope

Creator Lab V1 includes:

- authenticated single-user workspace access
- post capture and editing
- post metrics capture
- on-demand analysis triggering
- structured lesson and pattern extraction
- next-post brief generation
- stale-state handling for outdated analyses
- background AI processing with failure states

## Out of Scope for V1

These are intentionally not part of the current implementation:

- LinkedIn scraping or ingestion
- LinkedIn post scheduling or publishing
- generic AI chat assistant behavior
- content calendar management
- team collaboration features
- billing
- MCP server functionality
- full-post generation as the primary product
- complex analytics dashboards
- metrics history over time

## Roadmap

Likely next areas, based on the product direction already visible in the codebase:

1. History-aware brief generation across more than one analysis run
2. LinkedIn ingestion rather than manual post entry
3. MCP/server integration for external tooling
4. Notifications around completed analyses and briefs
5. Calendar or planning workflows built on top of the feedback loop

## Development Notes

- Route files are intentionally thin and mostly orchestrate page-level data loading and layout.
- Feature UI lives in module components rather than in large route-local view files.
- Convex public and internal boundaries are deliberate; do not collapse AI workflows into public mutations.
- OpenAI calls run in internal Node actions, not in React components.
- Post and metrics updates can mark the latest completed analysis as stale through trigger-based backend logic.
- Brief generation depends on a completed analysis and available derived feedback.
- The current auth middleware treats `/sign-in` and `/sso-callback` as public routes and protects the rest of the workspace.

## Contributing / Working With Agents

For future human or AI contributors:

- inspect existing modules before creating new files or abstractions
- follow current naming and folder conventions
- keep route files thin
- colocate logic unless reuse is proven
- keep Convex public/internal boundaries clear
- avoid introducing excluded V1 features without explicit direction
- make atomic commits

Project-specific refactor guidance for future agents lives in:

- `.agents/skills/creator-lab-page-architecture/SKILL.md`
- `.claude/skills/creator-lab-page-architecture/SKILL.md`
