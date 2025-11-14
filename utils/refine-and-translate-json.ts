import {promises as fs} from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import dotenv from 'dotenv';
import {
    validateProduct,
    formatValidationErrors,
    type Product,
    type TranslationResult as TranslationResultType,
} from '@/types/product.schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const AZURE_API_KEY = process.env.AZURE_API_KEY;
const TARGET_URL = process.env.TARGET_URL;

if (!AZURE_API_KEY || !TARGET_URL) {
    console.error('❌ Missing AZURE_API_KEY or TARGET_URL in .env file');
    process.exit(1);
}

// ============================================================================
// Type Definitions
// ============================================================================

interface TranslationContext {
    terminologyMap: Record<string, any>;
    bgMarketContext: string;
    enSourceContext: string;
}

interface ProcessingConfig {
    collectionName: string;
    collectionPath: string;
    dryRun: boolean;
    verbose: boolean;
}

interface ProcessingStats {
    processedCount: number;
    updatedCount: number;
    skippedCount: number;
    errorCount: number;
    errors: Array<{sku: string; error: string}>;
    changes: Array<{
        sku: string;
        name: string;
        improvements: string[];
        qualitySignals: string[];
    }>;
}

interface CollectionData {
    collection: {
        products: Product[];
        [key: string]: any;
    };
    products: Product[];
}

interface ProcessingResult {
    product: Product;
    result: TranslationResultType | null;
    stats: ProcessingStats;
}

interface FinalResult {
    success: boolean;
    processed: number;
    updated: number;
    errors: number;
}

// ============================================================================
// Configuration Functions (Pure)
// ============================================================================

/**
 * Create processing configuration object
 */
export function createProcessingConfig(
    collectionName: string,
    dryRun: boolean = false,
    verbose: boolean = false
): ProcessingConfig {
    return {
        collectionName,
        collectionPath: path.join(process.cwd(), 'collections', `${collectionName}.json`),
        dryRun,
        verbose,
    };
}

/**
 * Create initial processing statistics object
 */
export function createInitialStats(): ProcessingStats {
    return {
        processedCount: 0,
        updatedCount: 0,
        skippedCount: 0,
        errorCount: 0,
        errors: [],
        changes: [],
    };
}

// ============================================================================
// Context Loading (Async I/O)
// ============================================================================

/**
 * Load translation context files from docs directory
 */
export async function loadTranslationContext(): Promise<TranslationContext> {
    console.log('📖 Loading translation context files...');

    try {
        const terminologyPath = path.join(process.cwd(), 'docs', 'translation-context', 'terminology-map.json');
        const bgContextPath = path.join(process.cwd(), 'docs', 'translation-context', 'bg-market-context.md');
        const enContextPath = path.join(process.cwd(), 'docs', 'translation-context', 'en-source-context.md');

        const [terminologyMap, bgMarketContext, enSourceContext] = await Promise.all([
            fs.readFile(terminologyPath, 'utf-8').then(JSON.parse),
            fs.readFile(bgContextPath, 'utf-8'),
            fs.readFile(enContextPath, 'utf-8'),
        ]);

        console.log('✓ Translation context loaded successfully\n');

        return {terminologyMap, bgMarketContext, enSourceContext};
    } catch (error) {
        console.error('❌ Error loading context files:', (error as Error).message);
        throw error;
    }
}

// ============================================================================
// File Operations (Async I/O)
// ============================================================================

/**
 * Read and parse collection JSON file
 */
export async function readCollectionFile(collectionPath: string, collectionName: string): Promise<CollectionData> {
    console.log(`📂 Reading collection: ${collectionName}.json`);

    try {
        const content = await fs.readFile(collectionPath, 'utf-8');
        const collection = JSON.parse(content);
        const products = collection.products;

        if (!products || !Array.isArray(products)) {
            throw new Error('Products array not found in collection');
        }

        console.log(`✓ Found ${products.length} products\n`);
        return {collection, products};
    } catch (error) {
        console.error('❌ Error reading collection:', (error as Error).message);
        throw error;
    }
}

/**
 * Create timestamped backup of collection file
 */
