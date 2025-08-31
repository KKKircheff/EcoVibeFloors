# JSX/React Style Guide

## Next.js & React 19 Guidelines

### Component Structure
- Use functional components with hooks exclusively
- Prefer server components by default, use 'use client' only when needed
- Keep components focused on single responsibility
- Use TypeScript interfaces for component props

### JSX Patterns
- Use self-closing tags for elements without children: `<Image src="..." />`
- Wrap JSX in fragments when returning multiple elements
- Use semantic HTML elements (header, main, section, article, aside, footer)
- Prefer controlled components over uncontrolled

### Next.js Specific
- Use Next.js Image component for all images
- Use Next.js Link component for internal navigation
- Use MUI theming system and sx prop for component styling
- Use Next.js metadata API for SEO

### Accessibility
- Always include alt attributes for images
- Use proper heading hierarchy (h1 → h2 → h3)
- Include ARIA labels for interactive elements
- Ensure keyboard navigation support

### MUI Styling Guidelines
- Use MUI theme provider for consistent design system
- Leverage sx prop for component-specific styling
- Prefer MUI's built-in variants over custom CSS classes
- Use theme.spacing() for consistent spacing values
- Implement responsive design with theme breakpoints
- Create custom MUI theme components for repeated patterns

### Internationalization (Next-intl)
- Use translation keys instead of hardcoded strings
- Wrap user-facing text with useTranslations hook
- Structure translation files by component or feature
- Use interpolation for dynamic values in translations
