/**
 * Firebase Init Config Proxy
 *
 * This route proxies Firebase initialization config requests to Firebase's backend.
 * Required for Firebase Auth SDK to retrieve configuration when using custom authDomain.
 *
 * Firebase expects this endpoint at: /__/firebase/init.json
 */

import {NextRequest, NextResponse} from 'next/server';

const FIREBASE_INIT_URL = 'https://ecovibe-floors.firebaseapp.com/__/firebase/init.json';

export async function GET(request: NextRequest) {
    console.log('---- IN  /app/api firebase -------------');
    try {
        const {searchParams} = request.nextUrl;

        // Build the Firebase init URL with all parameters
        const firebaseUrl = new URL(FIREBASE_INIT_URL);
        searchParams.forEach((value, key) => {
            firebaseUrl.searchParams.append(key, value);
        });

        console.log('🔧 Firebase Init Proxy: Fetching config from Firebase');

        // Forward the request to Firebase
        const firebaseResponse = await fetch(firebaseUrl.toString(), {
            method: 'GET',
            headers: {
                'User-Agent': request.headers.get('user-agent') || '',
            },
        });

        const config = await firebaseResponse.json();

        console.log('✅ Firebase Init Proxy: Config received');

        // Return the config with proper headers
        return NextResponse.json(config, {
            status: firebaseResponse.status,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });
    } catch (error) {
        console.error('❌ Firebase Init Proxy: Error:', error);
        return NextResponse.json({error: 'Firebase init proxy error'}, {status: 500});
    }
}