export async function createBackupFile(collectionPath: string): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${collectionPath}.backup-${timestamp}`;
    await fs.copyFile(collectionPath, backupPath);
    console.log(`💾 Backup created: ${path.basename(backupPath)}\n`);
    return backupPath;
}

/**
 * Save collection file or preview
 */
export async function saveCollectionFile(
    collectionPath: string,
    collection: CollectionData['collection'],
    config: ProcessingConfig,
    changes: ProcessingStats['changes']
): Promise<void> {
    console.log('\n📝 Saving updated collection...');

    if (!config.dryRun) {
        await fs.writeFile(collectionPath, JSON.stringify(collection, null, 2), 'utf-8');
        console.log('✓ Collection file updated successfully');
    } else {
        console.log('✓ Dry run - no changes written to file');

        // Save preview to a file for review
        const previewPath = `${collectionPath}.preview-${Date.now()}.txt`;
        const preview = formatChangesPreview(changes);
        await fs.writeFile(previewPath, preview, 'utf-8');
        console.log(`✓ Preview saved to: ${path.basename(previewPath)}`);
    }
}

// ============================================================================
// Business Logic (Pure Functions)
// ============================================================================

/**
 * Build system prompt for Azure GPT API
 */
export function buildSystemPrompt(product: Product, context: TranslationContext): string {
    return `You are an expert translation specialist for luxury flooring products, translating from English to Bulgarian with deep understanding of both markets.

TERMINOLOGY REFERENCE:
${JSON.stringify(context.terminologyMap, null, 2)}

BULGARIAN MARKET INSIGHTS:
${context.bgMarketContext}

ENGLISH SOURCE BRAND CONTEXT:
${context.enSourceContext}

CRITICAL TRANSLATION PRINCIPLES:
1. Translate INTENT, not WORDS - capture same emotional impact and persuasiveness
2. Use terms Bulgarians actually search for (масивен паркет, трислоен паркет, водоустойчив)
3. Add concrete quality signals (25-годишна гаранция, германско качество, 3 мм горен слой)
4. Sound like native Bulgarian speaker wrote it, not translation
5. Professional luxury tone with warmth and approachability
6. Incorporate Bulgarian SEO search terms naturally

BRAND VOICE:
- Professional but approachable
- Quality-focused with concrete evidence
- European luxury positioning (Dutch/German quality)
- Trust-building through specifics (warranty, specs, certifications)

NEVER TRANSLATE:
- Brand names: Floer, Ter Hürne, Dutch Interior Group
- Proprietary terms: MEGAMAT, CLICKitEASY, SmartConnect, vGroove, Hywood
- Product names in titles: "Колекция Hybrid Wood" (keep English)

ALWAYS USE BULGARIAN EQUIVALENTS:
- click system → клик система
- engineered wood → многослоен паркет / трислоен паркет
- solid wood → масивен паркет
- waterproof → водоустойчив / водонепропусклив
- wear layer → горен слой
- usage class → клас на износване
- underfloor heating → подово отопление
- warranty → гаранция (ALWAYS include years: "25-годишна гаранция")

PRODUCT INFORMATION:
SKU: ${product.sku}
Collection: ${product.collection}
Pattern: ${product.pattern}
Installation: ${product.installationSystem}
Warranty: ${product.i18n.en.specifications?.certifications?.warranty || 'N/A'}
Features: ${product.i18n.en.features?.join(', ') || 'N/A'}

CURRENT CONTENT:
English Name: ${product.i18n.en.name}
English Description: ${product.i18n.en.description || 'N/A'}
English SEO Title: ${product.i18n.en.seo.title}
English SEO Description: ${product.i18n.en.seo.description}
English Keywords: ${
        Array.isArray(product.i18n.en.seo.keywords)
            ? product.i18n.en.seo.keywords.join(', ')
            : product.i18n.en.seo.keywords
    }

Bulgarian Name (current): ${product.i18n.bg.name}
Bulgarian Description (current): ${product.i18n.bg.description || 'N/A'}
Bulgarian SEO Title (current): ${product.i18n.bg.seo.title}
Bulgarian SEO Description (current): ${product.i18n.bg.seo.description}
Bulgarian Keywords (current): ${
        Array.isArray(product.i18n.bg.seo.keywords)
            ? product.i18n.bg.seo.keywords.join(', ')
            : product.i18n.bg.seo.keywords
    }

