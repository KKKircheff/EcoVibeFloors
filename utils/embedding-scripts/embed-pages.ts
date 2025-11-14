/**
 * Website Page Embedding Generation Script
 *
 * This script:
 * 1. Scrapes website pages with Jina.ai Reader API (with retry logic)
 * 2. Chunks content with LangChain RecursiveCharacterTextSplitter
 * 3. Generates 1536-dim embeddings with Azure OpenAI (text-embedding-3-small model)
 * 4. Uploads to Firestore with native vector fields
 *
 * Usage:
 *   npx tsx utils/embedding-scripts/embed-pages.ts
 *   npx tsx utils/embedding-scripts/embed-pages.ts --dry-run
 *   npx tsx utils/embedding-scripts/embed-pages.ts --delay=2000
 *   npx tsx utils/embedding-scripts/embed-pages.ts --skip-existing
 */

import 'dotenv/config'; // Load environment variables
import {initializeFirebaseAdmin, getFirestoreAdmin} from '@/lib/firebase/firebase-admin';
import {getAzureEmbeddings} from '@/lib/azure/azure-ai';
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters';
import type {ChunkMetadata, PageToScrape} from '@/lib/chat-ai-assistant/types';
import {PAGES_TO_SCRAPE} from './pages-to-scrape';
import {
    parseCommonArgs,
    printScriptHeader,
    printSummary,
    uploadChunk,
    sleep,
} from './shared/embedding-utils';

// Parse command line arguments
const args = process.argv.slice(2);
const commonArgs = parseCommonArgs(args);

// Initialize Firebase Admin SDK (only if not dry run)
let db: ReturnType<typeof getFirestoreAdmin> | null = null;
if (!commonArgs.isDryRun) {
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
                contentType: 'page' as const,
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
 * Main execution
 */
async function main() {
    printScriptHeader('Website Page Embedding Generation', embeddings, commonArgs, {
        'Pages to process': PAGES_TO_SCRAPE.length.toString(),
    });

    let totalChunks = 0;
    let uploadedCount = 0;
    let skippedCount = 0;

    console.log('📄 Processing Website Pages...\n');

    for (const page of PAGES_TO_SCRAPE) {
        const chunks = await scrapeAndChunkPage(page);

        for (const chunk of chunks) {
            const uploaded = await uploadChunk(
                db,
                embeddings,
                chunk,
                totalChunks + 1,
                commonArgs.isDryRun,
                commonArgs.skipExisting
            );
            totalChunks++;
            if (uploaded) uploadedCount++;
            else if (commonArgs.skipExisting) skippedCount++;

            // Delay to avoid rate limits (configurable via --delay flag)
            await sleep(commonArgs.delayMs);
        }

        // Additional delay between pages
        await sleep(commonArgs.delayMs * 2);
    }

    printSummary(totalChunks, uploadedCount, skippedCount, commonArgs.isDryRun, commonArgs.skipExisting);
}

// Run the script
main().catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
});
