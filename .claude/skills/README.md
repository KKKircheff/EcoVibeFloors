# EcoVibeFloors Claude Code Skills

This directory contains specialized Claude Code skills for Bulgarian translation work in the luxury flooring domain.

## Available Skills

### 1. polish-text
**Purpose**: Refine existing Bulgarian translations
**Location**: `.claude/skills/polish-text/`
**Use when**: Improving Bulgarian text quality, naturalness, or SEO

**Activation examples:**
- "Can you polish this Bulgarian text: [text]"
- "Improve this Bulgarian translation"
- "Make this Bulgarian content sound more natural"

### 2. translate-text
**Purpose**: Translate English content to Bulgarian
**Location**: `.claude/skills/translate-text/`
**Use when**: Creating Bulgarian translations from English source

**Activation examples:**
- "Translate this to Bulgarian: [English text]"
- "Create Bulgarian version of this description"
- "Convert this English content to Bulgarian"

## Quick Start

### Prerequisites

1. **Environment Variables** (in `.env` file):
   ```env
   AZURE_API_KEY=your_azure_api_key
   TARGET_URL=your_azure_endpoint_url
   ```

2. **Node.js** installed with ES modules support

3. **Context Files** present in `docs/translation-context/`:
   - `terminology-map.json`
   - `bg-market-context.md`
   - `en-source-context.md`
   - `examples/translation-examples.json`
   - `../chat-gpt-bulgarian-language-guidance.md`

### Testing the Skills

You can test the skills in two ways:

#### Option 1: Through Claude Code (Recommended)
Simply describe your task naturally to Claude:

```
You: "Can you polish this Bulgarian text: Висококачествен холандски паркет"
```

Claude will automatically activate the `polish-text` skill and process your request.

#### Option 2: Direct Script Execution (for testing)

**Test polish-text:**
```bash
node .claude/skills/polish-text/scripts/polish-bulgarian.js \
  --text="Висококачествен холандски паркет" \
  --verbose
```

**Test translate-text:**
```bash
node .claude/skills/translate-text/scripts/translate-to-bulgarian.js \
  --text="Premium Dutch flooring with 25-year warranty" \
  --verbose
```

## How Skills Work

### Progressive Loading
1. **Startup**: Claude loads only skill names and descriptions (lightweight)
2. **Activation**: When task matches description, Claude loads full SKILL.md
3. **Execution**: Claude accesses context files and runs scripts as needed

### Automatic vs Manual Activation

**Automatic** (Preferred):
```
You: "Improve this Bulgarian translation: [text]"
→ Claude automatically uses polish-text skill
```

**Manual** (Also works):
```
You: "Use the polish-text skill to improve: [text]"
→ Claude explicitly activates polish-text skill
```

## Architecture

```
.claude/skills/
├── README.md                           # This file
├── shared/                             # Shared utilities
│   └── azure-translate.js              # Azure API wrapper
├── polish-text/                        # Polish Bulgarian skill
│   ├── SKILL.md                        # Skill definition
│   └── scripts/
│       └── polish-bulgarian.js         # Implementation
└── translate-text/                     # Translate to Bulgarian skill
    ├── SKILL.md                        # Skill definition
    └── scripts/
        └── translate-to-bulgarian.js   # Implementation
```

## Shared Utilities (`shared/azure-translate.js`)

Common functions used by both skills:

### `callAzureGPT(systemPrompt, userPrompt, options)`
Makes Azure GPT-4 API calls with custom prompts.

### `callAzureGPTWithRetry(systemPrompt, userPrompt, options, maxRetries)`
Calls Azure API with retry logic on JSON parse errors.

### `loadTranslationContext(fileNames)`
Loads translation context files from `docs/translation-context/`.

**Parameters:**
- `fileNames`: Array of context files to load
  - `'all'` - Load all context files
  - `'terminology'` - Only terminology-map.json
  - `'bg-market'` - Only bg-market-context.md
  - `'en-source'` - Only en-source-context.md
  - `'examples'` - Only translation-examples.json
  - `'guidance'` - Only chat-gpt-bulgarian-language-guidance.md

### `buildTranslationSystemPrompt(context, taskType)`
Builds comprehensive system prompt for Azure API.

**Parameters:**
- `context`: Loaded context data
- `taskType`: `'polish'` or `'translate'`

## Translation Principles

Both skills follow these core principles:

### 1. Translate Intent, Not Words
Capture emotional impact and persuasiveness, not literal translation.

### 2. Add Trust Signals
Always include concrete quality indicators:
- Warranty duration (25-годишна гаранция)
- Origin (германско/холандско качество)
- Technical specs (горен слой 3 мм)

### 3. Use Bulgarian Search Terms
- ✅ "трислоен паркет" not "инженерен паркет"
- ✅ "масивен паркет" not "солид дърво"
- ✅ "клик система" not "система за щракване"

