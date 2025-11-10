/**
 * Embedding Generation Script (Run Locally)
 *
 * This script:
 * 1. Loads product collections from TypeScript files
 * 2. Scrapes website pages with Jina.ai Reader API (with retry logic)
 * 3. Converts products to natural language descriptions (single chunk per product)
 * 4. Generates 1536-dim embeddings with Azure OpenAI (text-embedding-3-small model)
 * 5. Uploads to Firestore with native vector fields
 *
 * Usage:
 *   npx tsx utils/chat-ai-assistant/generate-embeddings.ts
 *   npx tsx utils/chat-ai-assistant/generate-embeddings.ts --dry-run
 *   npx tsx utils/chat-ai-assistant/generate-embeddings.ts --collection=hybrid-wood
 *   npx tsx utils/chat-ai-assistant/generate-embeddings.ts --delay=1000
 *   npx tsx utils/chat-ai-assistant/generate-embeddings.ts --skip-existing
 *   npx tsx utils/chat-ai-assistant/generate-embeddings.ts --skip-existing --delay=1000
 */

import 'dotenv/config'; // Load environment variables
import {initializeFirebaseAdmin, getFirestoreAdmin} from '@/lib/firebase/firebase-admin';
import {getAzureEmbeddings} from '@/lib/azure/azure-ai';
import {FieldValue} from 'firebase-admin/firestore';
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters';
import type {ChunkMetadata, PageToScrape} from '@/lib/chat-ai-assistant/types';
import {PAGES_TO_SCRAPE} from './pages-to-scrape';

// Import product collections
import {hyWoodCollection} from '@/collections/hy-wood';
import {clickVinylCollection} from '@/collections/click-vinyl';
import {glueDownVinylCollection} from '@/collections/glue-down-vinyl';
import {oakCollection} from '@/collections/oak';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const skipExisting = args.includes('--skip-existing');
const collectionFilter = args.find((arg) => arg.startsWith('--collection='))?.split('=')[1];
const delayMs = parseInt(args.find((arg) => arg.startsWith('--delay='))?.split('=')[1] || '100');

// Initialize Firebase Admin SDK (only if not dry run)
// Requires FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables
let db: ReturnType<typeof getFirestoreAdmin> | null = null;
if (!isDryRun) {
    initializeFirebaseAdmin();
    db = getFirestoreAdmin();
}

// Initialize Azure OpenAI embeddings (1536 dimensions)
const embeddings = getAzureEmbeddings();

// Initialize text splitter for pages
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 300,
    separators: ['\n\n', '\n', '. ', ' ', ''],
});

/**
 * Convert product to natural language description for embedding
 */
function productToNaturalLanguage(product: any, locale: 'en' | 'bg'): string {
    const localizedData = product.i18n[locale];
    const parts: string[] = [];

    // Header with basic info
    parts.push(`Product: ${localizedData.name} (SKU: ${product.sku})`);
    parts.push(`Price: €${product.price}`);
    parts.push(`Category: ${product.collection}`);
    parts.push(`Installation: ${product.installationSystem}`);
    parts.push('');

    // Description
    if (localizedData.description) {
        parts.push(localizedData.description);
        parts.push('');
    }

    // Features
    if (localizedData.features && localizedData.features.length > 0) {
        parts.push(`Key Features:`);
        localizedData.features.forEach((feature: string) => {
            parts.push(`• ${feature}`);
        });
        parts.push('');
    }

    // Specifications (if available)
    if (product.specifications) {
        const specs = product.specifications;

        // Dimensions
        if (specs.dimensions) {
            parts.push('Specifications:');
            if (specs.dimensions.length) parts.push(`• Length: ${specs.dimensions.length} mm`);
            if (specs.dimensions.width) parts.push(`• Width: ${specs.dimensions.width} mm`);
            if (specs.dimensions.thickness) parts.push(`• Thickness: ${specs.dimensions.thickness} mm`);
        }

        // Performance
        if (specs.performance) {
            if (specs.performance.underfloorHeatingCode) {
                parts.push(`• Underfloor heating: ${specs.performance.underfloorHeatingCode}`);
            }
            if (specs.performance.waterResistanceCode) {
                parts.push(`• Water resistance: ${specs.performance.waterResistanceCode}`);
            }
        }

        // Certifications
        if (specs.certifications) {
            if (specs.certifications.warranty) {
                const warranty =
                    typeof specs.certifications.warranty === 'string'
                        ? specs.certifications.warranty
                        : `${specs.certifications.warranty.residential} (residential), ${specs.certifications.warranty.commercial} (commercial)`;
                parts.push(`• Warranty: ${warranty}`);
            }
            if (specs.certifications.countryCode) {
                parts.push(`• Made in: ${specs.certifications.countryCode}`);
            }
        }
    }

    return parts.join('\n').trim();
}

