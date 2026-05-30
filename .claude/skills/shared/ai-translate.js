/**
 * Shared Google Gemini utility for translation skills
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';
import {readFile} from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '../../..');
dotenv.config({path: join(projectRoot, '.env')});

const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const MODEL = 'gemini-3.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

if (!GOOGLE_API_KEY) {
    throw new Error('❌ Missing GOOGLE_GENERATIVE_AI_API_KEY in .env file');
}

/**
 * Call Google Gemini API with custom prompt
 */
export async function callGemini(systemPrompt, userPrompt, options = {}) {
    const {maxTokens = 10000} = options;

    const response = await fetch(`${API_URL}?key=${GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            system_instruction: {parts: [{text: systemPrompt}]},
            contents: [{role: 'user', parts: [{text: userPrompt}]}],
            generationConfig: {
                maxOutputTokens: maxTokens,
                responseMimeType: 'application/json',
                thinkingConfig: {thinkingBudget: 0},
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Google API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

/**
 * Call Gemini with retry on JSON parse errors
 */
export async function callGeminiWithRetry(systemPrompt, userPrompt, options = {}, maxRetries = 1) {
    let lastError = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const result = await callGemini(systemPrompt, userPrompt, options);
            if (attempt > 0) console.log(`  ✓ Retry successful on attempt ${attempt + 1}`);
            return result;
        } catch (error) {
            lastError = error;

            const isJsonError =
                error.message.includes('JSON') ||
                error.message.includes('parse') ||
                error.message.includes('Unexpected token');

            if (isJsonError && attempt < maxRetries) {
                console.log(`  ⚠️  JSON parse error, retrying (attempt ${attempt + 2}/${maxRetries + 1})...`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
                continue;
            }

            break;
        }
    }

    throw lastError;
}

/**
 * Load translation context files from docs directory
 */
export async function loadTranslationContext(fileNames = ['all']) {
    const contextDir = join(projectRoot, 'docs', 'translation-context');
    const context = {};

    try {
        if (fileNames.includes('all') || fileNames.includes('terminology')) {
            const content = await readFile(join(contextDir, 'terminology-map.json'), 'utf-8');
            context.terminologyMap = JSON.parse(content);
        }
        if (fileNames.includes('all') || fileNames.includes('bg-market')) {
            context.bgMarketContext = await readFile(join(contextDir, 'bg-market-context.md'), 'utf-8');
        }
        if (fileNames.includes('all') || fileNames.includes('en-source')) {
            context.enSourceContext = await readFile(join(contextDir, 'en-source-context.md'), 'utf-8');
        }
        if (fileNames.includes('all') || fileNames.includes('examples')) {
            const content = await readFile(join(contextDir, 'examples', 'translation-examples.json'), 'utf-8');
            context.translationExamples = JSON.parse(content);
        }
        if (fileNames.includes('all') || fileNames.includes('guidance')) {
            context.bulgarianGuidance = await readFile(
                join(projectRoot, 'docs', 'chat-gpt-bulgarian-language-guidance.md'),
                'utf-8'
            );
        }
        return context;
    } catch (error) {
        console.error('❌ Error loading translation context:', error.message);
        throw error;
    }
}

/**
 * Build a comprehensive system prompt for translation tasks
 */
export function buildTranslationSystemPrompt(context, taskType = 'polish') {
    const {terminologyMap, bgMarketContext, enSourceContext, translationExamples, bulgarianGuidance} = context;

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
