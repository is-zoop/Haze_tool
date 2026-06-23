# AGENTS.md

## Core Rules

- Prefer small, safe, readable changes.
- Do not rewrite large areas unless explicitly requested.
- Keep existing behavior, API shape, UI structure, and style unless the task requires a change.
- Do not change unrelated modules while fixing or adding one feature.

## Backend Rules

- For backend tasks, modify backend files only.
- Do not edit `frontend/` unless the user explicitly asks for frontend changes.
- Before any backend add/change/fix, read `function_register.md` to understand registered features and avoid breaking stable work.
- After any backend add/change/fix, update `function_register.md`.
- If `function_register.md` does not exist, create it.
- Keep backend changes inside the existing feature boundary when a related feature is already registered.
- Do not refactor registered stable features unless the user explicitly asks for it.

## Function Register

`function_register.md` records completed backend features.

Each backend change must register or update:

- feature name
- module
- status: added / changed / fixed / stable
- APIs
- tables
- main files
- change summary
- impact on existing features
- verification method

For fixes, update the existing feature entry instead of creating a duplicate.

## Frontend Policy

- Avoid frontend changes unless required.
- Preserve the existing page structure, layout, components, spacing, colors, and interactions.
- Do not redesign pages, modals, cards, tables, buttons, or forms unless requested.
- Temporary/mock data must stay in the project temp/mock location, not inside page components.
- User-facing text must use the existing i18n system when available.

## Styling

- Follow `index.css`, design tokens, and existing Tailwind patterns.
- Prefer existing components and shared UI before creating new ones.
- Avoid arbitrary values like `text-[10px]`, `bg-[#xxxxxx]`, custom shadows, or custom spacing unless necessary.
- Extract small reusable components/classes when a pattern repeats.

## Code Style

- Keep files focused on one responsibility.
- Prefer simple code over clever abstractions.
- Separate business logic and UI rendering where practical.
- Remove unused imports, variables, dead branches, obsolete comments, and invalid mock logic.
- Do not delete working code just to simplify a file.

## Preview / Browser Policy

- Do not start browser preview, Vite dev server, Playwright, Chrome DevTools, or screenshots unless explicitly requested.
- Prefer static checks: build, TypeScript check, lint, and git diff review.
- Do not leave background dev server processes running.

## Final Checklist

Before finishing, verify:

- No unrelated files changed.
- Backend task did not edit frontend unless requested.
- Backend task read and updated `function_register.md`.
- Frontend changes, if any, follow existing UI, style, components, and i18n.
- Obsolete code was safely removed.
- Validation or test result is reported.
- Existing registered features were not unintentionally changed.