/**
 * Create single chunk metadata for a product
 */
function createProductChunk(product: any, locale: 'en' | 'bg'): ChunkMetadata {
    const localizedData = product.i18n[locale];
    const text = productToNaturalLanguage(product, locale);

    return {
        text,
        locale,
        contentType: 'product',
        category: product.collection,
        sourceId: product.sku,
        sourceUrl: `/${locale}/${product.collection}/${product.slug}`,
        sourceTitle: localizedData.name,
        productSku: product.sku,
        price: product.price,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/ecovibe-floors.firebasestorage.app/o/products%2F${product.collection}%2F${product.pattern}%2F${product.sku}%2Ffull%2F${product.images[0]}?alt=media`,
        productData: JSON.stringify(product),
    };
}

/**
 * Scrape a page with Jina.ai and chunk with LangChain (with retry logic)
 */
async function scrapeAndChunkPage(page: PageToScrape, maxRetries = 3): Promise<ChunkMetadata[]> {
    console.log(`  Scraping: ${page.url}`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Scrape with Jina.ai Reader API
            const jinaUrl = `https://r.jina.ai/${page.url}`;
            const response = await fetch(jinaUrl, {
                headers: {
                    'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const is429 = response.status === 429;

                if (is429 && attempt < maxRetries) {
                    const backoffDelay = Math.min(5000 * Math.pow(2, attempt), 60000);
                    console.log(
                        `  ⏳ Rate limit hit (Jina.ai), retrying in ${backoffDelay}ms (attempt ${attempt}/${maxRetries})...`
                    );
                    await sleep(backoffDelay);
                    continue;
                }

                throw new Error(`Jina.ai API error: ${response.status}`);
            }

            const data = await response.json();
            const markdown = data.data.content;
            const title = data.data.title;

            // Split with LangChain
            const docs = await textSplitter.createDocuments([markdown]);

            return docs.map((doc: any, index: number) => ({
                text: doc.pageContent,
                locale: page.locale,
                contentType: 'page',
                category: page.category || 'general',
                sourceId: `${page.type}-${page.locale}-${index}`,
                sourceUrl: page.url.replace('https://ecovibefloors.com', ''),
                sourceTitle: title,
            }));
        } catch (error: any) {
            const is429 = error.message?.includes('429') || error.message?.includes('rate limit');

            if (is429 && attempt < maxRetries) {
                const backoffDelay = Math.min(5000 * Math.pow(2, attempt), 60000);
                console.log(
                    `  ⏳ Rate limit hit (Jina.ai), retrying in ${backoffDelay}ms (attempt ${attempt}/${maxRetries})...`
                );
                await sleep(backoffDelay);
                continue;
            }

            console.error(`  ✗ Failed to scrape ${page.url}:`, error);
            return [];
        }
    }

    return [];
}

/**
 * Sleep helper function
 */
async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if embedding already exists in Firestore
 */
async function embeddingExists(sourceId: string, locale: string): Promise<boolean> {
    if (isDryRun || !skipExisting) return false;

    try {
        const snapshot = await db!
            .collection('knowledge-base')
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

/**
 * Generate embedding with retry logic for rate limits
 */
async function generateEmbeddingWithRetry(text: string, maxRetries = 3): Promise<number[]> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await embeddings.embedQuery(text);
        } catch (error: any) {
            const is429 =
                error.message?.includes('429') ||
                error.message?.includes('rate limit') ||
                error.message?.includes('capacity exceeded');

            if (is429 && attempt < maxRetries) {
                const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 30000); // Exponential backoff, max 30s
                console.log(`  ⏳ Rate limit hit, retrying in ${backoffDelay}ms (attempt ${attempt}/${maxRetries})...`);
                await sleep(backoffDelay);
                continue;
            }

            throw error;
        }
    }

    throw new Error('Failed to generate embedding after retries');
}

/**
 * Generate embedding and upload to Firestore
 */
