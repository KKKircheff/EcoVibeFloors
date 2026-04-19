import type {MetadataRoute} from 'next';
import {execSync} from 'child_process';
import {getAllProducts} from '@/utils/products';
import {getAllTreatments} from '@/utils/treatments';
import {routing} from '@/i18n/routing';

/**
 * Dynamic sitemap generator for EcoVibeFloors
 * Follows Google 2025/2026 best practices:
 * - Excludes priority and changefreq (Google ignores these)
 * - Uses accurate lastmod dates based on Git commit history
 * - Generated at build time and included in Firebase deployment
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ecovibefloors.com';

// Get last modified date from Git for sitemap.ts or fallback to recent commit
function getLastModifiedDate(): Date {
    try {
        // Get the last commit date for the sitemap file
        const gitDate = execSync('git log -1 --format=%cI app/sitemap.ts', {encoding: 'utf-8'}).toString().trim();
        return gitDate ? new Date(gitDate) : new Date();
    } catch {
        // Fallback to current date if Git is not available
        return new Date();
    }
}

// Get product collection last modified dates from their source files
function getCollectionLastModified(collection: string): Date {
    // Map collection route names to their source filenames in collections/
    const fileMap: Record<string, string> = {
        'hybrid-wood': 'hy-wood',
        'oak': 'oak',
        'click-vinyl': 'click-vinyl',
        'glue-down-vinyl': 'glue-down-vinyl',
        'dig-oak-treatments': 'dig-oak-treatments',
    };
    const filename = fileMap[collection] ?? collection;
    // Try .ts first (current format), fall back to .json
    const candidates = [`collections/${filename}.ts`, `collections/${filename}.json`];
    for (const candidate of candidates) {
        try {
            const gitDate = execSync(`git log -1 --format=%cI -- ${candidate}`, {
                encoding: 'utf-8',
            }).toString().trim();
            if (gitDate) return new Date(gitDate);
        } catch {
            // continue to next candidate
        }
    }
    return new Date();
}

const sitemapLastMod = getLastModifiedDate();

export default function sitemap(): MetadataRoute.Sitemap {
    const locales = routing.locales;
    const staticRoutes = [
        {path: '/'},
        {path: '/collections'},
        {path: '/oak'},
        {path: '/custom-oak'},
        {path: '/hybrid-wood'},
        {path: '/click-vinyl'},
        {path: '/glue-down-vinyl'},
        {path: '/contact'},
        {path: '/blog'},
        {path: '/hybrid-wood/what-is-hybrid-wood'},
        {path: '/click-vinyl/what-is-click-vinyl'},
        {path: '/glue-down-vinyl/what-is-glue-down-vinyl'},
        {path: '/oak/what-is-oak-flooring'},
        {path: '/oak/treatments'},
        {path: '/terms-of-service'},
        {path: '/privacy-policy'},
        {path: '/gdpr'},
        {path: '/accessibility'},
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Generate static route entries with locale support
    staticRoutes.forEach((route) => {
        locales.forEach((locale) => {
            sitemapEntries.push({
                url: `${baseUrl}/${locale}${route.path}`,
                lastModified: sitemapLastMod,
                alternates: {
                    languages: {
                        ...Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${route.path}`])),
                        'x-default': `${baseUrl}/bg${route.path}`,
                    },
                },
            });
        });
    });

    // Generate dynamic product page entries
    // Note: Products are organized by collection-specific routes, not under /collections/
    // Each collection has its own route structure (e.g., /hybrid-wood/[pattern]/[slug])
    try {
        const allProducts = getAllProducts();
        const collectionLastModCache = new Map<string, Date>();

        allProducts.forEach((product) => {
            // Use collection-specific routes instead of /collections/
            // Note: Oak collection uses [sku] parameter name but slug values
            const productPath = `/${product.collection}/${product.pattern}/${product.slug}`;
            const patternPath = `/${product.collection}/${product.pattern}`;

            // Get or cache the collection's last modified date
            if (!collectionLastModCache.has(product.collection)) {
                collectionLastModCache.set(product.collection, getCollectionLastModified(product.collection));
            }
            const productLastMod = collectionLastModCache.get(product.collection)!;

            locales.forEach((locale) => {
                // Individual product page
                sitemapEntries.push({
                    url: `${baseUrl}/${locale}${productPath}`,
                    lastModified: productLastMod,
                    alternates: {
                        languages: {
                            ...Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${productPath}`])),
                            'x-default': `${baseUrl}/bg${productPath}`,
                        },
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
                        lastModified: productLastMod,
                        alternates: {
                            languages: {
                                ...Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${patternPath}`])),
                                'x-default': `${baseUrl}/bg${patternPath}`,
                            },
                        },
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error generating dynamic sitemap entries:', error);
    }

    // Generate treatment detail page entries
    try {
        const treatments = getAllTreatments();
        const treatmentsLastMod = getCollectionLastModified('dig-oak-treatments');

        treatments.forEach((treatment) => {
            const treatmentPath = `/oak/treatments/${treatment.slug}`;

            locales.forEach((locale) => {
                sitemapEntries.push({
                    url: `${baseUrl}/${locale}${treatmentPath}`,
                    lastModified: treatmentsLastMod,
                    alternates: {
                        languages: {
                            ...Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}${treatmentPath}`])),
                            'x-default': `${baseUrl}/bg${treatmentPath}`,
                        },
                    },
                });
            });
        });
    } catch (error) {
        console.error('Error generating treatment sitemap entries:', error);
    }

    return sitemapEntries;
}
