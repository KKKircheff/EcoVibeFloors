/**
 * Server-side Firestore product queries using the Admin SDK.
 * Used in generateStaticParams and Server Components — never imported client-side.
 *
 * Firestore document ID = product slug (e.g. "oak-a0000120").
 * This enables O(1) lookups by slug on public product pages.
 */
import 'server-only';
import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { Product } from '@/types/products';

const COLLECTION = 'products';

/**
 * Strip Firestore Timestamps (e.g. seededAt) from document data before passing
 * to Server/Client Components. Timestamps are not plain objects and will cause
 * "Only plain objects can be passed to Client Components" errors.
 */
function serialize(data: FirebaseFirestore.DocumentData): Record<string, unknown> {
    return Object.fromEntries(
        Object.entries(data).filter(([, v]) => !(v instanceof Timestamp))
    );
}

/** Fetch a single product by its slug (direct document ID lookup). */
export async function getProductBySlug(slug: string): Promise<Product | null> {
    const snap = await adminDb.collection(COLLECTION).doc(slug).get();
    if (!snap.exists) return null;
    return { ...serialize(snap.data()!), slug: snap.id } as Product;
}

/**
 * Fetch all products — used in generateStaticParams to enumerate every page.
 * Filtering in JS avoids requiring composite Firestore indexes at build time.
 */
export async function getAllProducts(): Promise<Product[]> {
    const snap = await adminDb.collection(COLLECTION).get();
    return snap.docs.map((d) => ({ ...serialize(d.data()), slug: d.id })) as Product[];
}

/**
 * Fetch products for a specific collection + pattern combo.
 * Used in pattern-level pages (e.g. /oak/plank) and their generateStaticParams.
 * Requires a composite Firestore index on (collection ASC, pattern ASC).
 * Firestore will include a link to create the index in the error message on first run.
 */
export async function getProductsByCollectionAndPattern(
    collection: string,
    pattern: string
): Promise<Product[]> {
    const snap = await adminDb
        .collection(COLLECTION)
        .where('collection', '==', collection)
        .where('pattern', '==', pattern)
        .get();
    return snap.docs.map((d) => ({ ...serialize(d.data()), slug: d.id })) as Product[];
}

/** Fetch all products in a collection (for collection landing pages). */
export async function getProductsByCollection(collection: string): Promise<Product[]> {
    const snap = await adminDb
        .collection(COLLECTION)
        .where('collection', '==', collection)
        .get();
    return snap.docs.map((d) => ({ ...serialize(d.data()), slug: d.id })) as Product[];
}
