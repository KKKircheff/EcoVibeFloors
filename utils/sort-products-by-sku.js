#!/usr/bin/env node

/**
 * Sort products by SKU in collection JSON files
 *
 * Usage:
 *   node utils/sort-products-by-sku.js [collection-name]
 *
 * Examples:
 *   node utils/sort-products-by-sku.js hybrid-wood
 *   node utils/sort-products-by-sku.js vinyl
 *   node utils/sort-products-by-sku.js  (processes all collections)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COLLECTIONS_DIR = join(__dirname, '..', 'collections');

const sortProductsBySku = (products) => {
    return products.sort((a, b) => {
        // Extract numeric part from SKU (e.g., "FLR-5010" -> 5010)
        const skuA = parseInt(a.sku.split('-')[1] || '0');
        const skuB = parseInt(b.sku.split('-')[1] || '0');
        return skuA - skuB;
    });
};

const processCollectionFile = (filename) => {
    const filePath = join(COLLECTIONS_DIR, filename);

    console.log(`\nProcessing: ${filename}`);

    try {
        const fileContent = readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        if (!data.products || !Array.isArray(data.products)) {
            console.log(`  ⚠️  No products array found in ${filename}`);
            return;
        }

        const originalCount = data.products.length;
        console.log(`  📦 Found ${originalCount} products`);

        data.products = sortProductsBySku(data.products);

        if (data.metadata) {
            data.metadata.totalProducts = data.products.length;
            data.metadata.lastSorted = new Date().toISOString();
        }

        writeFileSync(filePath, JSON.stringify(data, null, 4) + '\n', 'utf8');

        console.log(`  ✅ Sorted ${originalCount} products by SKU`);
        console.log(`  💾 Saved to ${filename}`);

    } catch (error) {
        console.error(`  ❌ Error processing ${filename}:`, error.message);
    }
};

const main = () => {
    const args = process.argv.slice(2);

    if (args.length > 0) {
        args.forEach(collectionName => {
            const filename = collectionName.endsWith('.json')
                ? collectionName
                : `${collectionName}.json`;
            processCollectionFile(filename);
        });
    } else {
        console.log('🔍 Processing all collection files...');
        const files = readdirSync(COLLECTIONS_DIR)
            .filter(file => file.endsWith('.json'));

        if (files.length === 0) {
            console.log('No collection JSON files found.');
            return;
        }

        files.forEach(processCollectionFile);
    }

    console.log('\n✨ Done!\n');
};


main();
