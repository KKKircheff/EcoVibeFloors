# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EcoVibeFloors is a luxury flooring import platform that helps Bulgarian homeowners discover premium Dutch flooring solutions like natural oak parquet, "Hybrid wood", vinyl floors and laminate. The platform provides bilingual (English/Bulgarian) access to high-end floors with extended guarantees and expert guidance.

## Purpose:
To create a visually compelling, high-quality website with strong design and engaging content. The site will showcase and promote premium Dutch natural oak parquet, "Hybrid Wood" floors, vinyl floors, and laminate flooring in Bulgaria.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build production application with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Setup
- Copy `.env.local.example` to `.env.local` and configure Firebase credentials
- Firebase configuration variables are prefixed with `NEXT_PUBLIC_` for client-side access

## Architecture & Key Concepts

### Technology Stack
- **Next.js 15.5.2** with React 19.1.0 and App Router
- **next-intl 4.3.5** for internationalization (English/Bulgarian)
- **Material UI v7.3.1** with custom luxury theme
- **Firebase 12.2.1** for backend services (Firestore, Storage, Auth)
- **TypeScript** with strict configuration

### Internationalization Architecture
- **Locale-based routing**: All pages use `app/[locale]/` structure
- **Supported locales**: `en` (English), `bg` (Bulgarian)
- **URL patterns**: `/en/...` and `/bg/...` with automatic locale prefix
- **Translation files**: `messages/en.json` and `messages/bg.json`
- **Routing config**: Centralized in `i18n/routing.ts`
- **Request handling**: Configured in `i18n/request.ts`
- **Middleware**: Handles locale detection and routing in `middleware.ts`

### Material UI Integration
- **Custom luxury theme**: `lib/theme.ts` with wood-inspired color palette
- **Primary color**: #8B4513 (Saddle Brown) representing premium wood
- **Secondary color**: #2E7D32 (Forest Green) representing eco-friendly nature  
- **Font**:   Montserrat, Poiret-one, Zen kaku gothic-new
- **App Router integration**: Uses `@mui/material-nextjs/v15-appRouter` for SSR
- **Theme provider**: Configured in locale layout with `AppRouterCacheProvider`

### Firebase Configuration
- **Configuration**: `lib/firebase.ts` with embedded config values and exported constants
- **Exports**: `db`, `auth`, `storage`, `FIREBASE_STORAGE_BUCKET`
- **Services**: Firestore for data, Storage for assets, Auth for authentication
- **Storage URLs**: Use `getStorageUrl()` utility from `lib/utils/getStorageUrl.ts`
- **Security**: Firebase client-side API keys are meant to be public and work with Security Rules

### App Router Structure
- **Root layout**: Removed in favor of locale-specific layout
- **Locale layout**: `app/[locale]/layout.tsx` handles internationalization and MUI setup
- **Static generation**: `generateStaticParams()` for both supported locales
- **Metadata**: SEO-optimized for luxury flooring market

### Agent OS Integration
- **Product documentation**: `.agent-os/product/` contains mission, roadmap, tech stack
- **Standards**: `.agent-os/standards/` contains Firebase patterns and best practices
- **Mission**: Focus on luxury Dutch flooring import for Bulgarian market

## File Structure Patterns
- `app/[locale]/` - All pages and layouts with internationalization
- `lib/` - Shared utilities (Firebase, Theme)
- `i18n/` - Internationalization configuration
- `messages/` - Translation JSON files
- `docs/products/` - Comprehensive product documentation for development reference
- `.agent-os/` - Agent OS product and development standards

## Development Notes
- All text content uses next-intl `useTranslations()` hook
- Material UI components follow luxury design system in `lib/theme.ts`
- Firebase integration ready for Firestore collections and Storage buckets
- TypeScript path aliasing configured with `@/*` pointing to project root
- **ALWAYS use `@/` alias for imports instead of relative paths** (e.g., `import { Component } from '@/components/...'`)
- **Images from public folder**: Import as `import imageName from '../../../public/images/path/image.webp'` from `app/[locale]/page/` directories (use relative paths for images, not `@/` alias)

## Product Documentation Reference

### Location & Structure
- **Primary location**: `docs/products/` contains detailed product guides
- **Current products**: `hybrid-wood.md` (comprehensive guide with technical specs, features, benefits)
- **Future products**: Oak, vinyl, laminate documentation following same structure

