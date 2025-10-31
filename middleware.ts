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
        console.log('🔄 Middleware: Redirecting Firebase auth from', hostname, 'to ecovibefloors.com');
        return NextResponse.redirect(customDomainUrl);
    }

    // Skip middleware for Firebase auth handler routes
    // These need to work at both /__/auth/handler and /[locale]/__/auth/handler
    if (pathname.includes('/__/auth') || pathname.includes('/__/firebase')) {
        console.log('🔥 Middleware: Skipping Firebase auth path:', pathname);
        return NextResponse.next();
    }

    console.log('🌐 Middleware: Processing i18n for path:', pathname);

    // Remove accept-language header to prevent browser language detection
    // This ensures only cookie (NEXT_LOCALE) and defaultLocale are used
    request.headers.set('accept-language', '');
    return intlMiddleware(request);
}

export const config = {
    // Exclude /api, /_next, /_vercel, and static files
    matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
