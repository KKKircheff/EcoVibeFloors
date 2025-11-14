/**
 * Custom Document Embedding Generation Script
 *
 * This script:
 * 1. Loads custom documents (markdown, text, PDF) from utils/embedding-scripts/docs/
 * 2. Parses documents using pdf-parse for PDFs, native fs for markdown/text
 * 3. Chunks content with RecursiveCharacterTextSplitter (2000 chars, 300 overlap)
 * 4. Generates 1536-dim embeddings with Azure OpenAI (text-embedding-3-small model)
 * 5. Uploads to Firestore with native vector fields
 *
 * Supported Formats:
 *   - .md (Markdown)
 *   - .txt (Plain Text)
 *   - .pdf (Text-based PDFs only, no OCR for scanned documents)
 *
 * Locale Detection:
 *   - Auto-detects from filename suffix: -en, -bg, _en, _bg
 *   - Example: catalog-en.pdf → English, guide_bg.md → Bulgarian
 *   - Override with --locale flag
 *
 * Category Detection:
 *   - Auto-extracts from subdirectory structure
 *   - Example: docs/installation/guide.pdf → category: "installation"
 *   - Defaults to "documentation" for root-level files
 *
 * Usage Examples:
 *   # Markdown files
 *   npx tsx utils/embedding-scripts/embed-documents.ts --file=guide.md --dry-run
 *
 *   # PDF files (text-based only)
 *   npx tsx utils/embedding-scripts/embed-documents.ts --file=catalog-en.pdf
 *   npx tsx utils/embedding-scripts/embed-documents.ts --file=manual.pdf --locale=bg --delay=1000
 *
 *   # Wildcard patterns
 *   npx tsx utils/embedding-scripts/embed-documents.ts --file=guide*.pdf --skip-existing
 *   npx tsx utils/embedding-scripts/embed-documents.ts --file=installation-*.md
 *
 *   # Plain text files
 *   npx tsx utils/embedding-scripts/embed-documents.ts --file=notes.txt --locale=en
 */

import 'dotenv/config';
import {initializeFirebaseAdmin, getFirestoreAdmin} from '@/lib/firebase/firebase-admin';
import {getAzureEmbeddings} from '@/lib/azure/azure-ai';
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters';
import {Document} from '@langchain/core/documents';
import type {ChunkMetadata} from '@/lib/chat-ai-assistant/types';
import {parseCommonArgs, printScriptHeader, printSummary, uploadChunk, sleep} from './shared/embedding-utils';
import * as path from 'path';
import * as fs from 'fs/promises';
import {PDFParse} from 'pdf-parse';

// Parse command line arguments
const args = process.argv.slice(2);
const commonArgs = parseCommonArgs(args);
const filePattern = args.find((arg) => arg.startsWith('--file='))?.split('=')[1];
const localeOverride = args.find((arg) => arg.startsWith('--locale='))?.split('=')[1] as 'en' | 'bg' | undefined;

// Validate required arguments
if (!filePattern) {
    console.error('❌ Error: --file parameter is required');
    console.error('Usage: npx tsx utils/chat-ai-assistant/embed-documents.ts --file=document.md');
    process.exit(1);
}

// Initialize Firebase Admin SDK (only if not dry run)
let db: ReturnType<typeof getFirestoreAdmin> | null = null;
if (!commonArgs.isDryRun) {
    initializeFirebaseAdmin();
    db = getFirestoreAdmin();
}

// Initialize Azure OpenAI embeddings (1536 dimensions)
const embeddings = getAzureEmbeddings();

// Initialize text splitter (same config as pages)
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 2000,
    chunkOverlap: 300,
    separators: ['\n\n', '\n', '. ', ' ', ''],
});

// Documents directory
const DOCS_DIR = path.join(process.cwd(), 'utils', 'embedding-scripts', 'docs');

/**
 * Detect locale from filename or use override/default
 */
function detectLocale(filename: string): 'en' | 'bg' {
    if (localeOverride) return localeOverride;

    // Check for locale suffix in filename (e.g., guide-en.md, guide-bg.txt)
    if (filename.match(/-en\.(md|txt|pdf)$/)) return 'en';
    if (filename.match(/-bg\.(md|txt|pdf)$/)) return 'bg';
    if (filename.match(/_en\.(md|txt|pdf)$/)) return 'en';
    if (filename.match(/_bg\.(md|txt|pdf)$/)) return 'bg';

    // Default to English
    return 'en';
}

/**
 * Extract category from file path or subdirectory
 */
function extractCategory(filePath: string): string {
    const relativePath = path.relative(DOCS_DIR, filePath);
    const dirName = path.dirname(relativePath);

    // If file is in subdirectory, use subdirectory name as category
    if (dirName && dirName !== '.') {
        return dirName.split(path.sep)[0]; // Use first subdirectory level
    }

    return 'documentation';
}

/**
 * Extract title from document content (first heading or filename)
 */
function extractTitle(content: string, filename: string): string {
    // Try to find first markdown heading
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) {
        return headingMatch[1].trim();
    }

    // Fallback to filename without extension
    return path.basename(filename, path.extname(filename));
}

