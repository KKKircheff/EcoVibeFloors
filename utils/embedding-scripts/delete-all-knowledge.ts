/**
 * Delete All Knowledge Script
 *
 * WARNING: This script deletes ALL documents from the 'project-knowledge' collection.
 * Use with extreme caution!
 *
 * The collection itself will remain, only the documents are deleted.
 *
 * Usage:
 *   npx tsx utils/embedding-scripts/delete-all-knowledge.ts
 *   npx tsx utils/embedding-scripts/delete-all-knowledge.ts --verbose
 */

import 'dotenv/config';
import { initializeFirebaseAdmin, getFirestoreAdmin } from '@/lib/firebase/firebase-admin';
import { sleep } from './shared/embedding-utils';

const COLLECTION_NAME = 'project-knowledge';
const BATCH_SIZE = 500; // Firestore batch write limit

interface DeleteStats {
    totalDeleted: number;
    batchesProcessed: number;
    startTime: number;
}

/**
 * Delete all documents from a collection in batches
 */
async function deleteAllDocuments(verbose: boolean): Promise<DeleteStats> {
    const db = getFirestoreAdmin();
    const stats: DeleteStats = {
        totalDeleted: 0,
        batchesProcessed: 0,
        startTime: Date.now(),
    };

    console.log(`\n🗑️  Starting deletion of all documents from '${COLLECTION_NAME}' collection...\n`);

    let hasMore = true;
    while (hasMore) {
        // Fetch batch of documents
        const snapshot = await db.collection(COLLECTION_NAME).limit(BATCH_SIZE).get();

        if (snapshot.empty) {
            hasMore = false;
            break;
        }

        // Create batch delete
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
            if (verbose) {
                console.log(`  🗑️  Deleting document: ${doc.id}`);
            }
        });

        // Commit batch
        await batch.commit();

        stats.totalDeleted += snapshot.size;
        stats.batchesProcessed++;

        console.log(`  ✓ Deleted batch ${stats.batchesProcessed}: ${snapshot.size} documents (Total: ${stats.totalDeleted})`);

        // Small delay to avoid overwhelming Firestore
        await sleep(100);
    }

    return stats;
}

/**
 * Print final statistics
 */
function printStats(stats: DeleteStats) {
    const elapsedMs = Date.now() - stats.startTime;
    const elapsedSec = (elapsedMs / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Deletion Complete!');
    console.log('='.repeat(60));
    console.log(`\n📊 Statistics:`);
    console.log(`   • Total documents deleted: ${stats.totalDeleted}`);
    console.log(`   • Batches processed: ${stats.batchesProcessed}`);
    console.log(`   • Time elapsed: ${elapsedSec}s`);
    console.log(`   • Collection '${COLLECTION_NAME}' is now empty (collection still exists)`);
    console.log('');
}

/**
 * Main execution
 */
async function main() {
    try {
        // Parse arguments
        const args = process.argv.slice(2);
        const verbose = args.includes('--verbose');

        // Initialize Firebase Admin
        console.log('\n🔥 Initializing Firebase Admin SDK...');
        initializeFirebaseAdmin();

        // Delete all documents
        const stats = await deleteAllDocuments(verbose);

        // Print summary
        printStats(stats);

        console.log('✅ Ready to re-embed knowledge from zero!\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Error during deletion:', error);
        process.exit(1);
    }
}

main();
