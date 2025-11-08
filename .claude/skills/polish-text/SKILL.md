---
name: polish-text
description: Refine existing Bulgarian translations for luxury flooring content using market insights and terminology standards. Use when user asks to improve, polish, refine, or fix Bulgarian text quality, naturalness, or SEO optimization.
allowed-tools: [Read, Write, Edit, Bash]
version: 1.0.0
---

# Polish Text Skill

## Purpose
Polish and refine existing Bulgarian translations for EcoVibeFloors luxury flooring content. This skill improves naturalness, professionalism, and market relevance while preserving the original meaning and intent.

## When to Use This Skill
Activate this skill when the user asks to:
- Improve Bulgarian text quality
- Polish or refine Bulgarian translations
- Make Bulgarian content sound more natural
- Fix translation issues or awkward phrasing
- Optimize Bulgarian SEO content
- Review and enhance product descriptions in Bulgarian

## Required Context Files

Before processing, this skill loads the following context files:

1. **Terminology Map** (REQUIRED)
   - Path: `docs/translation-context/terminology-map.json`
   - Purpose: Never-translate terms, brand names, technical equivalents
   - Contains: Bulgarian equivalents for technical flooring terms

2. **Translation Examples** (REQUIRED)
   - Path: `docs/translation-context/examples/translation-examples.json`
   - Purpose: Good vs bad translation patterns
   - Contains: Comparative examples with explanations

3. **Bulgarian Market Context** (REQUIRED)
   - Path: `docs/translation-context/bg-market-context.md`
   - Purpose: Bulgarian flooring market terminology and search terms
   - Contains: Market research, popular search combinations

4. **Bulgarian Language Guidance** (REQUIRED)
   - Path: `docs/chat-gpt-bulgarian-language-guidance.md`
   - Purpose: Writing style and grammar guidelines
   - Contains: Detailed instructions for Bulgarian content

5. **English Source Context** (OPTIONAL)
   - Path: `docs/translation-context/en-source-context.md`
   - Purpose: Brand positioning and source material understanding
   - Use: Load when working on brand-specific content

## How It Works

### Step 1: Context Loading
The skill automatically loads all required context files using the shared utility module.

### Step 2: Content Analysis
Analyzes the provided Bulgarian text to identify:
- Unnatural phrasing or literal translations
- Missing trust signals (warranty, origin, specifications)
- Opportunities for SEO optimization
- Incorrect or outdated terminology
- Tone inconsistencies

### Step 3: Azure GPT-4 Processing
Calls Azure GPT-4 API with:
- Comprehensive translation context
- Bulgarian market insights
- Quality guidelines
- The text to polish

### Step 4: Return Results
Returns JSON with:
- Polished Bulgarian text
- List of improvements made
- Quality signals added
- SEO terms incorporated

## Key Principles Applied

### 1. Translate Intent, Not Words
Focus on achieving the same emotional impact and persuasiveness as the original, not literal word-for-word translation.

### 2. Add Trust Signals
Always include concrete quality indicators:
- **Warranty duration**: "25-годишna гаранция" not just "гаранция"
- **Origin mention**: "германско качество" or "холандски подови настилки"
- **Technical specs**: "горен слой 3 мм" not just "дебел слой"

### 3. Use Bulgarian Search Terms
Replace technical English with what Bulgarians actually search for:
- ✅ "трислоен паркет" not "инженерен паркет"
- ✅ "водоустойчив" not "водонепропусклив" (for general use)
- ✅ "клик система" not "система за щракване"

### 4. Natural Phrasing
Avoid patterns that sound like translations:
- ❌ "Изпитайте премиум качество" (literal "experience")
- ✅ "Насладете се на премиум качество" (natural Bulgarian)

### 5. Professional Luxury Tone
Maintain formal but approachable voice:
- Professional enough to build trust
- Friendly enough to be approachable
- Avoid overly casual or cold/corporate language

## Usage Examples

### Example 1: Simple Text Polishing
```
User: "Can you polish this Bulgarian text: Висококачествен холандски паркет"

Skill Response:
{
  "polished_text": "Премиум холандски подови настилки с удължена 25-годишна гаранция",
  "changes_made": [
    "Added 'премиум' for luxury positioning",
    "Changed 'паркет' to 'подови настилки' for broader appeal",
    "Added warranty trust signal (25-year warranty)",
    "Used 'удължена' to emphasize above-standard warranty"
  ],
  "quality_signals_added": ["warranty duration", "premium positioning"],
  "seo_terms_used": ["холандски подови настилки", "премиум", "гаранция"]
}
```

### Example 2: Product Description Polishing
```
User: "Improve this Bulgarian product description: Революционна хибридна технология за водоустойчиви подове"

Skill Response:
{
  "polished_text": "Иновативна технология - истински дъб върху водоустойчива основа с 25-годишна гаранция, подходящо за подово отопление",
  "changes_made": [
    "Avoided 'революционна' (sounds risky) - used 'иновативна'",
    "Explained technology instead of claiming novelty",
    "Added 'истински дъб' for authenticity",
    "Added warranty trust signal",
    "Added practical benefit (underfloor heating compatibility)"
  ],
  "quality_signals_added": ["warranty", "real oak", "underfloor heating compatible"],
  "seo_terms_used": ["водоустойчива", "подово отопление", "дъб"]
}
```

### Example 3: Batch Processing
```
User: "Polish all Bulgarian descriptions in this JSON file"

Skill: Processes each description individually, returns updated JSON with all improvements tracked
```

## Technical Implementation

### Script Location
- Main script: `.claude/skills/polish-text/scripts/polish-bulgarian.js`
- Shared utilities: `.claude/skills/shared/azure-translate.js`

### Script Execution
The skill invokes the Node.js script which:
1. Loads all required context files
2. Builds comprehensive system prompt
3. Calls Azure GPT-4 API with retry logic
4. Parses and returns JSON response
5. Handles errors gracefully

### Environment Requirements
- Node.js installed
- `.env` file with `AZURE_API_KEY` and `TARGET_URL`
- All context files present in `docs/translation-context/`

## Quality Checklist

Before finalizing any polished translation, verify:
- [ ] Sounds natural to native Bulgarian speaker (not "translated")
- [ ] Uses Bulgarian flooring industry search terms
- [ ] Includes concrete quality signals (warranty, origin, specs when relevant)
- [ ] Brand names and proprietary terms not translated
- [ ] Professional luxury tone maintained
- [ ] Grammatically correct with proper spacing (e.g., "3 мм" not "3мм")
- [ ] Technical terms use Bulgarian standards (клик система, многослоен паркет, etc.)
- [ ] Achieves same emotional impact as original text

## Error Handling

If the skill encounters issues:
- **Missing context files**: Reports which files are missing
- **API errors**: Retries once on JSON parse errors
- **Invalid input**: Asks for clarification
- **No improvements needed**: Returns original text with note

## Notes for Users

- This skill is optimized for **luxury flooring content** specifically
- Works best with product descriptions, marketing copy, and SEO content
- Can handle plain text, markdown, or JSON structures
- Preserves formatting and structure while improving content
- Always reviews changes - you have final approval

## Integration with Existing Workflows

This skill complements (doesn't replace) your existing translation tools:
- **For interactive work**: Use this skill with Claude Code
- **For batch processing**: Use `utils/refine-and-translate-json.ts` script
- **For namespace translations**: Use `utils/polish-translations.js` script

---

**Version**: 1.0.0
**Last Updated**: 2025-11-07
**Maintained by**: EcoVibeFloors Development Team
