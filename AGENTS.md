<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Before implementing or refactoring workspace pages, consult `.agents/skills/frontend-workspace-patterns/SKILL.md` and follow it as the project-specific source of truth for page composition, extraction, mutation placement, and Next.js page patterns.

Before making Convex or backend updates, consult `.agents/skills/backend-workspace-patterns/SKILL.md` and follow it as the project-specific source of truth for domain ownership, public/internal boundaries, auth placement, and backend workflow structure.
<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
