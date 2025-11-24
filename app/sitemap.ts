import type {MetadataRoute} from 'next';
import {getAllProducts} from '@/utils/products';
import {routing} from '@/i18n/routing';

/**
 * Dynamic sitemap generator for EcoVibeFloors
 * Automatically includes all static and dynamic routes with locale support
 * Generated at build time and included in Firebase deployment
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ecovibe-floors.web.app';

export default function sitemap(): MetadataRoute.Sitemap {
    const locales = routing.locales;
    const staticRoutes = [
        {path: '/', priority: 1.0, changeFrequency: 'daily' as const},
        {path: '/collections', priority: 0.8, changeFrequency: 'weekly' as const},
        {path: '/oak', priority: 0.8, changeFrequency: 'weekly' as const},
        {path: '/custom-oak', priority: 0.8, changeFrequency: 'weekly' as const},
        {path: '/hybrid-wood', priority: 0.8, changeFrequency: 'weekly' as const},
        {path: '/vinyl', priority: 0.8, changeFrequency: 'weekly' as const},
        {path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const},
        {path: '/blog', priority: 0.7, changeFrequency: 'weekly' as const},
        {path: '/hybrid-wood/what-is-hybrid-wood', priority: 0.6, changeFrequency: 'monthly' as const},
        // Policy pages
        {path: '/terms-of-service', priority: 0.5, changeFrequency: 'yearly' as const},
        {path: '/privacy-policy', priority: 0.5, changeFrequency: 'yearly' as const},
        {path: '/gdpr', priority: 0.5, changeFrequency: 'yearly' as const},
        {path: '/accessibility', priority: 0.5, changeFrequency: 'yearly' as const},
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Generate static route entries with locale support
    staticRoutes.forEach((route) => {
        locales.forEach((locale) => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${route.path}`,
                lastModified: new Date(),
                changeFrequency: route.changeFrequency,
                priority: route.priority,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [l, `${baseUrl}/${l}${route.path}`])
                    ),
                },
            });
        });
    });

    // Generate dynamic product page entries
    // Note: Products are organized by collection-specific routes, not under /collections/
    // Each collection has its own route structure (e.g., /hybrid-wood/[pattern]/[slug])
    try {
        const allProducts = getAllProducts();

        allProducts.forEach((product) => {
            // Use collection-specific routes instead of /collections/
            // Note: Oak collection uses [sku] parameter name but slug values
            const productPath = `/${product.collection}/${product.pattern}/${product.slug}`;
            const patternPath = `/${product.collection}/${product.pattern}`;

            locales.forEach((locale) => {
                // Individual product page
                sitemapEntries.push({
                    url: `${baseUrl}/${locale}${productPath}`,
                    lastModified: new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.7,
                    alternates: {
                        languages: Object.fromEntries(
                            locales.map((l) => [l, `${baseUrl}/${l}${productPath}`])
                        ),
                    },
                });
            });

            // Add pattern pages (deduplicated by Set)
            locales.forEach((locale) => {
                const patternUrl = `${baseUrl}/${locale}${patternPath}`;
                const exists = sitemapEntries.some((entry) => entry.url === patternUrl);

                if (!exists) {
                    sitemapEntries.push({
                        url: patternUrl,
                        lastModified: new Date(),
                        changeFrequency: 'weekly',
                        priority: 0.75,
                        alternates: {
                            languages: Object.fromEntries(
                                locales.map((l) => [l, `${baseUrl}/${l}${patternPath}`])
                            ),
                        },
                    });
                }
            });
        });

    } catch (error) {
        console.error('Error generating dynamic sitemap entries:', error);
    }

    return sitemapEntries;
}
