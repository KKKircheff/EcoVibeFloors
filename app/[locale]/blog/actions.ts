'use server';

import { headers } from 'next/headers';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 80;

const ALLOWED_ORIGINS = new Set([
    'https://ecovibefloors.com',
    'https://www.ecovibefloors.com',
    ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000'] : []),
]);

export async function subscribeToNewsletter(
    email: string,
    language: 'en' | 'bg',
    userId?: string
): Promise<{ success: boolean; error?: string }> {
    // Verify the request originates from our own app
    const headersList = await headers();
    const origin = headersList.get('origin') ?? '';
    if (!ALLOWED_ORIGINS.has(origin)) {
        return { success: false, error: 'forbidden' };
    }

    // Validate email
    const normalized = email.toLowerCase().trim();
    if (!normalized || normalized.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(normalized)) {
        return { success: false, error: 'invalid_email' };
    }

    try {
        const docRef = adminDb.collection('newsletters').doc(normalized);
        const existing = await docRef.get();

        // Only write new subscriptions — never overwrite existing records
        if (existing.exists) {
            return { success: true };
        }

        await docRef.set({
            email: normalized,
            language,
            source: 'blog',
            ...(userId ? { userId } : {}),
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        return { success: true };
    } catch {
        return { success: false, error: 'server_error' };
    }
}