/**
 * Manual text file loader
 */
async function loadTextFile(filePath: string): Promise<Document[]> {
    const text = await fs.readFile(filePath, 'utf-8');
    return [
        new Document({
            pageContent: text,
            metadata: {source: filePath},
        }),
    ];
}

/**
 * PDF file loader using pdf-parse
 * Extracts text content from PDF and creates one Document per page
 */
async function loadPDFFile(filePath: string): Promise<Document[]> {
    try {
        const dataBuffer = await fs.readFile(filePath);

        // Initialize PDFParse with the buffer data
        const parser = new PDFParse({data: dataBuffer});

        // Extract text from all pages
        const textResult = await parser.getText();

        // Get document info
        const infoResult = await parser.getInfo();

        // Clean up resources
        await parser.destroy();

        console.log(`  ✓ Loaded PDF: ${infoResult.total} pages, ${textResult.text.length} characters`);

        // Create one document with all content - text splitter will handle chunking
        return [
            new Document({
                pageContent: textResult.text,
                metadata: {
                    source: filePath,
                    pdfInfo: {
                        totalPages: infoResult.total,
                        title: infoResult.info?.Title || '',
                        author: infoResult.info?.Author || '',
                    },
                },
            }),
        ];
    } catch (error) {
        console.error(`  ✗ Failed to load PDF file:`, error);
        throw error;
    }
}

/**
 * Load and chunk a document based on file type
 */
async function loadAndChunkDocument(filePath: string): Promise<ChunkMetadata[]> {
    const ext = path.extname(filePath).toLowerCase();
    const filename = path.basename(filePath);
    const locale = detectLocale(filename);
    const category = extractCategory(filePath);

    console.log(`  Loading: ${filename} (${ext}) - Locale: ${locale}, Category: ${category}`);

    try {
        let docs: Document[];

        // Select appropriate loader based on file extension
        if (ext === '.pdf') {
            docs = await loadPDFFile(filePath);
        } else if (ext === '.md' || ext === '.txt') {
            docs = await loadTextFile(filePath);
        } else {
            console.error(`  ✗ Unsupported file type: ${ext}`);
            return [];
        }

        // Split documents into chunks
        const chunks = await textSplitter.splitDocuments(docs);

        // Extract title from first document
        const title = docs.length > 0 ? extractTitle(docs[0].pageContent, filename) : filename;

        // Convert to ChunkMetadata
        return chunks.map((chunk, index) => {
            const baseId = path.basename(filename, ext);
            const isPDF = ext === '.pdf';
            const sourceId = isPDF ? `doc-${baseId}-pdf-chunk-${index}` : `doc-${baseId}-${index}`;

            const metadata: ChunkMetadata = {
                text: chunk.pageContent,
                locale,
                contentType: 'document' as const,
                category,
                sourceId,
                sourceUrl: `/docs/${filename}`,
                sourceTitle: title,
            };

            return metadata;
        });
    } catch (error) {
        console.error(`  ✗ Failed to load ${filename}:`, error);
        return [];
    }
}

/**
 * Find files matching pattern in docs directory
 */
async function findDocuments(): Promise<string[]> {
    if (!filePattern) return [];

    try {
        // Ensure docs directory exists
        await fs.mkdir(DOCS_DIR, {recursive: true});

        // Read all files in docs directory
        const files = await fs.readdir(DOCS_DIR);

        // Filter by pattern (supports exact match or wildcard)
        const matchingFiles = files.filter((file) => {
            if (filePattern.includes('*')) {
                // Simple wildcard matching
                const regex = new RegExp('^' + filePattern.replace(/\*/g, '.*') + '$');
                return regex.test(file);
            }
            return file === filePattern;
        });

        return matchingFiles.map((file) => path.join(DOCS_DIR, file));
    } catch (error) {
        console.error(`  ✗ Failed to read docs directory:`, error);
        return [];
    }
}

/**
 * Main execution
 */
async function main() {
    printScriptHeader('Document Embedding Generation', embeddings, commonArgs, {
        'File pattern': filePattern || 'N/A',
        'Locale': localeOverride || 'auto-detect',
        'Docs directory': DOCS_DIR,
    });

    // Find matching documents
    const documentPaths = await findDocuments();

    if (documentPaths.length === 0) {
        console.error(`\n❌ No documents found matching pattern: ${filePattern}`);
        console.error(`Docs directory: ${DOCS_DIR}\n`);
        process.exit(1);
    }

    console.log(`📄 Found ${documentPaths.length} document(s) to process\n`);

    let totalChunks = 0;
    let uploadedCount = 0;
    let skippedCount = 0;

    // Process each document
    for (const docPath of documentPaths) {
        const chunks = await loadAndChunkDocument(docPath);

        console.log(`  Generated ${chunks.length} chunks`);

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

        console.log();
    }

    printSummary(totalChunks, uploadedCount, skippedCount, commonArgs.isDryRun, commonArgs.skipExisting);
}

// Run the script
main().catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
});
