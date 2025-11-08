#!/usr/bin/env node

/**
 * Polish Bulgarian Translation Script
 * Called by polish-text skill to refine existing Bulgarian content
 */

import {
    loadTranslationContext,
    buildTranslationSystemPrompt,
    callAzureGPTWithRetry
} from '../../shared/azure-translate.js';

/**
 * Polish Bulgarian text using Azure GPT-4
 *
 * @param {string} bulgarianText - Text to polish
 * @param {Object} options - Optional parameters
 * @param {boolean} options.verbose - Show detailed output
 * @returns {Promise<Object>} Polished result
 */
async function polishBulgarianText(bulgarianText, options = {}) {
    const { verbose = false } = options;

    if (verbose) {
        console.log('🔧 Polish Bulgarian Text');
        console.log('='.repeat(60));
        console.log(`Input: ${bulgarianText.substring(0, 100)}...`);
        console.log('='.repeat(60) + '\n');
    }

    try {
        // Load translation context
        if (verbose) console.log('📖 Loading translation context...');
        const context = await loadTranslationContext(['all']);
        if (verbose) console.log('✓ Context loaded\n');

        // Build system prompt
        const systemPrompt = buildTranslationSystemPrompt(context, 'polish');

        // Build user prompt
        const userPrompt = `Please polish and refine this Bulgarian text following all guidelines.

BULGARIAN TEXT TO POLISH:
${bulgarianText}

Focus on:
- Natural Bulgarian phrasing (not literal translation)
- Market-appropriate terminology
- Trust signals (warranty, origin, specs)
- SEO optimization with Bulgarian search terms
- Professional luxury tone

Return JSON response following the specified format.`;

        // Call Azure API
        if (verbose) console.log('🤖 Calling Azure GPT-5 API...');
        const responseContent = await callAzureGPTWithRetry(
            systemPrompt,
            userPrompt,
            {
                temperature: 0.4,
                maxTokens: 10000,
                responseFormat: { type: 'json_object' }
            },
            1 // Max retries
        );
        if (verbose) console.log('✓ API response received\n');

        // Parse response
        const result = JSON.parse(responseContent);

        // Validate response structure
        if (!result.polished_text) {
            throw new Error('Invalid response: missing polished_text field');
        }

        if (verbose) {
            console.log('✅ POLISHING RESULTS');
            console.log('='.repeat(60));
            console.log(`Polished Text: ${result.polished_text}`);
            console.log('\nChanges Made:');
            result.changes_made?.forEach(change => console.log(`  - ${change}`));
            console.log('\nQuality Signals Added:');
            result.quality_signals_added?.forEach(signal => console.log(`  - ${signal}`));
            console.log('\nSEO Terms Used:');
            result.seo_terms_used?.forEach(term => console.log(`  - ${term}`));
            console.log('='.repeat(60) + '\n');
        }

        return result;

    } catch (error) {
        console.error('❌ Error polishing Bulgarian text:', error.message);
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
Polish Bulgarian Translation Script
====================================

Usage: node polish-bulgarian.js [options] <text>

Options:
  --text=TEXT        Bulgarian text to polish (required)
  --verbose, -v      Show detailed output
  --help, -h         Show this help message

Examples:
  node polish-bulgarian.js --text="Висококачествен паркет"
  node polish-bulgarian.js --verbose --text="Премиум настилки"

Environment Variables:
  AZURE_API_KEY      Azure GPT-4 API key (required)
  TARGET_URL         Azure GPT-4 endpoint URL (required)
`);
        process.exit(0);
    }

    // Parse arguments
    const verbose = args.includes('--verbose') || args.includes('-v');
    const textArg = args.find(arg => arg.startsWith('--text='));

    if (!textArg) {
        console.error('❌ Error: --text parameter is required');
        console.error('Use --help for usage information');
        process.exit(1);
    }

    const bulgarianText = textArg.split('=').slice(1).join('=');

    if (!bulgarianText || bulgarianText.trim().length === 0) {
        console.error('❌ Error: Text cannot be empty');
        process.exit(1);
    }

    try {
        const result = await polishBulgarianText(bulgarianText, { verbose });

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
export { polishBulgarianText };
