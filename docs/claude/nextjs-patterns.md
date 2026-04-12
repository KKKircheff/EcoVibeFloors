# Next.js & next-intl Patterns

## Package Versions (as of April 2026)

| Package | Version | Notes |
|---|---|---|
| `next` | 16.2.3 | Upgraded from 15.x — see breaking changes below |
| `next-intl` | ^4.9.1 | Upgraded from 4.3.x for Next.js 16 peer dep compatibility — API unchanged |
| `@mui/material` | ^7.3.1 | No breaking changes from 7.x |
| `@mui/material-nextjs` | ^9.0.0 | Jumped from 7.x — versioning realigned with MUI; API unchanged (`AppRouterCacheProvider` etc.) |
| `firebase` | ^12.2.1 | Client-side SDK — no breaking changes |
| `firebase-admin` | ^13.8.0 | **Moved from devDependencies → dependencies** (required at runtime for Firestore SSR) |
| `react` | 19.2.5 | — |

The next-intl and `@mui/material-nextjs` upgrades were purely for Next.js 16 peer dependency compatibility. No usage changes required — existing patterns work identically.

---

## Next.js 16 — Key Changes (Upgraded April 2026)

### Pages are dynamic by default
Next.js 16 flipped the default: pages are now dynamic unless you explicitly opt into static generation. **Remove any `dynamic = 'error'` or `dynamic = 'force-static'` you encounter** — they are no longer the right pattern and will cause build failures on pages that do async work.

### `dynamicParams = true` + `generateStaticParams` is the SSG pattern
Pre-build known pages at build time; let new pages SSR on first visit and then cache automatically.

```tsx
export const dynamicParams = true; // new pages SSR on first visit → then cached

export async function generateStaticParams() {
    const products = await getAllProducts(); // fetches from Firestore at build time
    return products.flatMap((p) =>
        routing.locales.map((locale) => ({ locale, pattern: p.pattern, slug: p.slug }))
    );
}
```

How it works end-to-end:
```
Build time:   generateStaticParams → fetch slugs from Firestore → pre-build all pages as static HTML
Runtime:      User visits known page  → Next.js serves cached static HTML (no Firestore call)
New product:  User visits unknown URL → Next.js SSRs from Firestore → caches result → static from then on
Admin edits:  revalidateProduct()    → Next.js purges cache → next visitor re-fetches from Firestore → cached again
```

### Middleware → `proxy.ts`
Next.js 16 renamed the middleware entry point. Our file is `proxy.ts` (not `middleware.ts`) and the exported function is `proxy` (not `middleware`). The `createMiddleware(routing)` from next-intl still works identically — only the file and function name changed.

### Caching is now opt-in
`fetch()` is no longer cached by default. Explicitly pass `{ cache: 'force-cache' }` if you want caching on a fetch call. Our Firebase Admin SDK queries bypass Next.js caching entirely (they use the Admin SDK directly, not `fetch()`), so on-demand revalidation via `revalidatePath` controls when pages are rebuilt.

### Turbopack is the build default
`next build --turbopack` is now standard. No Webpack config needed.

---

## CRITICAL: Async Params

All `params` in layouts and pages must be awaited. Direct destructuring causes runtime errors.

```tsx
// ❌ Runtime error
export default async function Page({ params: { locale } }: PageProps) {}

// ✅ Correct
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
}
```

## Static Generation Pages

ALWAYS get locale from params (not `getLocale()`). ALWAYS use `namespace` with `getTranslations`.

```tsx
export const dynamicParams = true;

export async function generateStaticParams() {
    // fetch known slugs — pre-builds these pages at build time
    return [...];
}

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale); // required for static rendering with next-intl
    const t = await getTranslations({ locale, namespace: 'products' });
    const title = t('title' as keyof Messages['products']);
}
```

Why `namespace` is required: `getTranslations({ locale })` without namespace uses `headers()` internally, which prevents static generation.

Why `setRequestLocale(locale)`: makes the locale available to all descendant server components via next-intl's request context (needed for Pattern 2 below).

## Dynamic Pages (runtime only)

```tsx
export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: 'products' });
}
```

## Section Component Translations

**Pattern 1: Pass translations as props (simple components)**
```tsx
// page.tsx
export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale });
    return <SectionComponent title={t('section.title')} />;
}

// SectionComponent.section.tsx
export function SectionComponent({ title }: { title: string }) {
    return <h1>{title}</h1>;
}
```

**Pattern 2: Section calls getTranslations directly (complex components)**
```tsx
// page.tsx
export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale); // ← enables Pattern 2 in children
    return <HybridWoodFeatures />;
}

// HybridWoodFeatures.section.tsx
import 'server-only';
export async function HybridWoodFeatures() {
    const t = await getTranslations('hybridWood'); // no locale needed — inherited from setRequestLocale
    return <div>{t('features.title')}</div>;
}
```

Real example: `app/[locale]/hybrid-wood/(sections)/HybridWoodFeatures.section.tsx`

## Type-Safe Translation Keys

`global.d.ts` defines the `Messages` type (auto-generated from `messages/bg.json`). No import needed — globally available.

```tsx
// Single-level namespace
const key = 'home' as keyof Messages['navigation'];
t(key);

// Multi-level namespace
const linkKey = 'terms_of_service' as keyof Messages['footer']['links'];
t(`footer.links.${linkKey}`);

// Type-safe constant
t('navigation.home' as const); // compile error if key doesn't exist
```

**Real-world examples:**
```tsx
// ListMenuItem.component.tsx
{t(`${route.name.replace(' ', '_')}` as keyof Messages['navigation'])}

// FooterLinkGroup.component.tsx
type FooterLinkKeys = Exclude<keyof IntlMessages['footer']['links'], 'label'>;
interface FooterLinkGroupProps {
    group: { title: keyof IntlMessages['footer']['links']; link: string }[];
}
```
