import type {Firestore} from 'firebase-admin/firestore';
import {FieldValue} from 'firebase-admin/firestore';
import type {ChunkMetadata} from '@/lib/chat-ai-assistant/types';
import {embedText, EMBEDDING_DIMENSIONS} from '@/lib/ai/config';

export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateEmbeddingWithRetry(text: string, maxRetries = 3): Promise<number[]> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await embedText(text);
        } catch (error: any) {
            const is429 =
                error.message?.includes('429') ||
                error.message?.includes('rate limit') ||
                error.message?.includes('capacity exceeded');

            if (is429 && attempt < maxRetries) {
                const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 30000);
                console.log(`  ⏳ Rate limit hit, retrying in ${backoffDelay}ms (attempt ${attempt}/${maxRetries})...`);
                await sleep(backoffDelay);
                continue;
            }

            throw error;
        }
    }

    throw new Error('Failed to generate embedding after retries');
}

export async function embeddingExists(
    db: Firestore,
    sourceId: string,
    locale: string,
    skipExisting: boolean
): Promise<boolean> {
    if (!skipExisting) return false;

    try {
        const snapshot = await db
            .collection('project-knowledge')
            .where('sourceId', '==', sourceId)
            .where('locale', '==', locale)
            .limit(1)
            .get();

        return !snapshot.empty;
    } catch (error) {
        console.error(`  ⚠️  Failed to check if embedding exists:`, error);
        return false;
    }
}

export async function uploadChunk(
    db: Firestore | null,
    chunk: ChunkMetadata,
    batchIndex: number,
    isDryRun: boolean,
    skipExisting: boolean
): Promise<boolean> {
    try {
        if (skipExisting && db && (await embeddingExists(db, chunk.sourceId, chunk.locale, skipExisting))) {
            console.log(`  ⊙ Skipped (exists): ${chunk.sourceTitle.substring(0, 50)}...`);
            return false;
        }

        const embedding = await generateEmbeddingWithRetry(chunk.text);

        if (isDryRun) {
            console.log(
                `  [DRY RUN] Would upload: ${chunk.sourceTitle.substring(0, 50)}... (${embedding.length} dims)`
            );
            return false;
        }

        await db!.collection('project-knowledge').add({
            text: chunk.text,
            embedding: FieldValue.vector(embedding),
            locale: chunk.locale,
            contentType: chunk.contentType,
            category: chunk.category,
            sourceId: chunk.sourceId,
            sourceUrl: chunk.sourceUrl,
            sourceTitle: chunk.sourceTitle,
            productSku: chunk.productSku || null,
            price: chunk.price || null,
            imageUrl: chunk.imageUrl || null,
            productData: chunk.productData || null,
            createdAt: FieldValue.serverTimestamp(),
        });

        console.log(`  ✓ Uploaded (${batchIndex}): ${chunk.sourceTitle.substring(0, 50)}...`);
        return true;
    } catch (error) {
        console.error(`  ✗ Failed to upload chunk:`, error);
        throw error;
    }
}

export interface EmbeddingScriptArgs {
    isDryRun: boolean;
    skipExisting: boolean;
    delayMs: number;
    verbose: boolean;
}

export function parseCommonArgs(args: string[]): EmbeddingScriptArgs {
    return {
        isDryRun: args.includes('--dry-run'),
        skipExisting: args.includes('--skip-existing'),
        delayMs: parseInt(args.find((arg) => arg.startsWith('--delay='))?.split('=')[1] || '100'),
        verbose: args.includes('--verbose'),
    };
}

export function printScriptHeader(
    scriptName: string,
    args: EmbeddingScriptArgs,
    additionalInfo?: Record<string, string>
) {
    console.log(`\n🚀 Starting ${scriptName}\n`);
    console.log(`Mode: ${args.isDryRun ? 'DRY RUN (no uploads)' : 'LIVE (will upload to Firestore)'}`);
    console.log(`Embedding model: gemini-embedding-001 (${EMBEDDING_DIMENSIONS} dimensions)`);
    console.log(`Rate limit delay: ${args.delayMs}ms between requests`);
    console.log(`Skip existing: ${args.skipExisting ? 'YES' : 'NO'}`);

    if (additionalInfo) {
        Object.entries(additionalInfo).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        });
    }

    console.log('');
}

export function printSummary(
    totalChunks: number,
    uploadedCount: number,
    skippedCount: number,
    isDryRun: boolean,
    skipExisting: boolean
) {
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Done! Processed ${totalChunks} chunks`);
    console.log('='.repeat(50));
    console.log(`\n📊 Statistics:`);

    if (isDryRun) {
        console.log(`   • Would have uploaded: ${totalChunks} chunks`);
    } else {
        console.log(`   • Uploaded: ${uploadedCount} chunks`);
        if (skipExisting) {
            console.log(`   • Skipped (already exist): ${skippedCount} chunks`);
        }
        console.log(`   • Total processed: ${totalChunks} chunks`);
    }

    console.log('');

    if (isDryRun) {
        console.log('To upload for real, run without --dry-run flag\n');
    } else if (uploadedCount > 0) {
        console.log('Next steps:');
        console.log('1. Create Firestore vector index (see documentation)');
        console.log('2. Wait for index to build (~5-15 minutes)');
        console.log('3. Test vector search with test script\n');
    }
}
