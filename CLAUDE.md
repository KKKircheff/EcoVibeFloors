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
- **Configuration**: `lib/firebase.ts` exports `db`, `auth`, `storage`
- **Environment variables**: All Firebase config uses `process.env.NEXT_PUBLIC_*`
- **Services**: Firestore for data, Storage for assets, Auth for authentication
- **Security**: Client-side configuration uses public environment variables

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

### Never try to run server as I run it manually every time. Never try to run lint for testing. If you need to test app use playwright mcp