TASK:
1. REFINE ENGLISH: Improve English description and SEO if needed for clarity and luxury positioning
2. TRANSLATE TO BULGARIAN: Create market-optimized Bulgarian versions following all guidelines above

Return JSON with:
- Refined/unchanged English content
- High-quality Bulgarian translations
- List of specific improvements made

Response format:
{
  "en": {
    "description": "refined English description (or original if no changes needed)",
    "seo": {
      "title": "refined English SEO title",
      "description": "refined English SEO description",
      "keywords": ["keyword1", "keyword2", ...]
    }
  },
  "bg": {
    "description": "market-optimized Bulgarian description with quality signals",
    "seo": {
      "title": "Bulgarian SEO title with search terms",
      "description": "Bulgarian SEO description with concrete benefits",
      "keywords": ["ключова дума1", "ключова дума2", ...]
    }
  },
  "improvements": [
    "specific improvement 1",
    "specific improvement 2"
  ],
  "quality_signals_added": [
    "warranty mention",
    "origin mention",
    "technical specs"
  ]
}`;
}

/**
 * Apply translation result to product (immutable - returns new product)
 */
export function applyTranslationToProduct(product: Product, result: TranslationResultType): Product {
    return {
        ...product,
        i18n: {
            ...product.i18n,
            en: {
                ...product.i18n.en,
                description: result.en.description || product.i18n.en.description,
                seo: {
                    ...product.i18n.en.seo,
                    ...(result.en.seo || {}),
                },
            },
            bg: {
                ...product.i18n.bg,
                description: result.bg.description || product.i18n.bg.description,
                seo: {
                    ...product.i18n.bg.seo,
                    ...(result.bg.seo || {}),
                },
            },
        },
    };
}

/**
 * Update processing statistics (immutable - returns new stats)
 */
export function updateStats(
    stats: ProcessingStats,
    product: Product,
    result: TranslationResultType | null,
    error: Error | null
): ProcessingStats {
    const newStats: ProcessingStats = {
        ...stats,
        processedCount: stats.processedCount + 1,
    };

    if (error) {
        return {
            ...newStats,
            errorCount: newStats.errorCount + 1,
            errors: [...newStats.errors, {sku: product.sku, error: error.message}],
        };
    }

    if (!result || !result.improvements || result.improvements.length === 0) {
        return {
            ...newStats,
            skippedCount: newStats.skippedCount + 1,
        };
    }

    return {
        ...newStats,
        updatedCount: newStats.updatedCount + 1,
        changes: [
            ...newStats.changes,
            {
                sku: product.sku,
                name: product.i18n.en.name,
                improvements: result.improvements,
                qualitySignals: result.quality_signals_added || [],
            },
        ],
    };
}

/**
 * Format changes preview for dry-run mode
 */
export function formatChangesPreview(changes: ProcessingStats['changes']): string {
    return changes
        .map((change) => {
            return `\nSKU: ${change.sku} - ${change.name}\nImprovements:\n${change.improvements
                .map((i) => `  - ${i}`)
                .join('\n')}\nQuality Signals:\n${change.qualitySignals.map((s) => `  - ${s}`).join('\n')}`;
        })
        .join('\n' + '='.repeat(60));
}

// ============================================================================
// API Operations (Async External I/O)
// ============================================================================

/**
 * Call Azure GPT API to translate/refine product
 */
export async function translateProduct(
    product: Product,
    context: TranslationContext,
    apiKey: string,
    targetUrl: string
): Promise<TranslationResultType> {
    const systemPrompt = buildSystemPrompt(product, context);

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey,
            },
            body: JSON.stringify({
                messages: [
                    {role: 'system', content: systemPrompt},
                    {
                        role: 'user',
                        content:
                            'Please refine the English content if needed and create high-quality Bulgarian translations following all the guidelines. Return only the JSON response.',
                    },
                ],
                max_tokens: 3000,
                response_format: {type: 'json_object'},
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Azure API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        return JSON.parse(content);
    } catch (error) {
        console.error(`❌ Error calling Azure API for SKU ${product.sku}:`, (error as Error).message);
        throw error;
    }
}

/**
 * Call Azure GPT API with retry on JSON parse errors
 */
export async function translateProductWithRetry(
    product: Product,
    context: TranslationContext,
    apiKey: string,
    targetUrl: string,
    maxRetries: number = 1
): Promise<TranslationResultType> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await translateProduct(product, context, apiKey, targetUrl);

            // If we get here, translation succeeded
            if (attempt > 0) {
                console.log(`  ✓ Retry successful on attempt ${attempt + 1}`);
            }

            return result;
        } catch (error) {
            lastError = error as Error;

            // Check if this is a JSON parse error (malformed response)
            const isJsonError =
                lastError.message.includes('JSON') ||
                lastError.message.includes('parse') ||
                lastError.message.includes('Unexpected token');

            // Only retry on JSON errors and if we have retries left
            if (isJsonError && attempt < maxRetries) {
                console.log(`  ⚠️  JSON parse error, retrying (attempt ${attempt + 2}/${maxRetries + 1})...`);
                // Wait 1 second before retrying
                await new Promise((resolve) => setTimeout(resolve, 1000));
                continue;
            }

            // Don't retry on other errors (network, auth, etc.)
            break;
        }
    }

    // If we get here, all attempts failed
    throw lastError!;
}

// ============================================================================
// Processing Functions (Orchestration)
// ============================================================================

/**
 * Log improvements made to a product
 */
export function logImprovements(result: TranslationResultType, verbose: boolean): void {
    console.log(`  ✓ Improvements made:`);
    result.improvements.forEach((improvement) => {
        console.log(`    - ${improvement}`);
    });

    if (result.quality_signals_added && result.quality_signals_added.length > 0) {
        console.log(`  📊 Quality signals added:`);
        result.quality_signals_added.forEach((signal) => {
            console.log(`    - ${signal}`);
        });
    }

    if (verbose) {
        console.log(`\n  📝 Preview of changes:`);
        console.log(`  EN Description: ${result.en.description?.substring(0, 100)}...`);
        console.log(`  BG Description: ${result.bg.description?.substring(0, 100)}...`);
        console.log(`  BG SEO Title: ${result.bg.seo?.title}`);
    }
}

/**
 * Process a single product
 */
export async function processProduct(
    product: Product,
    index: number,
    total: number,
    context: TranslationContext,
    config: ProcessingConfig,
    stats: ProcessingStats,
    apiKey: string,
    targetUrl: string
): Promise<ProcessingResult> {
    console.log(`\n[${index + 1}/${total}] Processing: ${product.sku} - ${product.i18n.en.name}`);

    try {
        // Call translation API with retry on JSON errors
        const result = await translateProductWithRetry(product, context, apiKey, targetUrl);

        if (result.improvements && result.improvements.length > 0) {
            logImprovements(result, config.verbose);

            // Apply translations to product
            const updatedProduct = applyTranslationToProduct(product, result);

            // Validate the complete merged product
            const validation = validateProduct(updatedProduct);

            if (!validation.success) {
                // Validation failed - log detailed errors and keep original product
                const errorDetails = formatValidationErrors(validation.errors!);
                console.error(`  ❌ Product validation failed: ${errorDetails}`);

                const validationError = new Error(`Product validation failed: ${errorDetails}`);
                const updatedStats = updateStats(stats, product, null, validationError);

                return {product, result: null, stats: updatedStats};
            }

            // Validation succeeded - use updated product
            console.log(`  ✓ Product validation passed`);
            const updatedStats = updateStats(stats, product, result, null);

            return {product: validation.data!, result, stats: updatedStats};
        } else {
            console.log(`  ⊘ No changes needed`);
            const updatedStats = updateStats(stats, product, null, null);
            return {product, result: null, stats: updatedStats};
        }
    } catch (error) {
        console.error(`  ❌ Error: ${(error as Error).message}`);
        const updatedStats = updateStats(stats, product, null, error as Error);
        return {product, result: null, stats: updatedStats};
    }
}

/**
 * Print processing summary
 */
export function printSummary(stats: ProcessingStats, config: ProcessingConfig): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 PROCESSING SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total products processed: ${stats.processedCount}`);
    console.log(`✓ Updated: ${stats.updatedCount}`);
    console.log(`⊘ Skipped (no changes): ${stats.skippedCount}`);
    console.log(`❌ Errors: ${stats.errorCount}`);

    if (stats.changes.length > 0) {
        console.log('\n✅ Products successfully improved:');
        stats.changes.forEach((change) => {
            console.log(`  - ${change.sku}: ${change.name}`);
            console.log(`    Improvements: ${change.improvements.length}`);
        });
    }

    if (stats.errors.length > 0) {
        console.log('\n❌ Errors encountered:');
        stats.errors.forEach((err) => {
            console.log(`  - SKU ${err.sku}: ${err.error}`);
        });
    }

    if (config.dryRun) {
        console.log('\n⚠️  DRY RUN MODE - No changes were written to collection file');
        console.log('   Review the preview file to see proposed changes');
    }

    console.log('='.repeat(60) + '\n');
}

