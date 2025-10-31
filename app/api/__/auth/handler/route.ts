/**
 * Firebase Auth Handler Proxy
 *
 * This route proxies Firebase Authentication handler requests to Firebase's backend.
 * Required for signInWithRedirect() to work when authDomain matches the app domain.
 *
 * Firebase expects this endpoint at: /__/auth/handler
 * This allows auth to complete on the same domain as the app (ecovibefloors.com)
 * preventing getRedirectResult() from returning null.
 */

import {NextRequest, NextResponse} from 'next/server';

const FIREBASE_AUTH_HANDLER_URL = 'https://ecovibe-floors.firebaseapp.com/__/auth/handler';

export async function GET(request: NextRequest) {
    console.log('---- IN  /app/api firebase -------------');
    try {
        // Get all query parameters from the incoming request
        const {searchParams} = request.nextUrl;

        // Build the Firebase auth handler URL with all parameters
        const firebaseUrl = new URL(FIREBASE_AUTH_HANDLER_URL);
        searchParams.forEach((value, key) => {
            firebaseUrl.searchParams.append(key, value);
        });

        console.log('🔐 Auth Handler Proxy: Forwarding to Firebase:', firebaseUrl.toString());

        // Forward the request to Firebase
        const firebaseResponse = await fetch(firebaseUrl.toString(), {
            method: 'GET',
            headers: {
                'User-Agent': request.headers.get('user-agent') || '',
            },
        });

        // Get the response body
        const body = await firebaseResponse.text();

        // Get response headers
        const headers = new Headers();
        firebaseResponse.headers.forEach((value, key) => {
            // Copy relevant headers from Firebase response
            if (
                !key.toLowerCase().startsWith('x-') &&
                key.toLowerCase() !== 'content-encoding' &&
                key.toLowerCase() !== 'transfer-encoding'
            ) {
                headers.set(key, value);
            }
        });

        console.log('✅ Auth Handler Proxy: Response received from Firebase');

        // Return the Firebase response
        return new NextResponse(body, {
            status: firebaseResponse.status,
            headers,
        });
    } catch (error) {
        console.error('❌ Auth Handler Proxy: Error:', error);
        return NextResponse.json({error: 'Auth handler proxy error'}, {status: 500});
    }
}

export async function POST(request: NextRequest) {
    try {
        const {searchParams} = request.nextUrl;
        const body = await request.text();

        const firebaseUrl = new URL(FIREBASE_AUTH_HANDLER_URL);
        searchParams.forEach((value, key) => {
            firebaseUrl.searchParams.append(key, value);
        });

        console.log('🔐 Auth Handler Proxy (POST): Forwarding to Firebase');

        const firebaseResponse = await fetch(firebaseUrl.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': request.headers.get('content-type') || 'application/json',
                'User-Agent': request.headers.get('user-agent') || '',
            },
            body,
        });

        const responseBody = await firebaseResponse.text();

        const headers = new Headers();
        firebaseResponse.headers.forEach((value, key) => {
            if (
                !key.toLowerCase().startsWith('x-') &&
                key.toLowerCase() !== 'content-encoding' &&
                key.toLowerCase() !== 'transfer-encoding'
            ) {
                headers.set(key, value);
            }
        });

        console.log('✅ Auth Handler Proxy (POST): Response received');

        return new NextResponse(responseBody, {
            status: firebaseResponse.status,
            headers,
        });
    } catch (error) {
        console.error('❌ Auth Handler Proxy (POST): Error:', error);
        return NextResponse.json({error: 'Auth handler proxy error'}, {status: 500});
    }
}
