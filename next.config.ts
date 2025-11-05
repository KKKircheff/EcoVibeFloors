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
    // Cache optimization for Firebase App Hosting
    headers: async () => [
        {
            // Cache static assets aggressively
            source: '/_next/static/:path*',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, s-maxage=31536000, immutable',
                },
            ],
        },
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
