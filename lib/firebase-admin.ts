/**
 * Firebase Admin SDK singleton — server-only.
 *
 * Credentials resolution:
 * - Local dev: uses FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY from .env
 * - Firebase App Hosting: uses Application Default Credentials (ADC) automatically
 */
import 'server-only';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
        // Local dev: explicit service account from env vars
        initializeApp({
            credential: cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail,
                // The private key stored in .env has literal \n — replace with real newlines
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
        });
    } else {
        // Firebase App Hosting: ADC provides credentials automatically
        initializeApp();
    }
}

export const adminDb = getFirestore();
