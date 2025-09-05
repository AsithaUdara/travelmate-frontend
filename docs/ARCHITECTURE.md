# Frontend Architecture

This frontend uses Next.js App Router with Tailwind v4, TypeScript, and a feature-based structure.

## Key Concepts
- Design system: Atoms → Molecules → Organisms.
- Feature-first: UI, hooks, and state live under `src/features/<domain>`.
- Service layer: Typed fetcher and domain services under `src/services`.
- Shared contracts: Types under `src/types`.

## Structure
```
src/
  app/
    layout.tsx        # App shell (Header/Footer)
    page.tsx          # Landing
    plan/             # Itinerary planning route
    transport/        # Transport search route
    discover/         # Places & experiences
    map/              # Interactive map
  components/
    atoms/            # Button, Input, Card, Spinner, Badge, etc.
    molecules/        # SearchBar, NavLink, InlineFilters...
    organisms/        # Header, Footer, Cards grids, Heros...
  features/
    itinerary/
      components/
      hooks/
      state/
    transport/
    recommendations/
    map/
  services/
    fetcher.ts        # Fetch wrapper & errors
    itinerary.ts      # Domain services (and mocks)
    transport.ts
    discover.ts
    mock/             # Mock data/services
  types/
    itinerary.ts
    transport.ts
    discover.ts
  config/
    site.ts           # Nav, app name
    flags.ts          # Feature flags
  constants/
    index.ts
  hooks/              # Shared hooks
  contexts/           # Shared contexts
  lib/                # Helpers, formatters
```

## Ownership & Pairing
- Pair A: `components/*`, app shell, theme tokens.
- Pair B: `app/*` routes and `features/*` UI.
- Shared (PR-gated): `types/*`, `services/*`.

## Theming
- Tokens live in `src/app/globals.css` under `@theme inline`.
- Use token classes in components: `bg-card`, `text-card-foreground`, `border-border`, `bg-primary`.

## Testing
- Unit tests for logic-heavy hooks/services.
- Visual coverage via Storybook (optional) or simple page sandboxes.

## PWA (later)
- Add manifest.json, service worker, and Next-PWA when data is stable.
