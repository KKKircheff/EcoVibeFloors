---
name: translate-text
description: Translate new English content to Bulgarian with market-optimized, natural phrasing for luxury flooring. Use when user asks to translate, convert, or create Bulgarian versions from English source material, including plain text, markdown, or JSON content.
allowed-tools: [Read, Write, Edit, Bash]
version: 1.0.0
---

# Translate Text Skill

## Purpose
Translate English content to Bulgarian for EcoVibeFloors luxury flooring website. This skill creates market-optimized, natural Bulgarian translations that capture the same emotional impact and persuasiveness as the English source, adapted for Bulgarian market expectations.

## When to Use This Skill
Activate this skill when the user asks to:
- Translate English text to Bulgarian
- Create Bulgarian version of English content
- Convert English descriptions to Bulgarian
- Translate product information
- Translate marketing copy or SEO content
- Handle translation of plain text, markdown, or JSON structures

## Required Context Files

Before processing, this skill loads the following context files:

1. **Terminology Map** (REQUIRED)
   - Path: `docs/translation-context/terminology-map.json`
   - Purpose: Never-translate terms, brand names, technical equivalents
   - Contains: Bulgarian equivalents for technical flooring terms

2. **Translation Examples** (REQUIRED)
   - Path: `docs/translation-context/examples/translation-examples.json`
   - Purpose: Good vs bad translation patterns
   - Contains: Comparative examples with explanations of why certain choices are better

3. **Bulgarian Market Context** (REQUIRED)
   - Path: `docs/translation-context/bg-market-context.md`
   - Purpose: Bulgarian flooring market terminology and search behavior
   - Contains: Market research, popular search combinations, buyer preferences

4. **English Source Context** (REQUIRED)
   - Path: `docs/translation-context/en-source-context.md`
   - Purpose: Understanding brand positioning and source intent
   - Contains: Floer and Ter Hürne brand messaging, product positioning

5. **Bulgarian Language Guidance** (REQUIRED)
   - Path: `docs/chat-gpt-bulgarian-language-guidance.md`
   - Purpose: Writing style and grammar guidelines for Bulgarian
   - Contains: Detailed instructions for professional Bulgarian content

## How It Works

### Step 1: Content Type Detection
Automatically detects the format of input content:
- **Plain text**: Simple text strings
- **Markdown**: Formatted content with headings, lists, etc.
- **JSON**: Structured data with keys and values

### Step 2: Context Loading
Loads all required translation context files, including:
- Bulgarian market terminology
- English brand positioning
- Translation examples and patterns
- SEO keyword guidance

### Step 3: Azure GPT-4 Translation
Calls Azure GPT-4 API with:
- Comprehensive translation context
- Market adaptation guidelines
- Source content understanding
- The English text to translate

### Step 4: Market Adaptation
Applies Bulgarian market principles:
- Uses actual Bulgarian search terms
- Adds trust signals (warranty, origin, specs)
- Adapts tone for Bulgarian buyers
- Optimizes for SEO

### Step 5: Return Results
Returns JSON with:
- Bulgarian translation
- Translation notes (key adaptations)
- Quality signals added
- SEO terms incorporated

## Core Translation Principles

### 1. Translate INTENT, Not WORDS
Capture the same emotional impact and persuasiveness, not literal word-for-word translation.

**Example:**
- ❌ Literal: "Революционна хибридна технология" (revolutionary hybrid technology)
- ✅ Intent: "Иновативна технология - истински дъб върху водоустойчива основа" (innovative technology - real oak on waterproof base)

### 2. Add Concrete Quality Signals
Bulgarian buyers trust specifics, not vague claims:
- **Warranty**: "25-годишна гаранция" not just "дълга гаранция"
- **Origin**: "германско качество" or "холандски подови настилки"
- **Specs**: "горен слой 3 мм" not just "дебел горен слой"

### 3. Use Bulgarian Search Terms
Replace English terms with what Bulgarians actually search for:
- ✅ "трислоен паркет" not "инженерен паркет" (engineered wood)
- ✅ "масивен паркет" not "солид дърво" (solid wood)
- ✅ "клик система" not "система за щракване" (click system)
- ✅ "водоустойчив" not "водонепропусклив" (for general waterproof)

