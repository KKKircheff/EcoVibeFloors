import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {NextRequest} from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    // Remove accept-language header to prevent browser language detection
    // This ensures only cookie (NEXT_LOCALE) and defaultLocale are used
    request.headers.set('accept-language', '');
    return intlMiddleware(request);
}

export const config = {
    matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
