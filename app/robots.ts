import type {MetadataRoute} from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ecovibefloors.com';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/_next/',
                    '/api/',
                    '/bg/auth',
                    '/en/auth',
                    '/bg/chat',
                    '/en/chat',
                    '/bg/sample-basket',
                    '/en/sample-basket',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