### 4. Natural Phrasing
Avoid literal translations:
- ❌ "Изпитайте" (literal "experience")
- ✅ "Насладете се" (natural Bulgarian)

### 5. Professional Luxury Tone
Professional but approachable, quality-focused with concrete evidence.

## Context Files

### What They Contain

1. **terminology-map.json**
   - Never-translate terms (brand names)
   - Technical term equivalents
   - Marketing phrase guidelines

2. **bg-market-context.md**
   - Bulgarian flooring search terms
   - Market preferences
   - Popular search combinations

3. **en-source-context.md**
   - Floer and Ter Hürne brand positioning
   - Product messaging strategies
   - Writing style differences

4. **translation-examples.json**
   - Good vs bad translation examples
   - Pattern guidelines
   - Contextual notes

5. **chat-gpt-bulgarian-language-guidance.md**
   - Bulgarian grammar and style rules
   - Clarity and tone guidelines
   - SEO optimization strategies

## Response Format

Both skills return JSON with this structure:

```json
{
  "polished_text" | "bulgarian_translation": "result in Bulgarian",
  "changes_made" | "translation_notes": ["list of adaptations"],
  "quality_signals_added": ["warranty", "origin", "specs"],
  "seo_terms_used": ["Bulgarian keywords"],
  "content_type": "text|markdown|json"
}
```

## Content Type Support

Both skills handle multiple content formats:

### Plain Text
```
Input: "Premium oak flooring"
Output: "Премиум дъбов паркет"
```

### Markdown
```
Input: "# Hybrid Wood\n- Waterproof\n- Durable"
Output: "# Hybrid Wood\n- Водоустойчив\n- Издръжлив"
(Preserves formatting)
```

### JSON
```
Input: {"title": "Oak Flooring"}
Output: {"title": "Дъбов паркет"}
(Preserves structure, translates values)
```

## Integration with Existing Tools

These skills complement (don't replace) existing translation scripts:

| Use Case | Tool | When to Use |
|----------|------|-------------|
| Interactive translation | polish-text / translate-text skills | Ad-hoc work with Claude Code |
| Batch product processing | `utils/refine-and-translate-json.ts` | Process entire collections |
| Namespace translations | `utils/polish-translations.js` | Update `messages/bg.json` |

## Troubleshooting

### Skill Not Activating

1. **Check description specificity**: Does your request match the skill description?
2. **Verify file naming**: Must be `SKILL.md` (case-sensitive)
3. **Validate YAML syntax**: No tabs, proper indentation in frontmatter
4. **Check location**: Skills must be in `.claude/skills/[skill-name]/`

### API Errors

1. **Check environment variables**: `AZURE_API_KEY` and `TARGET_URL` in `.env`
2. **Verify API quota**: Azure API has rate limits
3. **Check internet connection**: API requires network access

### Context File Errors

1. **Verify file existence**: All context files must be present
2. **Check file paths**: Paths are relative to project root
3. **Validate JSON syntax**: JSON files must be valid

## Example Workflows

### Workflow 1: Polish Product Description
```
You: "Polish this Bulgarian description: Висококачествен паркет с UV лак"

Claude:
→ Activates polish-text skill
→ Loads translation context
→ Returns: "Премиум многослоен паркет с UV-обработка и удължена 25-годишна гаранция"
→ Explains improvements made
```

### Workflow 2: Translate Marketing Copy
```
You: "Translate to Bulgarian: Transform your home with timeless oak elegance"

Claude:
→ Activates translate-text skill
→ Loads full context (including source brand positioning)
→ Returns: "Преобразете вашия дом с класическата елегантност на дъба"
→ Explains market adaptations
```

### Workflow 3: Batch Processing File
```
You: "Review this JSON file and improve all Bulgarian translations"

Claude:
→ Reads JSON file
→ Activates polish-text skill for each Bulgarian value
→ Returns updated JSON with improvements
→ Provides summary of changes
```

## Version History

### v1.0.0 (2025-11-07)
- Initial release
- polish-text skill with market adaptation
- translate-text skill with content type detection
- Shared Azure API utilities
- Comprehensive context loading

## Maintenance

### Updating Context Files

Context files can be updated independently:

1. **Add new terminology**: Edit `docs/translation-context/terminology-map.json`
2. **Update market research**: Edit `docs/translation-context/bg-market-context.md`
3. **Add brand insights**: Edit `docs/translation-context/en-source-context.md`
4. **Add examples**: Edit `docs/translation-context/examples/translation-examples.json`

Skills will automatically use updated context on next activation.

### Skill Updates

To update skill behavior:

1. Edit `SKILL.md` for instructions/documentation
2. Edit scripts in `scripts/` for implementation
3. Update shared utilities in `shared/` if needed

## Support

For issues or questions:
1. Check this README
2. Review SKILL.md files for detailed documentation
3. Test scripts directly with `--verbose` flag
4. Check Azure API logs for errors

---

**Last Updated**: 2025-11-07
**Maintained by**: EcoVibeFloors Development Team
