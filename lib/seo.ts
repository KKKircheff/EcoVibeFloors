const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://ecovibefloors.com';

/**
 * Builds canonical URL and hreflang alternates for a given locale + path.
 * x-default points to bg (primary market / default locale).
 * Used in generateMetadata across all page types.
 */
export function buildAlternates(locale: string, path: string) {
    return {
        canonical: `${BASE}/${locale}${path}`,
        languages: {
            'bg':        `${BASE}/bg${path}`,
            'en':        `${BASE}/en${path}`,
            'x-default': `${BASE}/bg${path}`,
        },
    };
}
