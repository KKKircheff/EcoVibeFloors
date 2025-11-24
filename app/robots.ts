import type {MetadataRoute} from 'next';

/**
 * Robots.txt configuration for EcoVibeFloors
 * Prevents search engines from indexing:
 * - Next.js internal assets (fonts, JS, CSS)
 * - API routes
 * - Malformed URLs with special characters (& and $)
 * Generated at build time and served at /robots.txt
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ecovibefloors.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/_next/static/', // Block Next.js static assets (fonts, JS, CSS)
                '/_next/image/', // Block Next.js image optimization URLs
                '/api/', // Block API routes from being indexed
                '/*&', // Block URLs ending with ampersand (malformed URLs)
                '/*$', // Block URLs ending with dollar sign (malformed URLs)
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
