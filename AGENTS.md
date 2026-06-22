# AGENTS.md

## Project Rules

This project prefers small, safe, and readable changes. Do not rewrite large parts of the codebase unless the user explicitly asks for it.

## Frontend Change Policy

1. Avoid modifying frontend code unless the task clearly requires it.
2. When frontend changes are necessary, keep the existing UI structure and visual style as much as possible.
3. Do not redesign pages, layouts, modals, tables, cards, buttons, spacing, or colors unless explicitly requested.
4. Prefer minimal patches over large refactors.

## Styling Rules

1. Frontend styles must follow the existing `index.css` theme and global design tokens first.
2. Do not introduce new colors, font sizes, shadows, borders, or spacing rules when existing styles can be reused.
3. Prefer existing Tailwind utility patterns already used in the project.
4. Avoid arbitrary values such as `text-[10px]`, `bg-[#xxxxxx]`, or custom spacing unless there is a strong reason.
5. If a shared style is needed, add a small reusable class or token instead of repeating custom styles across files.

## Component Reuse

1. Prefer existing component library components before creating new custom components.
2. Reuse existing UI components, shared components, dialogs, tables, forms, badges, buttons, inputs, tabs, and layout components whenever possible.
3. Do not duplicate component logic that already exists elsewhere.
4. If a repeated UI pattern appears more than once, extract a small reusable component.

## File and Structure Rules

1. Avoid adding too many unrelated features into a single file.
2. Keep files focused on one responsibility.
3. Split large files into smaller components when it improves readability, but preserve existing UI and behavior.
4. Page files should mainly compose components and handle page-level state.
5. Shared UI should live in shared component folders.
6. Temporary/mock data should not be hardcoded inside page components. Put temporary data in the project’s temp/mock data location if available.

## Cleanup Rules

1. When updating a feature, remove code that has become invalid or unused, as long as removing it does not break current functionality.
2. Remove unused imports, unused variables, dead branches, obsolete comments, and abandoned mock logic.
3. Do not keep placeholder functionality that only shows a toast unless it is clearly marked as not implemented.
4. Do not delete working code just to simplify the file.

## Code Style

1. Prefer simple, readable, and maintainable code.
2. Avoid clever abstractions unless they clearly reduce duplication.
3. Keep naming clear and consistent with the existing project.
4. Keep business logic and UI rendering separated where practical.
5. Avoid large rewrites when a small targeted fix is enough.

## Internationalization

1. Do not hardcode new user-facing text directly in components if the project has an i18n system.
2. Add new text to the existing i18n files and use the existing translation helper.
3. Keep all supported languages consistent when adding new copy.

## Safety Checklist Before Finishing

Before completing a task, check:

1. Did the change avoid unnecessary frontend modifications?
2. Did the frontend style follow `index.css` and existing components?
3. Did the change reuse existing components before creating new ones?
4. Did any file become too large or mix unrelated responsibilities?
5. Was obsolete or unused code safely removed?
6. Is the code simple, readable, and easy to maintain?
7. Were user-facing strings added to i18n when required?
8. Did the change avoid unintended UI redesign?