### 4. Market-Aware Adaptations

**Innovation Claims:**
- ❌ "Revolutionary" → "Революционна" (sounds risky/untested)
- ✅ "Revolutionary" → "Иновативна" + explanation of benefits

**Quality Positioning:**
- ❌ "Premium flooring" → "Премиум подови настилки"
- ✅ "Premium flooring" → "Премиум холандски подови настилки с 25-годишна гаранция"

**Emotional Benefits:**
- ❌ "Experience premium quality" → "Изпитайте премиум качество"
- ✅ "Experience premium quality" → "Насладете се на премиум качество"

### 5. Professional Luxury Tone
Maintain brand voice:
- Professional enough to build trust
- Friendly enough to be approachable
- Quality-focused with concrete evidence
- European luxury positioning

## Never Translate

These terms must ALWAYS remain in original language:

**Brand Names:**
- Floer
- Ter Hürne
- Dutch Interior Group (DIG)

**Proprietary Terms:**
- MEGAMAT
- CLICKitEASY
- SmartConnect
- vGroove
- Hywood

**Product Names in Titles:**
- "Hybrid Wood" in headings → Keep English
- Example: "Колекция Hybrid Wood"

## Always Translate

Use established Bulgarian equivalents:

| English | Bulgarian | Note |
|---------|-----------|------|
| click system | клик система | Standard industry term |
| engineered wood | многослоен паркет / трислоен паркет | Specify layer count if known |
| solid wood | масивен паркет | Well-established term |
| waterproof | водоустойчив | General use |
| wear layer | горен слой | More natural than "слой на износване" |
| usage class | клас на износване | Industry standard |
| underfloor heating | подово отопление | Critical Bulgarian feature |
| warranty | гаранция | Always include years |

## Usage Examples

### Example 1: Simple Text Translation
```
User: "Translate to Bulgarian: Premium Dutch flooring with 25-year warranty"

Skill Response:
{
  "bulgarian_translation": "Премиум холандски подови настилки с удължена 25-годишна гаранция",
  "translation_notes": [
    "Added 'удължена' (extended) to emphasize above-standard warranty",
    "Used 'подови настилки' (plural) for broader appeal",
    "Kept warranty duration prominent (critical trust signal)"
  ],
  "quality_signals_added": ["Dutch origin", "25-year warranty", "premium positioning"],
  "seo_terms_used": ["холандски подови настилки", "премиум", "гаранция"]
}
```

### Example 2: Marketing Copy Translation
```
User: "Translate: Discover revolutionary Hybrid Wood - where real oak beauty meets waterproof innovation"

Skill Response:
{
  "bulgarian_translation": "Открийте колекцията Hybrid Wood - истински дъбов слой върху водоустойчива основа с 25-годишна гаранция",
  "translation_notes": [
    "Avoided 'революционна' (revolutionary) - sounds risky in Bulgarian market",
    "Explained technology instead of claiming novelty",
    "Added warranty trust signal (not in original)",
    "Kept 'Hybrid Wood' as product name in English",
    "Emphasized 'real oak layer' for authenticity"
  ],
  "quality_signals_added": ["real oak", "warranty", "waterproof"],
  "seo_terms_used": ["дъбов", "водоустойчива", "гаранция"]
}
```

### Example 3: Technical Specification Translation
```
User: "Translate: Thickness: 10mm / Wear layer: 3mm / Compatible with underfloor heating"

Skill Response:
{
  "bulgarian_translation": "Обща дебелина: 10 мм / Горен слой: 3 мм / Подходящ за подово отопление",
  "translation_notes": [
    "Used 'обща дебелина' (total thickness) for clarity",
    "Used 'горен слой' (top layer) - more natural than 'слой на износване'",
    "Added proper spacing before units (10 мм, not 10мм)",
    "Used 'подходящ за' (suitable for) - simpler than 'съвместим със системи'"
  ],
  "quality_signals_added": ["specific measurements", "underfloor heating compatibility"],
  "seo_terms_used": ["подово отопление", "дебелина"]
}
```

