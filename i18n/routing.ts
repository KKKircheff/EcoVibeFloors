import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'bg'],
  
  // Used when no locale matches
  defaultLocale: 'en',
  
  // Prefix all paths with locale
  localePrefix: 'always'
});

// Type definitions for better TypeScript support
export type Locale = (typeof routing.locales)[number];