### Usage in Development
- **Content Creation**: Reference for accurate product descriptions and copy
- **Feature Development**: Understanding product categories, specifications, and target markets
- **Translation Content**: Detailed product information for multilingual content
- **SEO & Blog Content**: Educational content for product-focused pages
- **Component Development**: Product-specific requirements and display needs

### Content Structure
Each product doc includes:
- **Overview & Definition**: What the product is and key innovations
- **Technical Specifications**: Detailed specs for filtering and comparison features
- **Benefits & Features**: Marketing content and value propositions
- **Installation & Maintenance**: Practical information for customer guidance
- **Sustainability**: Environmental benefits and certifications
- **Market Positioning**: Target customers and competitive advantages
- **Image Placeholders**: Strategic placement indicators for visual content
- **Development Tags**: Content categorization for technical implementation

### Next.js 15 Async Dynamic APIs
- **CRITICAL**: All `params` in layouts and pages must be awaited before accessing properties
- **Pattern**: Use `params: Promise<{param: string}>` in TypeScript types
- **Implementation**: `const {param} = await params;` inside function body
- **Example**: Layout functions should accept `params` as Promise and await before destructuring
- **Error**: Direct destructuring like `params: {locale}` will cause runtime errors

### Accessing Locale in Pages
- **CRITICAL**: For statically generated pages (`export const dynamic = 'error'`), ALWAYS get locale from params
- **For dynamic pages**: Use `getLocale()` from `next-intl/server` when not using static generation
- **Why**: `getLocale()` uses `headers()` which prevents static generation and causes build errors

#### Static Generation Translation Pattern
For pages with `dynamic = 'error'`, you **MUST** use `namespace` parameter with `getTranslations`:

```tsx
import { getTranslations } from 'next-intl/server';

// Force static generation
export const dynamic = 'error';

export default async function Page({ params }: PageProps) {
    const { slug, locale } = await params;  // ✅ Get locale from params

    // ✅ ALWAYS use namespace for static generation
    const t = await getTranslations({ locale, namespace: 'products' });

    // ✅ Type-safe translation keys
    const title = t('title' as keyof Messages['products']);
    // ...
}
```

**Why namespace is required**: `getTranslations({ locale })` without namespace still uses `headers()` internally. The `namespace` parameter enables static rendering.

#### Dynamic Pages Pattern
```tsx
import { getLocale, getTranslations } from 'next-intl/server';

export default async function Page({ params }: PageProps) {
    const { slug } = await params;  // ✅ Get other params
    const locale = await getLocale(); // ✅ Get locale from next-intl

    // ✅ Can use with or without namespace
    const t = await getTranslations({ locale, namespace: 'products' });
    // ...
}
```

### Translations Pattern for Section Components
- **Page-level translations**: Call `const t = await getTranslations({ locale });` in page components
- **Section components**: Should receive translated strings as props, NOT call `getTranslations` directly
- **Server-only directive**: Only page components (not section components) should use `'server-only'` directive
- **Example**:
```tsx
// ✅ Page component (app/[locale]/page.tsx)
import 'server-only';
import { getTranslations } from 'next-intl/server';

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale });

    return <SectionComponent title={t('section.title')} />;
}

// ✅ Section component (SectionComponent.section.tsx)
interface SectionComponentProps {
    title: string;
}

export function SectionComponent({ title }: SectionComponentProps) {
    return <h1>{title}</h1>;
}
```

### Type-Safe Translation Keys
- **Global type definition**: `global.d.ts` defines `Messages` type (auto-generated from `messages/bg.json`)
- **Type-safe keys**: All translation keys are type-checked at compile time via `IntlMessages` type
- **Nested namespace access**: Use `Messages['namespace']['subnesting']` for type-safe dynamic keys
- **No import needed**: `Messages` and `IntlMessages` types are globally available (defined in `global.d.ts`)

