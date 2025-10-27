# Building Custom Translation Scripts & Agents - Complete Guide

## Overview

This document explains how to build an intelligent translation management system using Mistral AI (or any LLM) and Claude Code agents. The system created for EcoVibeFloors can be replicated for any project requiring high-quality, market-aware translations.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Phase 1: Research & Context](#phase-1-research--context)
3. [Phase 2: Script Development](#phase-2-script-development)
4. [Phase 3: Claude Agents](#phase-3-claude-agents)
5. [Phase 4: Documentation](#phase-4-documentation)
6. [Adaptation Guide](#adaptation-guide)

---

## System Architecture

### Core Concept: Dual-Context Translation

Instead of mechanical word-for-word translation, this system uses:

```
English Source Context + Target Market Research
            ↓
         LLM with Rich Context
            ↓
     Natural, Market-Optimized Translation
```

### Components Overview

```
docs/translation-context/          # Research & guidelines
├── [target-lang]-market-context.md
├── en-source-context.md
├── terminology-map.json
└── examples/
    └── translation-examples.json

utils/                             # Automation scripts
├── polish-translations.js         # Main translation script
├── polish-collection-translations.js  # Product-specific script
├── translation-utils.js           # Shared utilities
└── schemas/
    └── translation-schemas.js     # Validation schemas

.claude/agents/                    # Manual translation agents
├── polish-text/
│   └── instructions.md
└── translate-text/
    └── instructions.md
```

---

## Phase 1: Research & Context

### Step 1.1: Target Market Research

**Goal**: Understand HOW your target audience searches, speaks, and thinks about your products.

**File**: `docs/translation-context/[target-lang]-market-context.md`

#### What to Research (3-4 hours)

**1. Competitor Analysis (1 hour)**
```markdown
## Competitor Analysis

Visit 5-7 competitor websites in target market:
- **Website**: [competitor-name.com]
- **Terminology**: What words do they use? (copy 3-4 product descriptions)
- **Tone**: Formal or casual? Technical or emotional?
- **Key phrases**: Note repeated phrases that resonate

Example findings:
- Competitor A uses "масивен паркет" (solid parquet) consistently
- Competitor B emphasizes "германско качество" (German quality)
- Common pattern: Always mention warranty years upfront
```

**2. Search Behavior Research (30 mins)**
```markdown
## Search Behavior

Google the main product category in target language:
- Note autocomplete suggestions (these are real search terms!)
- Check "People also ask" boxes
- Document top 10-15 search phrases

Example:
- ✅ "трислоен паркет" (3-layer parquet) - 1,200 monthly searches
- ✅ "водоустойчив паркет за баня" (waterproof parquet for bathroom)
- ❌ "engineered hardwood flooring" - Nobody searches this in Bulgarian!
```

**3. Forum/Social Research (30 mins)**
```markdown
## User Language Patterns

Find 1-2 forums or Facebook groups where target audience discusses products:
- What questions do they ask?
- What words do REAL PEOPLE use (not marketers)?
- What matters most to them?

Example findings:
- "Does it work with underfloor heating?" - asked in 80% of threads
- "How many years warranty?" - critical concern
- Users say "селект качество" not "premium grade"
```

**4. Local Terminology (30 mins)**
```markdown
## Terminology Mapping

| English Term | Competitor Term | Forum/User Term | Recommended |
|--------------|-----------------|-----------------|-------------|
| engineered wood | многослоен паркет | трислоен паркет | многослоен паркет |
| herringbone | рибена кост | щурц | щурц (more common) |
| click system | клик система | клик система | клик система |
```

**5. Cultural Buying Psychology (30 mins)**
```markdown
## What Target Market Values

Rank by importance (research from competitor emphasis + forum discussions):

1. **Warranty length** (mentioned in 90% of competitor homepages)
2. **Origin/Brand** (German/European = quality signal)
3. **Concrete specifications** (exact mm, exact years, exact class)
4. **Installation ease** (professional preferred over DIY)
5. **Sustainability** (growing but not primary concern)

This will guide translation emphasis!
```

#### Research Template Structure

```markdown
# [Target Language] Market Research for [Product Category]

## Executive Summary
- 2-3 paragraphs: key insights

## Terminology Analysis
- Table of English → Target Language mappings
- Professional vs consumer terms
- Regional variations

## Search Behavior
- Top 15 search terms with context
- Question patterns
- Local vs international terms

## Competitor Language Patterns
- 3-5 example descriptions (copy/paste good ones)
- Common phrasing patterns
- What works, what sounds robotic

## Cultural Buying Triggers
- What builds trust in this market?
- What are red flags? (e.g., "revolutionary" = untested)
- Price sensitivity levels

## Writing Style Preferences
- Sentence length
- Formality level
- Technical vs emotional balance
- Numbers and specifics usage
```

**Output**: 1,500-2,000 word markdown file with actionable insights.

---

### Step 1.2: Source Language Context

**Goal**: Document HOW the brand positions itself in English, so LLM understands the intent.

**File**: `docs/translation-context/en-source-context.md`

#### What to Document (2 hours)

**1. Brand Voice Analysis**
```markdown
## Brand Positioning

**Brand A (Main product line):**
- Core values: Innovation, sustainability, design
- Tone: Modern, confident, aspirational
- Key messaging: "Revolutionary technology", "Future of flooring"
- Innovation emphasis: HIGH (50% of homepage content)

**Brand B (Premium line):**
- Core values: Heritage, craftsmanship, quality
- Tone: Traditional, trustworthy, premium
- Key messaging: "Timeless quality", "Generations of expertise"
- Tradition emphasis: HIGH (German engineering heritage)
```

**2. Product Terminology with Intent**
```markdown
## Technical Terms with Intent Explanation

| Term | What it MEANS (not just translation) | Why brand uses it |
|------|--------------------------------------|-------------------|
| "Hybrid Wood" | Real wood top layer + waterproof core | Position as innovation leader |
| "Extended warranty" | 20-25 years vs industry standard 10 | Build trust through longevity |
| "Click system" | DIY-friendly installation | Lower barrier to entry |
| "Register embossed" | Texture matches grain visually | Technical detail = quality proof |
```

**3. Marketing Language Patterns**
```markdown
## How English Content Persuades

**Innovation Claims:**
- "Revolutionary" - Used to signal market leadership
- "Cutting-edge" - Emphasizes technology advancement
- "Future-proof" - Addresses longevity concern

**Quality Claims:**
- "Premium" + specific feature (e.g., "Premium Dutch craftsmanship")
- Numbers as proof ("25-year warranty", "0.55mm wear layer")
- Certifications (REACH, FloorScore as credibility)

**Emotional Triggers:**
- "Transform your space" - Aspiration
- "Worry-free" - Peace of mind
- "Timeless" - Investment value
```

**Output**: 1,000-1,500 word markdown explaining English source intent.

---

### Step 1.3: Terminology Mapping

**Goal**: Create rules for consistent terminology handling.

**File**: `docs/translation-context/terminology-map.json`

#### Structure

```json
{
  "neverTranslate": [
    "Brand names",
    "Proprietary technology names",
    "Trademarks"
  ],

  "technicalTerms": {
    "term_in_english": {
      "targetLang": "correct_translation",
      "alternatives": ["other_acceptable_terms"],
      "usage": "when to use this term",
      "note": "why this is the best choice"
    }
  },

  "contextualTerms": {
    "Product Name": {
      "asProductName": "rule for titles/headings",
      "inDescriptions": "rule for body text",
      "example": "real example of usage"
    }
  },

  "marketingPhrases": {
    "english_phrase": {
      "avoidLiteral": true,
      "targetAlternatives": ["option1", "option2"],
      "note": "why literal translation doesn't work"
    }
  }
}
```

**Output**: JSON file with 50-100 term mappings.

---

### Step 1.4: Translation Examples

**Goal**: Show LLM good vs bad patterns with reasoning.

**File**: `docs/translation-context/examples/translation-examples.json`

#### Structure

```json
{
  "comparativeExamples": [
    {
      "category": "Product Descriptions",
      "examples": [
        {
          "en": "English source text",
          "intent": "What should this achieve?",
          "literalTarget": "Word-for-word translation",
          "naturalTarget": "Market-adapted translation",
          "why": "Detailed explanation of why natural version works better"
        }
      ]
    }
  ],

  "patternGuidelines": {
    "goodPatterns": [
      "Pattern 1: Start with product category search term",
      "Pattern 2: Add concrete specifics (years, mm, class)"
    ],
    "avoidPatterns": [
      "Pattern 1: Direct word-for-word without considering natural phrasing",
      "Pattern 2: Superlatives without supporting evidence"
    ]
  }
}
```

**Output**: JSON with 20-40 before/after examples.

---

## Phase 2: Script Development

### Step 2.1: Set Up Project Structure

```bash
# Install dependencies
npm install --save-dev @mistralai/mistralai zod dotenv

# Create directories
mkdir -p utils/schemas
mkdir -p docs/translation-context/examples
```

Add to `.env`:
```env
MISTRAL_API_KEY=your_api_key_here
```

---

### Step 2.2: Create Validation Schemas

**File**: `utils/schemas/translation-schemas.js`

```javascript
import { z } from 'zod';

// Schema for namespace translations (UI text)
export const NamespaceTranslationSchema = z.record(
  z.string(),
  z.union([z.string(), z.record(z.string(), z.any())])
).describe('Translated namespace preserving all keys');

// Schema for complete response
export const TranslationResponseSchema = z.object({
  translations: z.record(z.string(), z.any()),
  metadata: z.object({
    keysProcessed: z.number(),
    improvementsCount: z.number(),
    unchangedCount: z.number(),
    notes: z.array(z.string()).optional()
  }).optional()
});

// Validation helpers
export function validateNamespaceTranslation(data) {
  return TranslationResponseSchema.parse(data);
}
```

**Purpose**: Ensures LLM returns valid, structured JSON.

---

### Step 2.3: Create Utility Functions

**File**: `utils/translation-utils.js`

**Key Functions to Implement:**

```javascript
// 1. Context loaders
export function loadTargetMarketContext() {
  return fs.readFileSync('docs/translation-context/target-market-context.md', 'utf8');
}

// 2. Backup creation
export function createBackup(filePath) {
  const backupPath = `${filePath}.backup`;
  const timestamped = `${filePath}.backup-${new Date().toISOString()}`;
  fs.copyFileSync(filePath, backupPath);
  fs.copyFileSync(filePath, timestamped);
  return backupPath;
}

// 3. Atomic file writing (temp file → rename for safety)
export function writeJsonAtomic(filePath, data, indent = 2) {
  const tempPath = `${filePath}.tmp`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, indent));
  fs.renameSync(tempPath, filePath);
}

// 4. System prompt builder
export function buildSystemPrompt() {
  const targetContext = loadTargetMarketContext();
  const sourceContext = loadSourceContext();
  const terminology = loadTerminology();

  return `You are a professional translator specializing in [product category] for [target market].

=== TARGET MARKET RESEARCH ===
${targetContext}

=== SOURCE LANGUAGE CONTEXT ===
${sourceContext}

=== TERMINOLOGY RULES ===
${JSON.stringify(terminology, null, 2)}

YOUR TASK:
Translate INTENT not WORDS. Make [target language] text achieve same emotional impact as English.
Use market research insights. Sound natural, not translated.
`;
}

// 5. Key preservation validation
export function validateKeysPreserved(original, translated) {
  const originalKeys = Object.keys(original);
  const translatedKeys = Object.keys(translated);

  const missing = originalKeys.filter(k => !translatedKeys.includes(k));
  const extra = translatedKeys.filter(k => !originalKeys.includes(k));

  return {
    isValid: missing.length === 0 && extra.length === 0,
    missingKeys: missing,
    extraKeys: extra
  };
}

// 6. Change counting
export function countChanges(original, polished) {
  let improved = 0, unchanged = 0;
  const changes = [];

  for (const key of Object.keys(original)) {
    if (original[key] !== polished[key]) {
      improved++;
      changes.push({ key, before: original[key], after: polished[key] });
    } else {
      unchanged++;
    }
  }

  return { improved, unchanged, total: improved + unchanged, changes };
}
```

---

### Step 2.4: Main Translation Script

**File**: `utils/polish-translations.js`

**Core Structure:**

```javascript
import { Mistral } from '@mistralai/mistralai';
import { buildSystemPrompt, createBackup, writeJsonAtomic } from './translation-utils.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// Configuration
const RATE_LIMIT_DELAY = 1000; // 1 second between requests
const MAX_RETRIES = 3;

// Parse CLI arguments
const args = process.argv.slice(2);
const options = {
  namespace: args.find(arg => arg.startsWith('--namespace='))?.split('=')[1],
  all: args.includes('--all'),
  dryRun: args.includes('--dry-run'),
  verbose: args.includes('--verbose')
};

// Initialize Mistral
function initMistral() {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    console.error('❌ MISTRAL_API_KEY not found in .env');
    process.exit(1);
  }
  return new Mistral({ apiKey });
}

// Polish a namespace with retry logic
async function polishNamespace(mistral, systemPrompt, namespaceName, namespaceData) {
  const userPrompt = `Polish the following [target language] translations from "${namespaceName}" namespace.

RULES:
1. Preserve ALL JSON keys exactly
2. Only modify translation values
3. Make translations sound natural for [target market]
4. Use terminology from context
5. Return valid JSON

Original translations:
${JSON.stringify(namespaceData, null, 2)}`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await mistral.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        responseFormat: { type: 'json_object' }
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result.translations || result;

    } catch (error) {
      console.error(`❌ Attempt ${attempt}/${MAX_RETRIES} failed:`, error.message);
      if (attempt < MAX_RETRIES) {
        await sleep(RATE_LIMIT_DELAY * attempt);
      }
    }
  }

  throw new Error(`Failed after ${MAX_RETRIES} attempts`);
}

// Main execution
async function main() {
  console.log('🚀 Translation Polisher Starting...\n');

  // Load context
  console.log('🔍 Loading context files...');
  const systemPrompt = buildSystemPrompt();
  console.log('✅ Context loaded\n');

  // Load translations file
  const translationsFile = 'path/to/translations.json';
  const data = JSON.parse(fs.readFileSync(translationsFile, 'utf8'));

  // Create backup if not dry-run
  if (!options.dryRun) {
    createBackup(translationsFile);
  }

  // Process namespace(s)
  const mistral = initMistral();

  if (options.namespace) {
    const originalData = data[options.namespace];
    const polishedData = await polishNamespace(mistral, systemPrompt, options.namespace, originalData);

    // Validate
    const validation = validateKeysPreserved(originalData, polishedData);
    if (!validation.isValid) {
      console.error('❌ Key validation failed');
      return;
    }

    // Show changes
    const changes = countChanges(originalData, polishedData);
    console.log(`✨ ${changes.improved} improvements, ${changes.unchanged} unchanged`);

    // Write if not dry-run
    if (!options.dryRun) {
      data[options.namespace] = polishedData;
      writeJsonAtomic(translationsFile, data);
      console.log('✅ File updated');
    } else {
      console.log('🚫 Dry-run - no changes made');
    }
  }
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
```

**Key Features:**
1. **Retry logic**: 3 attempts with exponential backoff
2. **Rate limiting**: 1 second between requests
3. **Backup creation**: Before any modifications
4. **Dry-run mode**: Preview changes without writing
5. **Key validation**: Ensures JSON structure preserved
6. **Change tracking**: Shows what improved vs unchanged

---

## Phase 3: Claude Agents

### Step 3.1: Polish Text Agent

**File**: `.claude/agents/polish-text/instructions.md`

**Template Structure:**

```markdown
# Polish Text Agent

## Purpose
[Describe what this agent does]

## Context Files
Load these files before starting:
- docs/translation-context/[target]-market-context.md
- docs/translation-context/en-source-context.md
- docs/translation-context/terminology-map.json

## Your Role
You are a professional [target language] translator specializing in [domain].

## Task Instructions

When asked to polish [target language] text:

1. **Read context files** to understand market expectations
2. **Analyze original text**: What is the intent?
3. **Apply market insights**: Use terms [target audience] searches for
4. **Follow terminology rules**: Never translate brand names
5. **Preserve**: Original meaning, technical accuracy
6. **Improve**: Natural flow, professional terminology, emotional impact

## Key Principles

### Do This ✅
- Sound like native speaker wrote it
- Use concrete specifics ([specific examples])
- Emphasize [market-specific values]
- Natural sentence structure

### Avoid This ❌
- Literal word-for-word translation
- Borrowed words when [target] equivalents exist
- Vague claims without support

## Examples

### Example 1: [Category]
**Original:** "[poor translation example]"
**Polished:** "[improved version]"
**Why:** [detailed reasoning]

[Add 5-10 examples]

## Output Format

When polishing text, provide:
1. **Polished version** - The improved text
2. **Key changes** - Brief summary
3. **Reasoning** - Why changes work better

## Quality Checklist
- [ ] Sounds natural to native speaker
- [ ] Uses market-appropriate terminology
- [ ] Maintains original intent
- [ ] No brand names translated
- [ ] Professional tone maintained
```

---

### Step 3.2: Translate Text Agent

**File**: `.claude/agents/translate-text/instructions.md`

**Similar structure, but focus on:**
- English → Target language
- Understanding English intent
- Adapting for target market psychology
- Not translating words but **translating impact**

---

## Phase 4: Documentation

### Step 4.1: Update Project Documentation

Add to your `README.md` or `CONTRIBUTING.md`:

```markdown
## Translation System

### Quick Start
```bash
# Preview changes
node utils/polish-translations.js --namespace=navigation --dry-run

# Apply changes
node utils/polish-translations.js --namespace=navigation
```

### Manual Translation
Ask Claude Code:
- "Use polish-text agent to improve: '[text]'"
- "Use translate-text agent to translate: '[English text]'"

### Context Files
All translation work references research in `docs/translation-context/`:
- Target market research
- Source language positioning
- Terminology standards
- Translation examples
```

---

## Adaptation Guide

### For Different Languages

**1. Replace Research Files:**
- `bg-market-context.md` → `[your-lang]-market-context.md`
- Update terminology map for your language pair
- Create language-specific translation examples

**2. Update Script Paths:**
```javascript
// In translation-utils.js
function loadTargetMarketContext() {
  return fs.readFileSync('docs/translation-context/fr-market-context.md', 'utf8');
  //                                                   ^^ your language code
}
```

**3. Adjust Terminology:**
```json
// terminology-map.json
{
  "technicalTerms": {
    "click system": {
      "fr": "système de clic",  // French
      "de": "Klicksystem",      // German
      "es": "sistema de clic"   // Spanish
    }
  }
}
```

---

### For Different Domains

**Example: E-commerce Fashion → SaaS Software**

**1. Research Focus Changes:**
```markdown
# SaaS Market Research

## Terminology Analysis
| English | Target | Notes |
|---------|--------|-------|
| dashboard | tableau de bord | Standard term
| workflow | flux de travail | Professional term
| API | API | Keep English acronym

## Buying Triggers (Different from E-commerce!)
1. Security/Privacy (critical for SaaS)
2. Integration capabilities
3. Scalability claims
4. Free trial availability
```

**2. Update System Prompt:**
```javascript
const systemPrompt = `You are a professional translator specializing in SaaS/B2B software for [target market].

TARGET MARKET VALUES:
- Security and compliance (emphasize certifications)
- Integration capabilities (list specific tools)
- ROI and efficiency gains (quantify benefits)
- Technical accuracy (developers will read this)
`;
```

**3. Adjust Translation Patterns:**
```json
{
  "saasPatterns": {
    "freeTrial": {
      "en": "Start your free trial",
      "target": "[Adapt based on market - some cultures skeptical of 'free']"
    },
    "security": {
      "en": "Enterprise-grade security",
      "target": "[Must mention specific standards: ISO, GDPR, etc.]"
    }
  }
}
```

---

### For Different LLM Providers

**Mistral AI → OpenAI GPT-4:**

```javascript
// Change import
import OpenAI from 'openai';

// Initialize client
function initOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// API call
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ],
  response_format: { type: 'json_object' }
});

const result = JSON.parse(response.choices[0].message.content);
```

**Mistral AI → Claude API (Anthropic):**

```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const response = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 8192,
  system: systemPrompt,
  messages: [
    { role: 'user', content: userPrompt }
  ]
});

// Claude returns JSON in content blocks
const result = JSON.parse(response.content[0].text);
```

---

## Best Practices

### 1. Always Start with Research
- 4 hours of market research saves 40 hours of poor translations
- Real user language > competitor marketing language
- Search behavior reveals actual terminology

### 2. Iterate on System Prompt
```javascript
// Start simple
const prompt = `Translate to [language]. Be natural.`;

// Add context
const prompt = `Translate to [language] for [audience]. Use these terms: [list]`;

// Add examples
const prompt = `... Here are good vs bad examples: [examples]`;

// Add market insights
const prompt = `... Target market values: [research insights]`;
```

### 3. Test on Small Namespaces First
```bash
# Start with 10-20 keys
node utils/polish-translations.js --namespace=navigation --dry-run

# Verify quality before scaling
node utils/polish-translations.js --namespace=longNamespace --dry-run
```

### 4. Version Control Strategy
```bash
# Create feature branch
git checkout -b translation-polish-navigation

# Run script
node utils/polish-translations.js --namespace=navigation

# Review changes
git diff messages/bg.json

# Commit if satisfied
git add messages/bg.json
git commit -m "Polish navigation translations with Mistral AI"
```

### 5. Human Review Workflow
1. **Dry-run first**: Always preview changes
2. **Sample review**: Human checks 10% of changes
3. **Test in app**: See translations in UI context
4. **Iterate**: Adjust context files if patterns emerge
5. **Document**: Note any manual overrides needed

---

## Troubleshooting

### LLM Not Following Instructions

**Problem**: LLM translates brand names or changes JSON keys

**Solution**:
```javascript
// Make instructions MORE explicit in system prompt
const systemPrompt = `
CRITICAL RULES (MUST FOLLOW):
1. NEVER translate these words: ${neverTranslate.join(', ')}
2. PRESERVE every JSON key exactly as-is
3. Only modify the values, never the keys

If you translate a brand name, the output will be rejected.
If you change a JSON key, the output will be rejected.
`;

// Add validation
if (translated.includes('Floer') && !original.includes('Floer')) {
  throw new Error('Brand name was incorrectly translated');
}
```

### API Rate Limiting

**Problem**: Too many requests, getting rate limited

**Solution**:
```javascript
// Increase delay between requests
const RATE_LIMIT_DELAY = 2000; // 2 seconds instead of 1

// Add exponential backoff
async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000); // 1s, 2s, 4s
    }
  }
}
```

### Inconsistent Quality

**Problem**: Some translations great, others poor

**Solution**:
1. **Add more examples** in translation-examples.json
2. **Be more specific** in market context about what matters
3. **Use few-shot prompting**:

```javascript
const userPrompt = `
Here are examples of good translations:
${goodExamples.slice(0, 3).map(ex => `"${ex.en}" → "${ex.target}"`).join('\n')}

Now translate this following the same pattern:
"${textToTranslate}"
`;
```

---

## Cost Optimization

### Token Usage Estimates

For EcoVibeFloors (Bulgarian translations):
- **System prompt**: ~11,000 tokens (context files)
- **User prompt (navigation)**: ~500 tokens (20 keys)
- **Response**: ~600 tokens
- **Total per namespace**: ~12,100 tokens

**Mistral Large pricing** (as of 2024):
- Input: $2 per 1M tokens
- Output: $6 per 1M tokens

**Cost per namespace**: ~$0.006 (less than 1 cent!)

### Optimization Strategies

**1. Batch small namespaces:**
```javascript
// Instead of processing 10 small namespaces separately
const combined = {
  navigation: data.navigation,
  buttons: data.buttons,
  errors: data.errors
};
// Process together in one API call
```

**2. Skip unchanged content:**
```javascript
// Hash namespace content, skip if unchanged since last run
const hash = crypto.createHash('md5').update(JSON.stringify(namespace)).digest('hex');
if (hash === lastProcessedHash) {
  console.log('⏭️  Skipping unchanged namespace');
  return;
}
```

**3. Cache context in memory:**
```javascript
// Load context once, reuse for all namespaces
const systemPrompt = buildSystemPrompt(); // Load once
for (const namespace of namespaces) {
  await polishNamespace(mistral, systemPrompt, namespace); // Reuse
}
```

---

## Success Metrics

### How to Measure Translation Quality

**1. A/B Test Search Traffic:**
- Deploy polished translations
- Track organic search traffic for key terms
- Goal: +10-20% traffic from target language

**2. User Engagement:**
- Bounce rate on translated pages
- Time on page
- Conversion rate
- Goal: Match or exceed English metrics

**3. Manual Quality Audit:**
- Sample 50 random translations
- Native speaker rates 1-5 on naturalness
- Goal: Average score ≥ 4.0

**4. Key Preservation:**
- Automated check: 100% of JSON keys preserved
- No missing translations
- No broken formatting

---

## Conclusion

This system is powerful because it combines:
1. **Deep market research** (understand target audience)
2. **Rich context** (teach LLM market psychology)
3. **Automation** (scale human-quality translations)
4. **Validation** (catch errors automatically)
5. **Human oversight** (review and improve)

**Time Investment:**
- Initial setup: 8-10 hours
- Per additional language: 4-6 hours (mostly research)
- Maintenance: 1 hour/month (update context as market evolves)

**ROI:**
- Eliminates ongoing translation costs
- Improves SEO performance
- Better user experience = higher conversion
- Reusable system across projects

---

## Additional Resources

### Recommended Reading
- "Found in Translation" by Nataly Kelly (translation business insights)
- "Don't Make Me Think" by Steve Krug (localization UX)
- LangOps best practices for software localization

### Tools
- **DeepL**: Good for initial research (see how professionals translate)
- **Google Keyword Planner**: Target language search volumes
- **SEMrush**: Competitor keyword analysis in target markets
- **AnswerThePublic**: Question patterns in target language

### Community
- r/translators (Reddit) - Professional translator insights
- ProductHunt i18n discussions - Startup localization strategies

---

**Created**: 2025-01-24
**Last Updated**: 2025-01-24
**Author**: EcoVibeFloors Translation System
**License**: MIT - Feel free to adapt for your projects!
