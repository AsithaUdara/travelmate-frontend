# Contributing Guide

This repo uses a feature-based structure with a shared design system and a typed service layer.

## Branching
- Trunk-based development on `main`.
- Name branches as `feature/<area>/<short-desc>` e.g. `feature/plan/form`.
- Keep PRs small (< 300 LOC when possible) and focused.

## PRs & Reviews
- At least 1 reviewer from another pair.
- CI must pass: typecheck + lint.
- Definition of Done:
  - Type-safe; no console errors.
  - Responsive at sm/md/lg.
  - Loading, empty, error states considered.
  - Accessible labels and keyboard nav.

## Workspace Structure
```
src/
  app/                # Routes and layouts
  components/         # Design system (atoms, molecules, organisms)
  features/           # Feature modules (itinerary, transport, discover, map)
  services/           # API services (fetcher, domain services, mocks)
  types/              # Shared TypeScript types
  contexts/           # React contexts (auth, theme, user)
  hooks/              # Shared hooks
  config/             # App/site config and flags
  constants/          # Enums and constants
```

## Ownership
- Design System: components/*, styles, layout, nav.
- Features: app/* pages + features/*
- Shared: services/*, types/* (PR review required across pairs)

## Scripts
- `npm run dev` – start app
- `npm run build` – build app
- `npm run lint` – lint

## Commit style
- Conventional commits are encouraged: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`