// ============================================================================
// Main Orchestrator
// ============================================================================

/**
 * Refine and translate a product collection
 */
export async function refineAndTranslateCollection(
    collectionName: string,
    dryRun: boolean = false,
    verbose: boolean = false
): Promise<FinalResult> {
    console.log('🚀 Starting Translation & Refinement Process');
    console.log('='.repeat(60));
    console.log(`Collection: ${collectionName}`);
    console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
    console.log(`Verbose: ${verbose ? 'YES' : 'NO'}`);
    console.log('='.repeat(60) + '\n');

    try {
        // Setup
        const config = createProcessingConfig(collectionName, dryRun, verbose);

        // Load resources
        const context = await loadTranslationContext();
        const {collection, products} = await readCollectionFile(config.collectionPath, collectionName);

        // Create backup (only if not dry run)
        if (!dryRun) {
            await createBackupFile(config.collectionPath);
        }

        // Process each product
        let stats = createInitialStats();
        const updatedProducts: Product[] = [];

        for (let i = 0; i < products.length; i++) {
            const processingResult = await processProduct(
                products[i],
                i,
                products.length,
                context,
                config,
                stats,
                AZURE_API_KEY!,
                TARGET_URL!
            );

            updatedProducts.push(processingResult.product);
            stats = processingResult.stats; // Update stats with new immutable state

            // Rate limiting - wait 2 seconds between requests
            if (i < products.length - 1) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }

        // Save updated collection
        const updatedCollection = {...collection, products: updatedProducts};
        await saveCollectionFile(config.collectionPath, updatedCollection, config, stats.changes);

        // Print summary
        printSummary(stats, config);

        return {
            success: stats.errorCount === 0,
            processed: stats.processedCount,
            updated: stats.updatedCount,
            errors: stats.errorCount,
        };
    } catch (error) {
        console.error('\n❌ FATAL ERROR:', (error as Error).message);
        console.error((error as Error).stack);
        process.exit(1);
    }
}

