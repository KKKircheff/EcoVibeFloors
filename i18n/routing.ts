import {defineRouting} from 'next-intl/routing';

export type PathNames = '/' | '/collections' | '/contact' | '/blog' | '/oak' | '/custom-oak' | '/hybrid-wood' | '/vinyl';

export type NavRoute = {
    name: string;
    path: PathNames;
    icon: string | undefined;
    visible: boolean;
    submenu?: NavRoute[];
};

export const navRoutes: NavRoute[] = [
    {
        name: 'Home',
        path: '/',
        icon: '',
        visible: true,
    },
    {
        name: 'Collections',
        path: '/collections',
        icon: '',
        visible: true,
        submenu: [
            {
                name: 'Premium Oak',
                path: '/oak',
                icon: '',
                visible: true,
            },
            {
                name: 'Premium Oak Custom Crafted',
                path: '/custom-oak',
                icon: '',
                visible: true,
            },
            {
                name: 'Hybrid Wood',
                path: '/hybrid-wood',
                icon: '',
                visible: true,
            },
            {
                name: 'Vinyl',
                path: '/vinyl',
                icon: '',
                visible: true,
            },
            {
                name: 'All Collections',
                path: '/collections',
                icon: '',
                visible: true,
            },
        ],
    },
    {
        name: 'Contact',
        path: '/contact',
        icon: '',
        visible: true,
    },
    {
        name: 'Blog',
        path: '/blog',
        icon: '',
        visible: true,
    },
];

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'bg'],

    // Used when no locale matches
    defaultLocale: 'bg',

    // Prefix all paths with locale
    localePrefix: 'always',
});

// Type definitions for better TypeScript support
export type Locale = (typeof routing.locales)[number];
