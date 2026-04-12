# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

EcoVibeFloors is a luxury flooring import platform helping Bulgarian homeowners discover premium Dutch and German flooring. The platform is bilingual (English/Bulgarian) and positions as exclusive importer of European quality for the Bulgarian market.

### Brand Partnerships
- **Ter Hürne (Germany)**: High-end natural oak parquet (engineered and solid)
- **Dutch Interior Group (DIG)**: Oak flooring supplier with comprehensive product range

## Commands

### Development
- `npm run dev` — Start dev server with Turbopack (http://localhost:3000)
- `npm run build` — Build production application
- `npm start` — Start production server

### Utilities
- `npm run seed:dry` — Preview what would be seeded to Firestore (no writes)
- `npm run seed` — Seed all product collections from TypeScript constants to Firestore
- `node utils/sort-products-by-sku.js [collection-name]` — Sort products by SKU after adding new products
- `node utils/polish-translations.js --namespace=X --dry-run` — Polish Bulgarian translations (Mistral AI)
- `node utils/polish-collection-translations.js --collection=X --dry-run` — Polish product translations
- `npx tsx utils/refine-and-translate-json.ts --collection=X --dry-run` — Production-grade translation with Zod validation

### Environment
- Copy `.env.local.example` to `.env.local` for Firebase credentials
- Add `MISTRAL_API_KEY` to `.env` for translation scripts

## Tech Stack
- **Next.js 16.2.3** / React 19 / App Router / TypeScript (strict)
- **next-intl 4.9.1** — i18n with `en`/`bg` locales, `app/[locale]/` routing
- **Material UI 7.3** + `@mui/material-nextjs 9.0` — custom luxury theme at `lib/theme.ts`
- **Firebase 12** (client) + **firebase-admin 13** (server/SSR) — Firestore, Storage, Auth
- **Middleware**: `proxy.ts` (renamed from `middleware.ts` in Next.js 16)

## File Structure
- `app/[locale]/` — all pages and layouts
- `lib/` — Firebase, theme, shared utilities
- `i18n/` — routing and request configuration
- `messages/` — `en.json` and `bg.json` translation files
- `collections/` — TypeScript product source files (seed source of truth, not used at runtime)
- `collections/` — treatment JSON data (`dig-oak-treatments.json`)
- `docs/` — reference documentation (products, translation context, deployment)

## Component Architecture (Atomic Design)

Components follow a strict **Atoms → Molecules → Organisms** hierarchy:

- `components/atoms/` — Primitives: buttons, typography, icons, inputs, price displays, skeletons, SEO
- `components/molecules/` — Atom combos: nav items, hero button group, breadcrumb, footer groups, links, basket item
- `components/organisms/` — Complex UI: cards, grids, hero sections, product sections, navbar, footer, chat
- `components/layout/` — Page-level wrappers: `PageLayoutContainer`
- `components/providers/` — Context providers

**Rules:**
- Never import upward (atoms must not import from molecules/organisms)
- `heroTextsbackground` and other shared style tokens live in `lib/styles/colors.ts`, not in components
- Page-scoped `.section.tsx` files in `app/[locale]/*/` stay there — they are not shared components
- Old paths under `components/ui/`, `components/icons/`, etc. are re-export shims — prefer new paths
- Barrel exports (`index.ts`) must be rendering-mode-segregated in Next.js 15: never mix `server-only` and `'use client'` exports in the same barrel

## Key Rules

- **Imports**: Always use `@/` alias. Exception: images from `public/` use relative paths from page directories
- **Server**: Never start the dev server — run it manually. Never run lint for testing. Use Playwright MCP for UI testing
- **Functions over classes**: Export standalone functions, not static utility classes
- **MUI Stack**: Use `Stack` instead of `Box display="flex"` for flexbox layouts
- **MUI Grid**: Import `Grid` from `@mui/material` (never `Grid2`); use `size={{ xs, md }}` prop syntax
- **MUI Buttons**: Never use `component={Link}` — use `PrimaryActionButton`/`HeroButton` with `useRouter` from `@/i18n/navigation`
- **Code comments**: Explain WHY (concepts, architecture), not WHAT (the code already shows that)

## Reference Docs

Read these before working in the relevant area:

| Task | Reference |
|---|---|
| Writing pages/layouts or using next-intl | `docs/claude/nextjs-patterns.md` |
| Product data architecture (Firestore, seed, revalidation) | `docs/claude/firebase-products.md` |
| MUI components, comments, imports, coding style | `docs/claude/coding-standards.md` |
| Bulgarian translations (rules, tools, workflow) | `docs/claude/translation-system.md` |
| Translation terminology & market context | `docs/translation-context/` |
| Product specs and content | `docs/floer/`, `docs/DIG/` |
| Firebase Storage, deployment | `docs/deployment/` |

## Package Management

This project uses cutting-edge versions (Next.js 16, React 19, MUI v7). When unsure about API syntax for any of these, use web search or context7 MCP to check current documentation — avoid assuming older API patterns still apply. See `docs/claude/nextjs-patterns.md` for the full version table and known breaking changes.