// ============================================================================
// CLI Entry Point
// ============================================================================

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const verbose = args.includes('--verbose');
const collectionArg = args.find((arg) => arg.startsWith('--collection='));
const collectionName = collectionArg ? collectionArg.split('=')[1] : 'glue-down-vinyl';

console.log('\n🌍 Product Translation & Refinement Script (TypeScript)');
console.log('==================================================\n');

if (args.includes('--help')) {
    console.log('Usage: tsx utils/refine-and-translate-json.ts [options]');
    console.log('\nOptions:');
    console.log('  --collection=NAME   Collection to process (default: glue-down-vinyl)');
    console.log('  --dry-run           Preview changes without modifying files');
    console.log('  --verbose           Show detailed preview of changes');
    console.log('  --help              Show this help message');
    console.log('\nExamples:');
    console.log('  tsx utils/refine-and-translate-json.ts --dry-run --verbose');
    console.log('  tsx utils/refine-and-translate-json.ts --collection=glue-down-vinyl');
    console.log('  tsx utils/refine-and-translate-json.ts --collection=hybrid-wood --dry-run\n');
    process.exit(0);
}

// Run the refiner
refineAndTranslateCollection(collectionName, dryRun, verbose).then((result) => {
    process.exit(result.success ? 0 : 1);
});