**Pattern for accessing nested translation namespaces:**
```tsx
// ✅ Type-safe dynamic translation keys with nested namespaces
// Note: Messages type is globally available, no import needed

// Single-level namespace
const key = 'home' as keyof Messages['navigation'];
t(key); // Type-safe: 'home', 'collections', 'about', etc.

// Multi-level namespace
const linkKey = 'terms_of_service' as keyof Messages['footer']['links'];
t(`footer.links.${linkKey}`); // Type-safe nested key

// Example from actual codebase
{t(sectionInfo.contentType as keyof Messages['Profile']['sidebar'])}

// ❌ Avoid - Not type-safe
t('navigation.home'); // Works but no autocomplete or type checking

// ✅ Prefer - Full type safety
t('navigation.home' as const); // Type error if key doesn't exist
```

**Benefits:**
- **Autocomplete**: IDE suggests available translation keys
- **Compile-time errors**: Catches typos and missing keys before runtime
- **Refactoring safety**: Renaming keys updates all usages
- **Documentation**: Self-documenting available translations

**Real-world examples from codebase:**
```tsx
// Navigation component (components/layout/navbar/ListMenuItem.component.tsx)
{t(`${route.name.replace(' ', '_')}` as keyof Messages['navigation'])}

// Footer links (components/layout/footer/footer-link-group/FooterLinkGroup.component.tsx)
type FooterLinkKeys = Exclude<keyof IntlMessages['footer']['links'], 'label'>;

interface FooterLinkGroupProps {
    groupTitle: string;
    group: {
        title: keyof IntlMessages['footer']['links'];
        link: string;
    }[];
}
```

## Package Management & Documentation
- **When unsure about package syntax**: Consider using web search or context7 MCP server to check current API and compatibility
- **For unfamiliar packages**: Web search can help find documentation and usage examples before implementation
- **Given the cutting-edge stack**: This project uses latest versions (Next.js 15, React 19, MUI v7) - checking current best practices may be helpful when encountering issues


## IMPORTANT NOTES:

### We use MUI 7.x so Grid component has new API. Here is example for new Grid component usage: 

<Grid container spacing={2}>
  <Grid size={{ xs: 6, md: 8 }}>
    <p>xs=6 md=8</p>
  </Grid>
  <Grid size={{ xs: 6, md: 4 }}>
    <Ip>xs=6 md=4</Ip>
  </Grid>
  <Grid size={{ xs: 6, md: 4 }}>
    <p>xs=6 md=4</p>
  </Grid>
  <Grid size={{ xs: 6, md: 8 }}>
    <p>xs=6 md=8</p>
  </Grid>
</Grid>

Please stick to this syntax when you use Grid. Also alsways evaluate if MUI Stack component or MUI Grid component is better to be used in different scenarios 

### Avoid using the Box component with display='flex' for flexbox layouts. Instead, use the native Stack component from MUI, as it is specifically designed for flexbox-based layouts and provides better built-in alignment, spacing, and responsiveness.
Why?

Stack is optimized for flexbox and simplifies common use cases (e.g., spacing, direction, and alignment).
It reduces boilerplate code and improves readability.

Example:
// ❌ Avoid
<Box display="flex" gap={2}>
  <Item>1</Item>
  <Item>2</Item>
</Box>

// ✅ Prefer
<Stack direction="row" spacing={2}>
  <Item>1</Item>
  <Item>2</Item>
</Stack>

### Button Navigation Pattern
- **NEVER use `component={Link}` pattern on MUI buttons**: This is an anti-pattern in this codebase
- **ALWAYS use pre-created button components with onClick events**: We have `PrimaryActionButton` and `HeroButton` components
- **For navigation**: Use `useRouter` from `@/i18n/navigation` and call `router.push(href)` in onClick handler
- **Example**:
```tsx
// ❌ Avoid
<Button component={Link} href="/path" variant="contained">
  Click me
</Button>

// ✅ Prefer
const router = useRouter();
const handleClick = () => {
  router.push('/path');
};

<PrimaryActionButton onClick={handleClick} variant="contained">
  Click me
</PrimaryActionButton>
```

### Grid Component Import Pattern
- **MUI 7.x uses native Grid component**: Grid2 is now the default Grid component
- **NEVER import Grid2**: The Grid component in MUI 7.x is already the new version
- **Import pattern**:
```tsx
// ❌ Avoid (old MUI 5/6 pattern)
import Grid2 from '@mui/material/Grid2';
import { Grid2 as Grid } from '@mui/material';

// ✅ Prefer (MUI 7.x)
import { Grid } from '@mui/material';
```

### Never try to run server as I run it manually every time. Never try to run lint for testing. If you need to test app use playwright mcp