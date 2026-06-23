# AGENTS.md

## Core Rules

* Prefer small, safe, readable changes.
* Keep existing behavior, API shape, UI structure, and style unless the task explicitly requires a change.
* Do not change unrelated modules while fixing or adding one feature.
* Do not refactor stable or working code unless explicitly requested.
* Do not rewrite large areas unless explicitly requested.
* Do not make speculative changes.
* If the task is unclear, inspect the minimum relevant code first and make the smallest reasonable fix.

## Token / Time Control

* Work in low-token mode by default.
* Do not read or print full large files.
* Do not run broad searches unless targeted searches fail.
* Do not repeatedly try different edit methods on the same block.
* Do not continue blind fixes after repeated failures.
* Prefer precise file/line inspection over broad repository exploration.
* Keep command output short and focused.
* Avoid unnecessary explanations during tool execution.

## Change Scope Limit

* Each task should modify no more than 3 files by default.
* If more than 3 files are required, first list the files and explain why before editing.
* Backend tasks must not edit `frontend/` unless explicitly requested.
* Frontend tasks must not edit `backend/` unless explicitly requested.
* Test files must not be changed unless:

  * the user explicitly asks for test changes, or
  * the existing test is incompatible with an intentional business logic change.
* Do not modify unrelated formatting, imports, names, styles, or comments.

## Patch / Edit Policy

* On Windows, do not use `apply_patch` unless explicitly requested.
* Prefer small `git apply` patches with accurate context.
* If `git apply` fails once, stop and re-read the target code before trying again.
* Do not repeatedly switch between `git apply`, `WriteAllText`, string replace, and regex replace for the same change.
* Do not use broad regex replacement on TSX, JSX, i18n, or Chinese text files.
* Do not rewrite a whole file to make a small change.
* Do not use prefix + suffix reconstruction to rewrite large files.
* Before editing, locate the exact target with `rg` and inspect only the relevant surrounding lines.
* For large files, read no more than 120 lines around the target unless absolutely necessary.

## File Reading Policy

* Use `rg` first to locate symbols, routes, components, functions, or error messages.
* Use targeted `Get-Content` / `Select-Object` ranges after locating the target.
* Do not print entire files such as:

  * large TSX pages
  * generated files
  * lock files
  * migration history
  * large JSON/YAML data
  * test snapshots
* Do not inspect unrelated folders just to understand a local bug.
* Do not read build artifacts, cache folders, `.venv`, `node_modules`, `dist`, or `.git`.

## Backend Rules

* For backend tasks, modify backend files only.
* Do not edit `frontend/` unless the user explicitly asks for frontend changes.
* Before any backend add/change/fix, read `function_register.md` to understand registered features and avoid breaking stable work.
* After any backend add/change/fix, update `function_register.md`.
* If `function_register.md` does not exist, create it.
* Keep backend changes inside the existing feature boundary when a related feature is already registered.
* Do not refactor registered stable features unless the user explicitly asks for it.
* Do not change database schema without a matching migration.
* Do not change API response shape unless explicitly required.
* Do not change permission codes, route prefixes, or auth behavior without checking existing usage.

## Function Register

`function_register.md` records completed backend features.

Each backend change must register or update:

* feature name
* module
* status: added / changed / fixed / stable
* APIs
* tables
* main files
* change summary
* impact on existing features
* verification method

For fixes, update the existing feature entry instead of creating a duplicate.

## Frontend Policy

* Avoid frontend changes unless required.
* Preserve the existing page structure, layout, components, spacing, colors, and interactions.
* Do not redesign pages, modals, cards, tables, buttons, or forms unless requested.
* Do not rewrite large TSX pages.
* Do not move large UI blocks unless the task explicitly requires layout changes.
* Temporary/mock data must stay in the project temp/mock location, not inside page components.
* User-facing text must use the existing i18n system when available.
* Do not introduce new UI libraries unless explicitly requested.
* Do not change existing shadcn/ui usage patterns unless necessary.

## Styling

* Follow `index.css`, design tokens, and existing Tailwind patterns.
* Prefer existing components and shared UI before creating new ones.
* Avoid arbitrary values like `text-[10px]`, `bg-[#xxxxxx]`, custom shadows, or custom spacing unless necessary.
* Do not change global theme tokens unless the user explicitly asks for a theme change.
* Extract small reusable components/classes only when a pattern clearly repeats.
* Do not adjust visual style while fixing logic bugs.

## Code Style

* Keep files focused on one responsibility.
* Prefer simple code over clever abstractions.
* Separate business logic and UI rendering where practical.
* Remove unused imports, variables, dead branches, obsolete comments, and invalid mock logic.
* Do not delete working code just to simplify a file.
* Do not rename exported symbols unless all references are updated and the rename is required.
* Keep existing naming conventions.
* Keep existing error handling style.

## Environment / Config Policy

* Do not modify `.env`, local secrets, credentials, tokens, or machine-specific config files.
* If environment changes are needed, update `.env.example` or document the required manual change.
* Do not hardcode passwords, tokens, database URLs, or local absolute paths.
* Do not install dependencies unless the task explicitly requires it.
* If a dependency is required, explain why before adding it.
* Do not modify lock files unless dependency changes are intentional.

## Test Strategy

* Do not run full test suites first.
* First run the smallest relevant test or static check.
* For backend changes, prefer targeted tests such as:

  * one test file
  * one test class
  * one test function
* For frontend changes, prefer:

  * TypeScript check
  * lint for affected files
  * build only when necessary
* Run full tests only after targeted checks pass or when the user explicitly requests.
* If the same test fails twice, stop blind fixing and explain the likely cause.
* Do not modify tests merely to make them pass unless the test expectation is truly outdated.

## Command Output Policy

* Limit all command output.
* Use targeted commands with small output windows.
* Prefer:

  * `rg -n "pattern" path`
  * `Get-Content file | Select-Object -Skip N -First 80`
  * `pytest path/to/test.py -q`
* Avoid:

  * printing full files
  * printing full diffs of unrelated files
  * printing full test logs
  * recursive searches without path limits
* When checking diffs, inspect only changed files.
* Keep final reported output concise.

## Preview / Browser Policy

* Do not start browser preview, Vite dev server, Playwright, Chrome DevTools, or screenshots unless explicitly requested.
* Prefer static checks: build, TypeScript check, lint, and git diff review.
* Do not leave background dev server processes running.
* If a server must be started, stop it before finishing.

## Failure Handling

* If a patch fails, do not retry blindly.
* If a command fails because of environment configuration, do not modify local config automatically.
* If a test failure is unrelated to the task, report it separately instead of fixing it.
* If the task expands beyond the requested scope, stop and summarize the required extra work.
* If a file has encoding issues, avoid rewriting it with PowerShell text replacement.

## Final Checklist

Before finishing, verify:

* No unrelated files changed.
* No `.env` or secret files changed.
* Backend task did not edit frontend unless requested.
* Frontend task did not edit backend unless requested.
* Backend task read and updated `function_register.md`.
* Frontend changes, if any, follow existing UI, style, components, and i18n.
* No large file was rewritten unnecessarily.
* No broad regex replacement was used on TSX/i18n/Chinese text files.
* Obsolete code was safely removed.
* Targeted validation or test result is reported.
* Existing registered features were not unintentionally changed.

## Final Response Format

When finished, respond only with:

* Changed files
* Core changes
* Validation / test result
* Risks or follow-up items

Do not include long implementation logs unless the user asks for them.
