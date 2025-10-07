import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

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
};

export default withNextIntl(nextConfig);
