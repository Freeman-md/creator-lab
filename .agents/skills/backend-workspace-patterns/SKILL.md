---
name: backend-workspace-patterns
description:
  Use before making Convex or backend changes in Creator Lab. Captures the
  established domain ownership, public/internal boundaries, auth placement,
  workflow structure, and refactor rules for consistent backend updates.
---

# Backend Workspace Patterns

Use this skill before making any Convex or backend change in this repo.

This guidance is the source of truth for the architectural patterns established
across the Convex backend and the refactors already made in this codebase.

Apply the same direction to future backend modules and updates unless there is
a strong repo-specific reason not to.

## Core Direction

Keep Convex backend code domain-owned, boundary-explicit, auth-safe, and
operationally simple.

## Domain Ownership

Convex should stay domain-first.

Each backend concern belongs to its owning module.

Examples:

- `posts` owns post reads and writes
- `metrics` owns metrics reads and writes
- `analyses` owns analysis lifecycle
- `briefs` owns brief lifecycle
- `lessons` and `patterns` own their own persistence concerns

What this means:

- if a function primarily manipulates analyses, it belongs under analyses
- do not create random cross-cutting folders unless the concern is genuinely shared infrastructure

## Public and Internal Boundaries

Public API vs internal API must stay explicit.

Use Convex functions by intent, not convenience.

Patterns:

- `query`, `mutation`, and auth-wrapped equivalents for user-facing operations
- `internalQuery`, `internalMutation` for backend-only reads and writes
- `internalAction` for long-running or AI/network work

Rules:

- frontend should only call public functions
- background jobs and backend orchestration should call internal functions where possible
- do not expose internal persistence details through public mutations unless the UI truly needs them

## Auth Placement

Auth belongs at the boundary.

Patterns:

- auth wrappers like `authQuery`, `authMutation`, `authAction`
- ownership helpers like owned post, owned analysis, and owned brief lookups

Rules:

- public user-facing functions should operate on authenticated context
- internal functions should not pretend to be user-facing auth entrypoints
- ownership checks should be reusable, direct, and domain-specific
- do not keep re-fetching identity unnecessarily deep in helper chains

## Internal Workflow Ownership

Internal functions should own backend workflows.

When one backend module needs another module’s write behavior, prefer internal
mutations over duplicating logic.

Examples:

- lesson replacement belongs in `internal/lessons/mutations`
- pattern replacement belongs in `internal/patterns/mutations`
- brief creation triggered from analysis completion should use an internal brief mutation

Rules:

- if the operation is backend orchestration, call an internal function
- if the operation is just a local read helper, keep it as a plain helper unless there is a clear reason to promote it

## Plain Helpers

Prefer plain helpers for simple local logic.

Keep as plain helpers when:

- it is pure formatting or mapping
- it is local query composition for the same file or module
- it does not need an API boundary
- it does not need to be called through `ctx.runQuery` or `ctx.runMutation`

Examples:

- mappers like `toPostRecord`, `toMetricsRecord`
- small comparison helpers
- status label helpers
- snapshot and brief payload assembly helpers if they are local and pure

Rules:

- do not turn simple helpers into internal queries just because they exist
- only promote them when they represent a real backend contract

## Mappers

Mappers should stay simple and predictable.

Record mappers should only map storage docs to app-facing shapes.

Rules:

- no business workflow logic inside mappers
- null handling only where the input can actually be null
- no unnecessary one-use intermediate variables
- if the mapper returns optional or null, do it consistently and intentionally

## Triggers

Triggers should handle true cross-cutting persistence side effects.

Use triggers for automatic data reactions, not for core business flows that
should stay explicit.

Good use cases:

- marking latest completed analysis stale when post or metrics change
- automatic cross-record consistency side effects

Rules:

- trigger logic should be small, guarded, and intentional
- compare old and new docs before patching to avoid unnecessary invalidation
- prefer explicit mutations for main workflows and triggers for automatic reactive persistence concerns

## Status and Freshness

Status fields should represent workflow state, not overloaded meaning.

Workflow state and freshness are different concerns.

Pattern:

- `status` should describe lifecycle state like `in_progress`, `completed`, `failed`
- derived or persisted freshness should be separate, for example `isStale`

Rules:

- do not overload `status` with unrelated concerns when a separate field is clearer
- preserve the ability to know both processing outcome and freshness independently

## Timestamps

Timestamps should be consistent across the backend.

Rules:

- prefer one consistent timestamp format across Convex-owned mutable fields
- use Convex `_creationTime` where it removes redundant stored `createdAt`
- only store explicit timestamps when they represent meaningful domain events like `updatedAt`, `startedAt`, `completedAt`

## Schema Design

Schema design should optimize for actual reads.

Use denormalization where Convex benefits from it.

Examples:

- keeping `postId` on lessons, patterns, and briefs can be valid even if `analysisId` also exists
- this avoids unnecessary joins and simplifies indexes and query paths

Rules:

- optimize for the real query model, not relational purity
- keep denormalized fields when they meaningfully simplify reads or indexing
- ensure write consistency in the owning mutations

## Current State vs History

One record per current-state entity unless history is intended.

Pattern:

- if the product wants a single current metrics snapshot, use one metrics record per post and update it
- do not create history tables implicitly unless the product requires historical tracking

Rules:

- model current state and history intentionally, not accidentally

## AI Workflow

Background AI work must remain asynchronous and backend-owned.

Pattern:

- public mutation records user intent
- internal action performs AI work
- internal mutation saves results
- downstream internal mutations create dependent records

Rules:

- frontend must never call AI directly
- prompt formatting, schema validation, and persistence should remain separated
- partial invalid AI output should not leave partial saved domain data

## Query Shaping

Keep contracts thin, not bloated.

Queries should return what the screen or caller actually needs.

Rules:

- avoid returning every relationship just because it is convenient
- if a screen only needs latest analysis and latest brief badges, shape for that
- if a detailed screen needs full arrays, that is a separate query concern

## File Placement

File placement should reflect ownership, not cleverness.

Recommended pattern:

- top-level domain files for primary public contracts
- `internal/...` for backend-only workflows
- `lib/...` for genuinely shared helpers, constants, mappers, and comparison utilities
- avoid scattering logic across too many tiny files

Rules:

- extract only when ownership becomes clearer
- do not create files just to look modular

## Refactor Order

Refactors should preserve behavior before improving architecture.

When refactoring Convex:

1. stabilize the current API
2. move logic to correct ownership boundaries
3. only then simplify helpers, types, or file layout

Rules:

- avoid broad multi-module migrations in one sweep if they destabilize type inference or auth boundaries
- refactor incrementally by domain

## Practical Default

If in doubt, prefer:

- clearer ownership
- fewer boundaries
- explicit public/internal separation
- plain helpers for local logic
- internal functions for backend orchestration

over abstraction for its own sake.
