# Next.js & next-intl Patterns

## CRITICAL: Async Params (Next.js 15)

All `params` in layouts and pages must be awaited. Direct destructuring causes runtime errors.

```tsx
// ❌ Runtime error
export default async function Page({ params: { locale } }: PageProps) {}

// ✅ Correct
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
}
```

## Static Generation Pages (`dynamic = 'error'`)

ALWAYS get locale from params (not `getLocale()`). ALWAYS use `namespace` with `getTranslations`.

```tsx
export const dynamic = 'error';

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'products' });
    const title = t('title' as keyof Messages['products']);
}
```

Why namespace is required: `getTranslations({ locale })` without namespace uses `headers()` internally, preventing static generation.

## Dynamic Pages

```tsx
export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: 'products' });
}
```

## Section Component Translations

The layout calls `setRequestLocale(locale)` — this makes locale available to all descendant server components via next-intl's request context.

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
    setRequestLocale(locale);
    return <HybridWoodFeatures />;
}

// HybridWoodFeatures.section.tsx
import 'server-only';
export async function HybridWoodFeatures() {
    const t = await getTranslations('hybridWood'); // no locale needed
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
