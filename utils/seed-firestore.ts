/**
 * Firestore product seeding script — reusable whenever new products need uploading.
 *
 * Usage:
 *   npm run seed              — upload all collections
 *   npm run seed:dry          — dry run (no writes, just shows what would be uploaded)
 *   npm run seed -- --collection=oak   — upload only the oak collection
 *
 * Requirements:
 *   - FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY must be set in .env
 *   - Or GOOGLE_APPLICATION_CREDENTIALS pointing to a service account JSON
 *
 * Document ID = product slug (e.g. "oak-a0000120") so public pages can do O(1) lookups.
 * Uses setDoc with merge:true — safe to re-run, will not overwrite unrelated fields.
 */

import * as dotenv from 'dotenv';
dotenv.config({path: '.env'});
dotenv.config({path: '.env.local', override: true});

import {cert, getApps, initializeApp} from 'firebase-admin/app';
import {getFirestore, FieldValue} from 'firebase-admin/firestore';

// ── Collection imports ─────────────────────────────────────────────────────────
import {oakCollection} from '../collections/oak.js';
import {clickVinylCollection} from '../collections/click-vinyl.js';
import {glueDownVinylCollection} from '../collections/glue-down-vinyl.js';
import {hyWoodCollection} from '../collections/hy-wood.js';

// ── Types ──────────────────────────────────────────────────────────────────────
import type {Product} from '../types/products.js';

// ── Firebase Admin init ────────────────────────────────────────────────────────
if (!getApps().length) {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (clientEmail && privateKey) {
        initializeApp({
            credential: cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, '\n'),
            }),
        });
    } else {
        initializeApp();
    }
}

const db = getFirestore();
const COLLECTION = 'products';

// ── CLI args ───────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const collectionArg = args.find((a) => a.startsWith('--collection='))?.split('=')[1];

// ── Source data ────────────────────────────────────────────────────────────────
const allSources: {name: string; products: Product[]}[] = [
    {name: 'oak', products: oakCollection.products},
    {name: 'click-vinyl', products: clickVinylCollection.products},
    {name: 'glue-down-vinyl', products: glueDownVinylCollection.products},
    {name: 'hy-wood', products: hyWoodCollection.products},
];

const sources = collectionArg ? allSources.filter((s) => s.name === collectionArg) : allSources;

if (sources.length === 0) {
    console.error(`Unknown collection: "${collectionArg}". Valid: oak, click-vinyl, glue-down-vinyl, hy-wood`);
    process.exit(1);
}

// ── Seed ───────────────────────────────────────────────────────────────────────
async function seed() {
    console.log(isDryRun ? '🔍 DRY RUN — no writes will be made\n' : '🚀 Seeding Firestore...\n');

    let totalUploaded = 0;

    for (const source of sources) {
        const {name, products} = source;
        console.log(`Seeding ${name}... (${products.length} products)`);

        if (!isDryRun) {
            // Upload in batches of 500 (Firestore batch limit)
            const BATCH_SIZE = 500;
            for (let i = 0; i < products.length; i += BATCH_SIZE) {
                const batch = db.batch();
                const chunk = products.slice(i, i + BATCH_SIZE);

                for (const product of chunk) {
                    if (!product.slug) {
                        console.warn(`  ⚠ Skipping product without slug: ${product.sku}`);
                        continue;
                    }
                    const docRef = db.collection(COLLECTION).doc(product.slug);
                    // merge:true preserves any extra admin-panel fields not in the TS constants
                    batch.set(
                        docRef,
                        {
                            ...product,
                            seededAt: FieldValue.serverTimestamp(),
                        },
                        {merge: true},
                    );
                }

                await batch.commit();
            }
        } else {
            for (const product of products) {
                console.log(`  → ${product.slug} (${product.sku})`);
            }
        }

        totalUploaded += products.length;
        console.log(`  ✓ ${products.length} products ${isDryRun ? 'would be uploaded' : 'uploaded'}`);
    }

    console.log(`\n✅ Done. ${totalUploaded} total products ${isDryRun ? 'would be seeded' : 'seeded'}.`);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
