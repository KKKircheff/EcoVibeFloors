import type {MetadataRoute} from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ecovibefloors.com';

const disallow = [
    '/api/',
    '/bg/admin',
    '/en/admin',
    '/bg/auth',
    '/en/auth',
    '/bg/chat',
    '/en/chat',
    '/bg/sample-basket',
    '/en/sample-basket',
];

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: '*', allow: '/', disallow },
            // AI citation crawlers — explicit allow so the policy is unambiguous.
            { userAgent: 'GPTBot', allow: '/', disallow },
            { userAgent: 'ChatGPT-User', allow: '/', disallow },
            { userAgent: 'OAI-SearchBot', allow: '/', disallow },
            { userAgent: 'ClaudeBot', allow: '/', disallow },
            { userAgent: 'Claude-Web', allow: '/', disallow },
            { userAgent: 'PerplexityBot', allow: '/', disallow },
            { userAgent: 'Google-Extended', allow: '/', disallow },
            { userAgent: 'Applebot-Extended', allow: '/', disallow },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
