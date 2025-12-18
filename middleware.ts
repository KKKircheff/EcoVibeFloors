import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {NextRequest, NextResponse} from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const {pathname, hostname} = request.nextUrl;

    // Redirect from Firebase default domain to custom domain (if Google OAuth redirects to wrong domain)
    // This is a safety net in case authDomain is not set correctly
    if (hostname.includes('firebaseapp.com') && (pathname.includes('/__/auth') || pathname.includes('/__/firebase'))) {
        const customDomainUrl = new URL(request.url);
        customDomainUrl.hostname = 'ecovibefloors.com';
        return NextResponse.redirect(customDomainUrl);
    }

    // Skip middleware for Firebase auth handler routes
    // These need to work at both /__/auth/handler and /[locale]/__/auth/handler
    if (pathname.includes('/__/auth') || pathname.includes('/__/firebase')) {
        return NextResponse.next();
    }

    // Redirect /[locale]/collections/[...path] → /[locale]/[...path]
    // Fixes 287 404 errors from old URL structure
    const collectionsRegex = /^\/([a-z]{2})\/collections\/(.+)$/;
    const match = pathname.match(collectionsRegex);

    if (match) {
        const [, locale, restOfPath] = match;
        const newUrl = new URL(request.url);
        newUrl.pathname = `/${locale}/${restOfPath}`;

        // 301 Permanent Redirect for SEO
        return NextResponse.redirect(newUrl, 301);
    }

    // Remove accept-language header to prevent browser language detection
    // This ensures only cookie (NEXT_LOCALE) and defaultLocale are used
    request.headers.set('accept-language', '');
    return intlMiddleware(request);
}

export const config = {
    // Exclude /api, /_next, /_vercel, and static files
    matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
