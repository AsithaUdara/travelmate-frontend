# Team Playbook

## Pairs & Ownership
- Pair A (Platform): Design system (components), theme, layouts, navigation, accessibility.
- Pair B (Product): Feature routes (/plan, /transport, /discover, /map) and feature UIs.
- Shared (PR-gated): `src/types`, `src/services`.

## Sprint 1 Goals (suggested)
- Pair A: finalize atoms; build SearchBar, MediaCard; mobile header.
- Pair B: Itinerary MVP on `/plan` with mocks, loading/empty/error states.

## Process
- Branches: `feature/<area>/<task>` (e.g., `feature/plan/form`).
- Reviews: 1 reviewer from the other pair; small PRs (<300 LOC).
- DoD: type-safe, responsive (sm/md/lg), a11y labels + keyboard, loading/empty/error.
- CI: run typecheck + lint before merging.

## Coding standards (summary)
- Components: PascalCase files in `components/*`.
- Hooks: `useX.ts` in `hooks/*` or feature folder.
- Feature folders: kebab-case (e.g., `features/itinerary`).
- Avoid inline colors; use tokens: `bg-primary`, `border-border`, `bg-card`.
- Always export types from `src/types` and reuse in services & UIs.