async function uploadChunk(chunk: ChunkMetadata, batchIndex: number): Promise<boolean> {
    try {
        // Check if embedding already exists
        if (skipExisting && (await embeddingExists(chunk.sourceId, chunk.locale))) {
            console.log(`  ⊙ Skipped (exists): ${chunk.sourceTitle.substring(0, 50)}...`);
            return false; // Skipped
        }

        // Generate 1536-dim embedding with Azure OpenAI (with retry logic)
        const embedding = await generateEmbeddingWithRetry(chunk.text);

        if (isDryRun) {
            console.log(
                `  [DRY RUN] Would upload: ${chunk.sourceTitle.substring(0, 50)}... (${embedding.length} dims)`
            );
            return false; // Dry run, not actually uploaded
        }

        // Upload to Firestore with native vector field (Admin SDK)
        await db!.collection('project-knowledge').add({
            text: chunk.text,
            embedding: FieldValue.vector(embedding), // Native Firestore vector
            locale: chunk.locale,
            contentType: chunk.contentType,
            category: chunk.category,
            sourceId: chunk.sourceId,
            sourceUrl: chunk.sourceUrl,
            sourceTitle: chunk.sourceTitle,
            productSku: chunk.productSku || null,
            price: chunk.price || null,
            imageUrl: chunk.imageUrl || null,
            productData: chunk.productData || null, // Full product JSON backup
            createdAt: FieldValue.serverTimestamp(),
        });

        console.log(`  ✓ Uploaded (${batchIndex}): ${chunk.sourceTitle.substring(0, 50)}...`);
        return true; // Successfully uploaded
    } catch (error) {
        console.error(`  ✗ Failed to upload chunk:`, error);
        throw error;
    }
}

/**
 * Main execution
 */
async function main() {
    console.log('\n🚀 Starting Embedding Generation\n');
    console.log(`Mode: ${isDryRun ? 'DRY RUN (no uploads)' : 'LIVE (will upload to Firestore)'}`);
    console.log(`Embedding dimensions: ${embeddings.getDimensions()}`);
    console.log(`Collection filter: ${collectionFilter || 'ALL'}`);
    console.log(`Rate limit delay: ${delayMs}ms between requests`);
    console.log(`Skip existing: ${skipExisting ? 'YES' : 'NO'}\n`);

    let totalChunks = 0;
    let uploadedCount = 0;
    let skippedCount = 0;

    // ====================
    // PROCESS PRODUCTS
    // ====================
    console.log('📦 Processing Product Collections...\n');

    const allCollections = [
        {name: 'hybrid-wood', products: hyWoodCollection.products},
        {name: 'click-vinyl', products: clickVinylCollection.products},
        {name: 'glue-down-vinyl', products: glueDownVinylCollection.products},
        {name: 'oak', products: oakCollection.products},
    ];

    for (const collection of allCollections) {
        // Skip if collection filter is set and doesn't match
        if (collectionFilter && collection.name !== collectionFilter) {
            continue;
        }

        console.log(`  Collection: ${collection.name} (${collection.products.length} products)`);

        for (const product of collection.products) {
            // Create single chunk per locale (2 chunks per product)
            const enChunk = createProductChunk(product, 'en');
            const bgChunk = createProductChunk(product, 'bg');

            // Upload both language versions
            const enUploaded = await uploadChunk(enChunk, totalChunks + 1);
            totalChunks++;
            if (enUploaded) uploadedCount++;
            else if (skipExisting) skippedCount++;

            const bgUploaded = await uploadChunk(bgChunk, totalChunks + 1);
            totalChunks++;
            if (bgUploaded) uploadedCount++;
            else if (skipExisting) skippedCount++;

            // Delay to avoid rate limits (configurable via --delay flag)
            await sleep(delayMs);
        }

        console.log();
    }

    // ====================
    // PROCESS PAGES
    // ====================
    console.log('📄 Processing Website Pages...\n');

    for (const page of PAGES_TO_SCRAPE) {
        const chunks = await scrapeAndChunkPage(page);

        for (const chunk of chunks) {
            const uploaded = await uploadChunk(chunk, totalChunks + 1);
            totalChunks++;
            if (uploaded) uploadedCount++;
            else if (skipExisting) skippedCount++;

            // Delay to avoid rate limits (configurable via --delay flag)
            await sleep(delayMs);
        }
    }

    // ====================
    // SUMMARY
    // ====================
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

// Run the script
main().catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
});