### Example 4: JSON Translation (Preserves Structure)
```
User: "Translate this JSON to Bulgarian: {\"title\": \"Premium Oak Flooring\", \"description\": \"Beautiful and durable\"}"

Skill Response:
{
  "bulgarian_translation": {
    "title": "Премиум дъбов паркет",
    "description": "Красив и издръжлив"
  },
  "translation_notes": [
    "Preserved JSON structure",
    "Translated values only",
    "Used standard Bulgarian flooring terminology"
  ],
  "quality_signals_added": ["premium positioning"],
  "seo_terms_used": ["дъбов паркет", "премиум"]
}
```

## Content Type Handling

### Plain Text
- Translates directly
- Applies all market adaptation rules
- Returns string result

### Markdown
- Preserves formatting (headings, lists, links)
- Translates content only
- Maintains structure
- Returns formatted markdown

### JSON
- Preserves structure and keys
- Translates values only
- Handles nested objects
- Returns JSON object

## Technical Implementation

### Script Location
- Main script: `.claude/skills/translate-text/scripts/translate-to-bulgarian.js`
- Shared utilities: `.claude/skills/shared/azure-translate.js`

### Script Execution
The skill invokes the Node.js script which:
1. Detects content type (text/markdown/JSON)
2. Loads all required context files
3. Builds comprehensive system prompt with source context
4. Calls Azure GPT-4 API with retry logic
5. Applies market adaptation principles
6. Parses and returns JSON response
7. Handles errors gracefully

### Environment Requirements
- Node.js installed
- `.env` file with `AZURE_API_KEY` and `TARGET_URL`
- All context files present in `docs/translation-context/`

## Quality Checklist

Before finalizing any translation, verify:
- [ ] Sounds natural to native Bulgarian speaker (not "translated")
- [ ] Uses Bulgarian flooring industry search terms
- [ ] Includes concrete quality signals (warranty, origin, specs when relevant)
- [ ] Brand names and proprietary terms not translated
- [ ] Professional luxury tone maintained
- [ ] Grammatically correct with proper spacing (e.g., "3 мм" not "3мм")
- [ ] Technical terms use Bulgarian standards
- [ ] Achieves same emotional impact as English source
- [ ] Optimized for Bulgarian SEO when applicable

## Bulgarian Market Preferences

### What Bulgarians Value (Emphasize)
1. **Origin**: German/Dutch quality = trusted
2. **Warranty Duration**: Critical trust signal (always include years)
3. **Specifications**: Concrete numbers build credibility
4. **Proven Quality**: Prefer "иновативен" + explanation over "революционен"

### Translation Patterns

**Add Specifics to Quality Claims:**
```
EN: "High-quality flooring"
BG: "Висококачествени холандски подови настилки с 25-годишна гаранция"
(Added: origin + warranty)
```

**Explain Innovation Benefits:**
```
EN: "Revolutionary hybrid technology"
BG: "Иновативна технология - истински дъб върху водоустойчива основа"
(Avoided: "революционна", Explained: what it is)
```

**Natural Bulgarian Phrasing:**
```
EN: "Transform your space"
BG: "Преобразете вашето пространство"
(Not: "Трансформирайте" - borrowed word)
```

## Error Handling

If the skill encounters issues:
- **Missing context files**: Reports which files are missing
- **API errors**: Retries once on JSON parse errors
- **Invalid input**: Asks for clarification
- **Unsupported format**: Requests different format

## Integration with Existing Workflows

This skill complements your existing translation tools:
- **For interactive work**: Use this skill with Claude Code
- **For batch processing**: Use `utils/refine-and-translate-json.ts` script
- **For product collections**: Use collection translation scripts

## Notes for Users

- Optimized specifically for **luxury flooring content**
- Works best with product descriptions, marketing copy, and SEO content
- Handles plain text, markdown, and JSON structures
- Always applies market adaptation (not literal translation)
- You review and approve all translations

---

**Version**: 1.0.0
**Last Updated**: 2025-11-07
**Maintained by**: EcoVibeFloors Development Team
