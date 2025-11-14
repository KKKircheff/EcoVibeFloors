/**
 * Product Embedding Generation Script
 *
 * This script:
 * 1. Loads product collections from TypeScript files
 * 2. Converts products to natural language descriptions (single chunk per product)
 * 3. Generates 1536-dim embeddings with Azure OpenAI (text-embedding-3-small model)
 * 4. Uploads to Firestore with native vector fields
 *
 * Usage:
 *   npx tsx utils/embedding-scripts/embed-products.ts
 *   npx tsx utils/embedding-scripts/embed-products.ts --dry-run
 *   npx tsx utils/embedding-scripts/embed-products.ts --collection=hybrid-wood
 *   npx tsx utils/embedding-scripts/embed-products.ts --delay=1000
 *   npx tsx utils/embedding-scripts/embed-products.ts --skip-existing
 *   npx tsx utils/embedding-scripts/embed-products.ts --skip-existing --delay=1000
 */

import 'dotenv/config'; // Load environment variables
import {initializeFirebaseAdmin, getFirestoreAdmin} from '@/lib/firebase/firebase-admin';
import {getAzureEmbeddings} from '@/lib/azure/azure-ai';
import type {ChunkMetadata} from '@/lib/chat-ai-assistant/types';
import {
    parseCommonArgs,
    printScriptHeader,
    printSummary,
    uploadChunk,
    sleep,
} from './shared/embedding-utils';
import {getStorageUrl} from '@/lib/utils/getStorageUrl';

// Import product collections
import {hyWoodCollection} from '@/collections/hy-wood';
import {clickVinylCollection} from '@/collections/click-vinyl';
import {glueDownVinylCollection} from '@/collections/glue-down-vinyl';
import {oakCollection} from '@/collections/oak';

// Parse command line arguments
const args = process.argv.slice(2);
const commonArgs = parseCommonArgs(args);
const collectionFilter = args.find((arg) => arg.startsWith('--collection='))?.split('=')[1];

// Initialize Firebase Admin SDK (only if not dry run)
let db: ReturnType<typeof getFirestoreAdmin> | null = null;
if (!commonArgs.isDryRun) {
    initializeFirebaseAdmin();
    db = getFirestoreAdmin();
}

// Initialize Azure OpenAI embeddings (1536 dimensions)
const embeddings = getAzureEmbeddings();

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
        sourceUrl: `/${locale}/${product.collection}/${product.pattern}/${product.slug}`,
        sourceTitle: localizedData.name,
        productSku: product.sku,
        price: product.price,
        imageUrl: getStorageUrl(product.collection, product.pattern, product.sku, product.images[0]).full,
        productData: JSON.stringify(product),
    };
}

/**
 * Main execution
 */
async function main() {
    printScriptHeader('Product Embedding Generation', embeddings, commonArgs, {
        'Collection filter': collectionFilter || 'ALL',
    });

    let totalChunks = 0;
    let uploadedCount = 0;
    let skippedCount = 0;

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
            const enUploaded = await uploadChunk(
                db,
                embeddings,
                enChunk,
                totalChunks + 1,
                commonArgs.isDryRun,
                commonArgs.skipExisting
            );
            totalChunks++;
            if (enUploaded) uploadedCount++;
            else if (commonArgs.skipExisting) skippedCount++;

            const bgUploaded = await uploadChunk(
                db,
                embeddings,
                bgChunk,
                totalChunks + 1,
                commonArgs.isDryRun,
                commonArgs.skipExisting
            );
            totalChunks++;
            if (bgUploaded) uploadedCount++;
            else if (commonArgs.skipExisting) skippedCount++;

            // Delay to avoid rate limits (configurable via --delay flag)
            await sleep(commonArgs.delayMs);
        }

        console.log();
    }

    printSummary(totalChunks, uploadedCount, skippedCount, commonArgs.isDryRun, commonArgs.skipExisting);
}

// Run the script
main().catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
});
