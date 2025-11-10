#!/usr/bin/env node

/**
 * Translate to Bulgarian Script
 * Called by translate-text skill to translate English content to Bulgarian
 */

import {
    loadTranslationContext,
    buildTranslationSystemPrompt,
    callAzureGPTWithRetry
} from '../../shared/azure-translate.js';

/**
 * Detect content type (text, markdown, or JSON)
 *
 * @param {string} content - Content to analyze
 * @returns {string} Content type
 */
function detectContentType(content) {
    const trimmed = content.trim();

    // Check if JSON
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
            JSON.parse(trimmed);
            return 'json';
        } catch {
            // Not valid JSON, continue checking
        }
    }

    // Check if Markdown (has markdown syntax)
    if (trimmed.match(/^#+\s/m) || // Headings
        trimmed.match(/^\*\s/m) ||  // Lists
        trimmed.match(/^\d+\.\s/m) || // Numbered lists
        trimmed.match(/\[.*\]\(.*\)/)) { // Links
        return 'markdown';
    }

    // Default to plain text
    return 'text';
}

/**
 * Translate English text to Bulgarian using Azure GPT-5
 *
 * @param {string} englishText - Text to translate
 * @param {Object} options - Optional parameters
 * @param {boolean} options.verbose - Show detailed output
 * @param {string} options.contentType - Force specific content type
 * @returns {Promise<Object>} Translation result
 */
async function translateToBulgarian(englishText, options = {}) {
    const { verbose = false, contentType = null } = options;

    // Detect content type
    const detectedType = contentType || detectContentType(englishText);

    if (verbose) {
        console.log('🌍 Translate to Bulgarian');
        console.log('='.repeat(60));
        console.log(`Content Type: ${detectedType}`);
        console.log(`Input: ${englishText.substring(0, 100)}...`);
        console.log('='.repeat(60) + '\n');
    }

    try {
        // Load translation context (all files for translation)
        if (verbose) console.log('📖 Loading translation context...');
        const context = await loadTranslationContext(['all']);
        if (verbose) console.log('✓ Context loaded\n');

        // Build system prompt for translation
        const systemPrompt = buildTranslationSystemPrompt(context, 'translate');

        // Build user prompt based on content type
        let userPrompt = '';

        switch (detectedType) {
            case 'json':
                userPrompt = `Translate this JSON content to Bulgarian. Preserve the JSON structure and keys, translate only the values.

ENGLISH JSON:
${englishText}

Return JSON with:
- bulgarian_translation: The translated JSON object
- translation_notes: Key adaptations made
- quality_signals_added: Trust signals added
- seo_terms_used: Bulgarian keywords used`;
                break;

            case 'markdown':
                userPrompt = `Translate this Markdown content to Bulgarian. Preserve all formatting (headings, lists, links), translate only the text content.

ENGLISH MARKDOWN:
${englishText}

Return JSON with:
- bulgarian_translation: The translated markdown (preserving formatting)
- translation_notes: Key adaptations made
- quality_signals_added: Trust signals added
- seo_terms_used: Bulgarian keywords used`;
                break;

            default: // text
                userPrompt = `Translate this English text to Bulgarian following all market adaptation guidelines.

ENGLISH TEXT:
${englishText}

Focus on:
- Translate INTENT not WORDS (emotional impact + persuasiveness)
- Use Bulgarian search terms (масивен паркет, трислоен паркет, водоустойчив)
- Add concrete quality signals (warranty, origin, specs)
- Natural Bulgarian phrasing (not literal translation)
- Professional luxury tone

Return JSON with:
- bulgarian_translation: The translated text
- translation_notes: Key adaptations made
- quality_signals_added: Trust signals added (warranty, origin, specs)
- seo_terms_used: Bulgarian keywords included`;
        }

        // Call Azure API
        if (verbose) console.log('🤖 Calling Azure GPT-5 API...');
        const responseContent = await callAzureGPTWithRetry(
            systemPrompt,
            userPrompt,
            {
                temperature: 0.4,
                maxTokens: 3000,
                responseFormat: { type: 'json_object' }
            },
            1 // Max retries
        );
        if (verbose) console.log('✓ API response received\n');

        // Parse response
        const result = JSON.parse(responseContent);

        // Validate response structure
        if (!result.bulgarian_translation) {
            throw new Error('Invalid response: missing bulgarian_translation field');
        }

        // Add metadata
        result.content_type = detectedType;

        if (verbose) {
            console.log('✅ TRANSLATION RESULTS');
            console.log('='.repeat(60));
            console.log('Bulgarian Translation:');
            if (detectedType === 'json') {
                console.log(JSON.stringify(result.bulgarian_translation, null, 2));
            } else {
                console.log(result.bulgarian_translation);
            }
            console.log('\nTranslation Notes:');
            result.translation_notes?.forEach(note => console.log(`  - ${note}`));
            console.log('\nQuality Signals Added:');
            result.quality_signals_added?.forEach(signal => console.log(`  - ${signal}`));
            console.log('\nSEO Terms Used:');
            result.seo_terms_used?.forEach(term => console.log(`  - ${term}`));
            console.log('='.repeat(60) + '\n');
        }

        return result;

    } catch (error) {
        console.error('❌ Error translating to Bulgarian:', error.message);
        throw error;
    }
}

/**
 * CLI entry point
 */
async function main() {
    const args = process.argv.slice(2);

    // Check for help flag
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Translate to Bulgarian Script
==============================

Usage: node translate-to-bulgarian.js [options]

Options:
  --text=TEXT        English text to translate (required)
  --type=TYPE        Force content type: text|markdown|json (auto-detected if not specified)
  --verbose, -v      Show detailed output
  --help, -h         Show this help message

Examples:
  node translate-to-bulgarian.js --text="Premium oak flooring"
  node translate-to-bulgarian.js --verbose --text="# Hybrid Wood\nWaterproof innovation"
  node translate-to-bulgarian.js --type=json --text='{"title":"Oak Flooring"}'

Environment Variables:
  AZURE_API_KEY      Azure GPT-5 API key (required)
  TARGET_URL         Azure GPT-5 endpoint URL (required)
`);
        process.exit(0);
    }

    // Parse arguments
    const verbose = args.includes('--verbose') || args.includes('-v');
    const textArg = args.find(arg => arg.startsWith('--text='));
    const typeArg = args.find(arg => arg.startsWith('--type='));

    if (!textArg) {
        console.error('❌ Error: --text parameter is required');
        console.error('Use --help for usage information');
        process.exit(1);
    }

    const englishText = textArg.split('=').slice(1).join('=');
    const contentType = typeArg ? typeArg.split('=')[1] : null;

    if (!englishText || englishText.trim().length === 0) {
        console.error('❌ Error: Text cannot be empty');
        process.exit(1);
    }

    // Validate content type if specified
    if (contentType && !['text', 'markdown', 'json'].includes(contentType)) {
        console.error('❌ Error: Invalid content type. Must be: text, markdown, or json');
        process.exit(1);
    }

    try {
        const result = await translateToBulgarian(englishText, { verbose, contentType });

        // Output result as JSON for easy parsing
        if (!verbose) {
            console.log(JSON.stringify(result, null, 2));
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run CLI if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

// Export for use as module
export { translateToBulgarian, detectContentType };
