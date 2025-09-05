# Getting Started

## Prerequisites
- Node.js 18+
- npm 9+

## Install & run
```powershell
npm install
npm run dev
```
Open http://localhost:3000

## Useful paths
- App shell: `src/app/layout.tsx`
- Global styles & theme tokens: `src/app/globals.css`
- Navigation: `src/config/site.ts`
- Design system: `src/components/{atoms,molecules,organisms}`
- Routes: `src/app/{plan,transport,discover,map}`
- Services & mocks: `src/services/*`, `src/services/mock/*`
- Types: `src/types/*`

## VS Code tips
- Use the `@/*` path alias for imports.
- Prefer component composition over deep prop drilling.
