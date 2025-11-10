import {initializeApp, cert, getApps, type App} from 'firebase-admin/app';
import {getFirestore, type Firestore} from 'firebase-admin/firestore';

let firebaseAdminApp: App | null = null;

interface InitOptions {
    forceReinit?: boolean;
}

export function initializeFirebaseAdmin(options: InitOptions = {}): App {
    const {forceReinit = false} = options;

    if (!forceReinit && getApps().length > 0) {
        firebaseAdminApp = getApps()[0];
        return firebaseAdminApp;
    }

    try {
        // Check for required environment variables
        if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
            throw new Error(
                'Firebase Admin credentials not found. ' +
                    'Please set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables.'
            );
        }

        // Handle private key formatting
        // Firebase App Hosting may pass the key with actual newlines or escaped \n
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;
        const formattedPrivateKey = privateKey.includes('\\n')
            ? privateKey.replace(/\\n/g, '\n')  // Has escaped newlines, convert them
            : privateKey;                        // Already has real newlines, use as-is

        firebaseAdminApp = initializeApp({
            credential: cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: formattedPrivateKey,
            }),
        });
        return firebaseAdminApp;
    } catch (error) {
        console.error('Firebase Admin initialization failed:', error);
        throw error;
    }
}

export function getFirestoreAdmin(): Firestore {
    if (!firebaseAdminApp && getApps().length === 0) {
        initializeFirebaseAdmin();
    }

    return getFirestore();
}

export function getFirebaseAdminApp(): App {
    if (!firebaseAdminApp && getApps().length === 0) {
        initializeFirebaseAdmin();
    }

    return firebaseAdminApp || getApps()[0];
}
