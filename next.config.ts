import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import bundleAnalyzer from '@next/bundle-analyzer';
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});
const nextConfig: NextConfig = {
    allowedDevOrigins: ['127.0.0.1'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                pathname: '/v0/b/*/o/**',
            },
        ],
        qualities: [100],
        formats: ['image/webp', 'image/avif'],
    },
    modularizeImports: {
        '@mui/icons-material': {
            transform: '@mui/icons-material/{{member}}',
        },
    },
    experimental: {
        optimizePackageImports: ['@mui/material', '@mui/icons-material'],
        cssChunking: 'strict',
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
        reactRemoveProperties: process.env.NODE_ENV === 'production',
    },
    // SEO: Redirect legacy URLs to current structure
    // Fixes 287+ 404 errors from old URL patterns in Google Search Console
    redirects: async () => [
        // Old /collections/ prefix URLs -> remove /collections/ segment
        {
            source: '/:locale(en|bg)/collections/hybrid-wood/:pattern/:slug',
            destination: '/:locale/hybrid-wood/:pattern/:slug',
            permanent: true,
        },
        {
            source: '/:locale(en|bg)/collections/click-vinyl/:pattern/:slug',
            destination: '/:locale/click-vinyl/:pattern/:slug',
            permanent: true,
        },
        {
            source: '/:locale(en|bg)/collections/glue-down-vinyl/:pattern/:slug',
            destination: '/:locale/glue-down-vinyl/:pattern/:slug',
            permanent: true,
        },
        {
            source: '/:locale(en|bg)/collections/oak/:pattern/:slug',
            destination: '/:locale/oak/:pattern/:slug',
            permanent: true,
        },
        // Old pattern collection pages (without product slug)
        {
            source: '/:locale(en|bg)/collections/hybrid-wood/:pattern',
            destination: '/:locale/hybrid-wood/:pattern',
            permanent: true,
        },
        {
            source: '/:locale(en|bg)/collections/click-vinyl/:pattern',
            destination: '/:locale/click-vinyl/:pattern',
            permanent: true,
        },
        {
            source: '/:locale(en|bg)/collections/glue-down-vinyl/:pattern',
            destination: '/:locale/glue-down-vinyl/:pattern',
            permanent: true,
        },
        {
            source: '/:locale(en|bg)/collections/oak/:pattern',
            destination: '/:locale/oak/:pattern',
            permanent: true,
        },
        // Old pattern names (fishbone, plank) -> collection landing page
        {
            source: '/:locale(en|bg)/hybrid-wood/fishbone/:slug',
            destination: '/:locale/hybrid-wood',
            permanent: true,
        },
        {
            source: '/:locale(en|bg)/hybrid-wood/plank/:slug',
            destination: '/:locale/hybrid-wood',
            permanent: true,
        },
        {
            source: '/:locale(en|bg)/hybrid-wood/fishbone',
            destination: '/:locale/hybrid-wood',
            permanent: true,
        },
        {
            source: '/:locale(en|bg)/hybrid-wood/plank',
            destination: '/:locale/hybrid-wood',
            permanent: true,
        },
        // No-locale-prefix URLs are handled by the next-intl middleware,
        // which redirects to the user's NEXT_LOCALE cookie preference or bg (defaultLocale).
    ],
    // Cache optimization for Firebase App Hosting
    // Note: /_next/static is already handled automatically by Next.js (content-hashed, immutable)
    headers: async () => [
        {
            // Cache images for 1 year
            source: '/images/:path*',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, s-maxage=31536000, immutable',
                },
            ],
        },
        {
            // Cache fonts for 1 year
            source: '/fonts/:path*',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, s-maxage=31536000, immutable',
                },
            ],
        },
    ],
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
