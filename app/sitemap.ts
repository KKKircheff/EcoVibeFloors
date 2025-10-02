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
    try {
        const allProducts = getAllProducts();

        allProducts.forEach((product) => {
            const productPath = `/collections/${product.collection}/${product.pattern}/${product.slug}`;
            const patternPath = `/collections/${product.collection}/${product.pattern}`;

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

        // Add hybrid-wood collection pages with dynamic patterns
        const hybridWoodPatterns = Array.from(
            new Set(allProducts.filter((p) => p.collection === 'hybrid-wood').map((p) => p.pattern))
        );

        hybridWoodPatterns.forEach((pattern) => {
            const patternPath = `/hybrid-wood/${pattern}`;

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

            // Add individual product pages under hybrid-wood pattern route
            allProducts
                .filter((p) => p.collection === 'hybrid-wood' && p.pattern === pattern)
                .forEach((product) => {
                    const productPath = `/hybrid-wood/${pattern}/${product.slug}`;

                    locales.forEach((locale) => {
                        const productUrl = `${baseUrl}/${locale}${productPath}`;
                        const exists = sitemapEntries.some((entry) => entry.url === productUrl);

                        if (!exists) {
                            sitemapEntries.push({
                                url: productUrl,
                                lastModified: new Date(),
                                changeFrequency: 'weekly',
                                priority: 0.7,
                                alternates: {
                                    languages: Object.fromEntries(
                                        locales.map((l) => [l, `${baseUrl}/${l}${productPath}`])
                                    ),
                                },
                            });
                        }
                    });
                });
        });
    } catch (error) {
        console.error('Error generating dynamic sitemap entries:', error);
    }

    return sitemapEntries;
}
