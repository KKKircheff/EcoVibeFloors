import {defineRouting} from 'next-intl/routing';

export const navRoutes = [
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

export type PathNames = (typeof navRoutes)[number]['path'];

export type NavRoute = {
    name: string;
    path: PathNames;
    icon: string | undefined;
    visible: boolean;
};

// Type definitions for better TypeScript support
export type Locale = (typeof routing.locales)[number];
