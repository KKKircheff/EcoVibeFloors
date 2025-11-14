/**
 * Shared Azure GPT-5 API utility for translation skills
 * Based on refine-and-translate-json.ts implementation
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from project root
const projectRoot = join(__dirname, '../../..');
dotenv.config({ path: join(projectRoot, '.env') });

const AZURE_API_KEY = process.env.AZURE_API_KEY;
const TARGET_URL = process.env.TARGET_URL;

if (!AZURE_API_KEY || !TARGET_URL) {
    throw new Error('❌ Missing AZURE_API_KEY or TARGET_URL in .env file');
}

/**
 * Call Azure GPT-5 API with custom prompt
 *
 * @param {string} systemPrompt - System instructions for the AI
 * @param {string} userPrompt - User message/content to process
 * @param {Object} options - Optional configuration
 * @param {number} options.maxTokens - Maximum response length (default 3000)
 * @param {Object} options.responseFormat - Response format (default: json_object)
 * @returns {Promise<string>} AI response content
 */
export async function callAzureGPT(systemPrompt, userPrompt, options = {}) {
    const {
        maxTokens = 3000,
        responseFormat = { type: 'json_object' }
    } = options;

    try {
        const response = await fetch(TARGET_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': AZURE_API_KEY
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: maxTokens,
                response_format: responseFormat
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Azure API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error('❌ Error calling Azure API:', error.message);
        throw error;
    }
}

/**
 * Call Azure API with retry on JSON parse errors
 * (Adapted from refine-and-translate-json.ts)
 *
 * @param {string} systemPrompt - System instructions
 * @param {string} userPrompt - User message
 * @param {Object} options - API options
 * @param {number} maxRetries - Maximum retry attempts (default 1)
 * @returns {Promise<string>} AI response
 */
export async function callAzureGPTWithRetry(systemPrompt, userPrompt, options = {}, maxRetries = 1) {
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await callAzureGPT(systemPrompt, userPrompt, options);

            if (attempt > 0) {
                console.log(`  ✓ Retry successful on attempt ${attempt + 1}`);
            }

            return result;

        } catch (error) {
            lastError = error;

            // Check if this is a JSON parse error (malformed response)
            const isJsonError = error.message.includes('JSON') ||
                error.message.includes('parse') ||
                error.message.includes('Unexpected token');

            // Only retry on JSON errors and if we have retries left
            if (isJsonError && attempt < maxRetries) {
                console.log(`  ⚠️  JSON parse error, retrying (attempt ${attempt + 2}/${maxRetries + 1})...`);
                // Wait 1 second before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
            }

            // Don't retry on other errors (network, auth, etc.)
            break;
        }
    }

    // If we get here, all attempts failed
    throw lastError;
}

/**
 * Load translation context files from docs directory
 *
 * @param {Array<string>} fileNames - Which context files to load
 * @returns {Promise<Object>} Context data
 */
export async function loadTranslationContext(fileNames = ['all']) {
    const projectRoot = join(__dirname, '../../..');
    const contextDir = join(projectRoot, 'docs', 'translation-context');

    const context = {};

    try {
        // Load terminology map
        if (fileNames.includes('all') || fileNames.includes('terminology')) {
            const terminologyPath = join(contextDir, 'terminology-map.json');
            const terminologyContent = await readFile(terminologyPath, 'utf-8');
            context.terminologyMap = JSON.parse(terminologyContent);
        }

        // Load Bulgarian market context
        if (fileNames.includes('all') || fileNames.includes('bg-market')) {
            const bgContextPath = join(contextDir, 'bg-market-context.md');
            context.bgMarketContext = await readFile(bgContextPath, 'utf-8');
        }

        // Load English source context
        if (fileNames.includes('all') || fileNames.includes('en-source')) {
            const enContextPath = join(contextDir, 'en-source-context.md');
            context.enSourceContext = await readFile(enContextPath, 'utf-8');
        }

        // Load translation examples
        if (fileNames.includes('all') || fileNames.includes('examples')) {
            const examplesPath = join(contextDir, 'examples', 'translation-examples.json');
            const examplesContent = await readFile(examplesPath, 'utf-8');
            context.translationExamples = JSON.parse(examplesContent);
        }

        // Load Bulgarian language guidance
        if (fileNames.includes('all') || fileNames.includes('guidance')) {
            const guidancePath = join(projectRoot, 'docs', 'chat-gpt-bulgarian-language-guidance.md');
            context.bulgarianGuidance = await readFile(guidancePath, 'utf-8');
        }

        return context;

    } catch (error) {
        console.error('❌ Error loading translation context:', error.message);
        throw error;
    }
}

/**
 * Build a comprehensive system prompt for translation tasks
 *
 * @param {Object} context - Loaded context files
 * @param {string} taskType - 'polish' or 'translate'
 * @returns {string} System prompt
 */
export function buildTranslationSystemPrompt(context, taskType = 'polish') {
    const {
        terminologyMap,
        bgMarketContext,
        enSourceContext,
        translationExamples,
        bulgarianGuidance
    } = context;

    const isPolishing = taskType === 'polish';
    const taskDescription = isPolishing
        ? 'Polish and refine existing Bulgarian translation'
        : 'Translate English content to Bulgarian';

    return `You are an expert ${isPolishing ? 'Bulgarian translation editor' : 'English→Bulgarian translator'} specializing in luxury flooring content.

${bulgarianGuidance || ''}

TERMINOLOGY REFERENCE:
${JSON.stringify(terminologyMap, null, 2)}

BULGARIAN MARKET INSIGHTS:
${bgMarketContext || ''}

${enSourceContext ? `ENGLISH SOURCE BRAND CONTEXT:\n${enSourceContext}\n` : ''}

TRANSLATION EXAMPLES (Good vs Bad):
${JSON.stringify(translationExamples, null, 2)}

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

TASK: ${taskDescription}

Return JSON with the following structure:
{
  ${isPolishing ? '"polished_text"' : '"bulgarian_translation"'}: "result in Bulgarian",
  ${isPolishing ? '"changes_made"' : '"translation_notes"'}: ["list of improvements/adaptations"],
  "quality_signals_added": ["warranty mention", "origin mention", "technical specs", etc.],
  "seo_terms_used": ["Bulgarian keywords included"]
}`;
}
