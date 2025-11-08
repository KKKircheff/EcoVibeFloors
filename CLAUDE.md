# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EcoVibeFloors is a luxury flooring import platform that helps Bulgarian homeowners discover premium Dutch and German flooring solutions like natural oak parquet, "Hybrid Wood", vinyl floors and laminate. The platform provides bilingual (English/Bulgarian) access to high-end floors with extended guarantees and expert guidance.

### Brand Partnerships
- **Floer (Netherlands)**: Premium Hybrid Wood flooring with 25-year warranty, known for innovative waterproof wood technology
- **Ter Hürne (Germany)**: High-end natural oak parquet (engineered and solid), German quality craftsmanship
- **Dutch Interior Group (DIG)**: Oak flooring supplier with comprehensive product range

## Purpose:
To create a visually compelling, high-quality website with strong design and engaging content. The site will showcase and promote premium Dutch and German natural oak parquet, "Hybrid Wood" floors, vinyl floors, and laminate flooring in Bulgaria. Positioning as exclusive importer of European quality for the Bulgarian market.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (http://localhost:3000)
- `npm run build` - Build production application with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Collection Management
- `node utils/sort-products-by-sku.js [collection-name]` - Sort products by SKU in collection JSON files
  - Example: `node utils/sort-products-by-sku.js hybrid-wood` - Sort specific collection
  - Example: `node utils/sort-products-by-sku.js` - Sort all collections
  - **Usage**: Run this utility after adding new products to ensure proper SKU ordering

### Translation Management
- `node utils/polish-translations.js [--namespace=X] [--all] [--dry-run] [--verbose]` - Polish Bulgarian translations in `messages/bg.json` using Mistral AI
  - Example: `node utils/polish-translations.js --namespace=navigation --dry-run` - Preview changes for navigation namespace
  - Example: `node utils/polish-translations.js --all` - Process all namespaces
  - **Usage**: Use after adding new translations or to improve existing Bulgarian content
  - **Requires**: `MISTRAL_API_KEY` in `.env` file

- `node utils/polish-collection-translations.js [--collection=X] [--all] [--dry-run] [--verbose]` - Polish product translations in `collections/*.json`
  - Example: `node utils/polish-collection-translations.js --collection=hybrid-wood --dry-run` - Preview product translation improvements
  - Example: `node utils/polish-collection-translations.js --all` - Process all collections
  - **Usage**: Use after adding new products or updating product descriptions

- `npx tsx utils/refine-and-translate-json.ts [--collection=X] [--dry-run] [--verbose]` - Refine and translate product collections with Zod validation
  - Example: `npx tsx utils/refine-and-translate-json.ts --collection=hybrid-wood --dry-run` - Preview product refinements with validation
  - Example: `npx tsx utils/refine-and-translate-json.ts --collection=glue-down-vinyl` - Process collection with type-safe validation
  - **Features**: TypeScript type safety, Zod schema validation, automatic retry on JSON errors, immutable state management
  - **Usage**: Use for production-grade translation with full product validation
  - **Requires**: `AZURE_API_KEY` and `TARGET_URL` in `.env` file

### Translation Agents (Claude Code)
- **polish-text agent**: Refine existing Bulgarian translations during development
  - Usage: Ask Claude to "use polish-text agent to improve this translation: [text]"
  - Best for: Manual content review and improvement

- **translate-text agent**: Translate new English content to Bulgarian
  - Usage: Ask Claude to "use translate-text agent to translate: [English text]"
  - Best for: Creating new Bulgarian content from English source

### Environment Setup
- Copy `.env.local.example` to `.env.local` and configure Firebase credentials
- Firebase configuration variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Add `MISTRAL_API_KEY` to `.env` for translation scripts

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

## File Structure Patterns
- `app/[locale]/` - All pages and layouts with internationalization
- `lib/` - Shared utilities (Firebase, Theme)
- `i18n/` - Internationalization configuration
- `messages/` - Translation JSON files
- `docs/products/` - Comprehensive product documentation for development reference

## Development Notes
- All text content uses next-intl `useTranslations()` hook
- Material UI components follow luxury design system in `lib/theme.ts`
- Firebase integration ready for Firestore collections and Storage buckets
- TypeScript path aliasing configured with `@/*` pointing to project root
- **ALWAYS use `@/` alias for imports instead of relative paths** (e.g., `import { Component } from '@/components/...'`)
- **Images from public folder**: Import as `import imageName from '../../../public/images/path/image.webp'` from `app/[locale]/page/` directories (use relative paths for images, not `@/` alias)

### Functional Programming Preference
- **Prefer functions over classes**: Use standalone exported functions instead of static utility classes
- **Why**: Better tree-shaking, simpler mental model, easier testing, aligns with React's functional paradigm
- **Pattern**: Export individual functions from modules (e.g., `export async function signIn() {}`)
- **Avoid**: Static utility classes (e.g., `export class AuthService { static signIn() {} }`)
- **Example**: See `lib/firebase/auth.ts` for functional approach to Firebase authentication utilities

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

#### Locale Context via `setRequestLocale`
- **Locale is available throughout the component tree**: The layout calls `setRequestLocale(locale)` which makes the locale available to all server components
- **Section components can call `getTranslations` directly**: No need to pass locale as a prop - next-intl provides it via request context
- **Both patterns are valid**:
  1. Pass translated strings as props (simpler, recommended for small components)
  2. Call `getTranslations` in section components (better for complex components with many translations)

**Pattern 1: Pass translations as props (recommended for simple cases)**
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

**Pattern 2: Section components with `getTranslations` (recommended for complex components)**
```tsx
// ✅ Page component (app/[locale]/page.tsx)
import 'server-only';
import { setRequestLocale } from 'next-intl/server';

export default async function Page({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale); // Makes locale available to child components

    return <HybridWoodFeatures />;
}

// ✅ Section component with translations (HybridWoodFeatures.section.tsx)
import 'server-only';
import { getTranslations } from 'next-intl/server';

export async function HybridWoodFeatures() {
    // ✅ No locale parameter needed - uses locale from setRequestLocale
    const t = await getTranslations('hybridWood');

    return <div>{t('features.title')}</div>;
}
```

**Key Points:**
- Layout calls `setRequestLocale(locale)` once, making locale available to all descendants
- Section components can use `getTranslations()` without passing locale explicitly
- This is the recommended pattern for static generation with next-intl
- See `app/[locale]/hybrid-wood/(sections)/HybridWoodFeatures.section.tsx` for real example

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

---

## Translation System

### Overview
EcoVibeFloors uses an intelligent translation management system powered by Mistral AI for maintaining high-quality Bulgarian content. The system combines market research, brand positioning, and terminology standards to produce natural, SEO-optimized translations.

### Translation Philosophy
**Translate INTENT, not WORDS**: Create Bulgarian content that achieves the same emotional impact and persuasiveness as English source material, adapted for Bulgarian market expectations.

### Key Principles
1. **Market-Aware**: Use terms Bulgarians actually search for (масивен паркет, трислоен паркет, водоустойчив)
2. **Trust Builders**: Always include concrete quality signals (25-годишна гаранция, германско качество, 3 мм горен слой)
3. **Natural Language**: Sound like a native Bulgarian speaker wrote it, not a translation
4. **Brand Voice**: Professional luxury tone with warmth and approachability
5. **SEO-Optimized**: Incorporate Bulgarian flooring industry search terms

### Context Files (Required Reading)
All translation work references these research files:
- `docs/translation-context/bg-market-context.md` - Bulgarian market research and terminology
- `docs/translation-context/en-source-context.md` - Floer/Ter Hürne brand positioning
- `docs/translation-context/terminology-map.json` - Translation rules and terminology standards
- `docs/translation-context/examples/translation-examples.json` - Good/bad translation patterns

### Translation Rules

#### Never Translate
- **Brand names**: Floer, Ter Hürne, Dutch Interior Group (DIG)
- **Proprietary terms**: vGroove, MEGAMAT, CLICKitEASY, SmartConnect
- **Product names in titles**: "Колекция Hybrid Wood" (keep English)

#### Always Use Bulgarian Equivalents
- click system → **клик система**
- engineered wood → **многослоен паркет** or **трислоен паркет**
- solid wood → **масивен паркет**
- waterproof → **водоустойчив**
- wear layer → **горен слой**
- usage class → **клас на износване**
- underfloor heating → **подово отопление**
- herringbone → **щурц** or **рибена кост**

#### Contextual Handling
- **"Hybrid Wood"**: Keep English in product names/titles, can translate or explain in body text
  - Title: "Колекция Hybrid Wood"
  - Description: "хибридни дървени подове с истински дъбов слой"

### Bulgarian Market Preferences

#### What Bulgarians Value (Emphasize These)
1. **Origin**: German/Dutch quality = trusted (always mention: "германско/холандско качество")
2. **Warranty Duration**: Critical trust signal (always include years: "25-годишна гаранция")
3. **Specifications**: Concrete numbers build credibility (thickness, class, layer measurements)
4. **Proven Quality**: Prefer "иновативен" + explanation over "революционен" (sounds risky)

#### Translation Patterns

**Quality Claims - Add Specifics:**
```
❌ Bad: "Висококачествен паркет"
✅ Good: "Висококачествен холандски паркет с удължена 25-годишна гаранция"
```

**Innovation Claims - Explain Benefits:**
```
❌ Bad: "Революционна хибридна технология"
✅ Good: "Иновативна технология - истински дъб върху водоустойчива основа"
```

**Marketing Copy - Natural Phrasing:**
```
❌ Bad: "Трансформирайте пространството с перфектни подови настилки"
✅ Good: "Преобразете вашето пространство с идеални подови настилки"
```

**Technical Specs - Industry Terms:**
```
❌ Bad: "Дебелина: 10мм / Слой на износване: 3мм"
✅ Good: "Обща дебелина: 10 мм / Горен слой: 3 мм"
```

### Using Translation Tools

#### Automated Translation Polishing
**For namespace translations (`messages/bg.json`):**
```bash
# Preview changes for specific namespace
node utils/polish-translations.js --namespace=navigation --dry-run

# Apply changes to specific namespace
node utils/polish-translations.js --namespace=hybridWood

# Process all namespaces (use carefully)
node utils/polish-translations.js --all --dry-run
```

**For product translations (`collections/*.json`):**
```bash
# Preview product translation improvements
node utils/polish-collection-translations.js --collection=hybrid-wood --dry-run

# Apply improvements to collection
node utils/polish-collection-translations.js --collection=hybrid-wood
```

**Best Practices:**
- Always use `--dry-run` first to preview changes
- Backups are created automatically (`.backup` files)
- Review changes with `git diff` before committing
- Test affected pages after translation updates

#### Manual Translation with Claude Agents

**To polish existing Bulgarian text:**
```
User: "Use polish-text agent to improve this translation:
'Водоустойчиво хибридно дърво с истинска дъбова красота'"

Claude: [Uses polish-text agent with full context to refine]
```

**To translate new English content:**
```
User: "Use translate-text agent to translate:
'Premium engineered oak flooring with 20-year warranty'"

Claude: [Uses translate-text agent to create Bulgarian version]
```

### Translation Workflow

**For New Features:**
1. Add English translations to `messages/en.json`
2. Add initial Bulgarian translations to `messages/bg.json` (can be rough)
3. Run polish script: `node utils/polish-translations.js --namespace=newFeature --dry-run`
4. Review and apply changes
5. Test in application

**For Product Updates:**
1. Update product data in `collections/[collection].json`
2. Run polish script: `node utils/polish-collection-translations.js --collection=[name] --dry-run`
3. Review improvements
4. Apply and test product pages

**For Manual Content:**
1. Ask Claude to use `translate-text` agent for new content
2. Ask Claude to use `polish-text` agent to refine existing content
3. Reference context files for terminology and style guidance

### Common Mistakes to Avoid

1. **Literal Translation**: "Revolutionary hybrid technology" → "Революционна хибридна технология" ❌
   - **Better**: "Иновативна технология - истински дъб върху водоустойчива основа" ✅

2. **Missing Trust Signals**: "Premium flooring" → "Премиум подови настилки" ❌
   - **Better**: "Премиум холандски подови настилки с 25-годишна гаранция" ✅

3. **Wrong Technical Terms**: "Wear layer 3mm" → "Слой на износване 3мм" ❌
   - **Better**: "Горен слой 3 мм" ✅

4. **Unnatural Phrasing**: "Experience premium quality" → "Изпитайте премиум качество" ❌
   - **Better**: "Насладете се на премиум качество" ✅

5. **Translated Brand Names**: "Floer Hybrid Wood" → "Флоер Хибридно дърво" ❌
   - **Better**: "Floer Hybrid Wood" or "Хибридни подове Floer" ✅

### Quality Checklist

Before finalizing any Bulgarian translation, verify:
- [ ] Sounds natural to native Bulgarian speaker (not "translated")
- [ ] Uses Bulgarian flooring industry search terms
- [ ] Includes concrete quality signals (warranty, origin, specs when relevant)
- [ ] Brand names and proprietary terms not translated
- [ ] Professional luxury tone maintained
- [ ] Grammatically correct with proper spacing (e.g., "3 мм" not "3мм")
- [ ] Technical terms use Bulgarian standards (клик система, многослоен паркет, etc.)
- [ ] Achieves same emotional impact as English source

### Reference
For detailed translation guidelines, examples, and market research, always consult the context files in `docs/translation-context/`.

---