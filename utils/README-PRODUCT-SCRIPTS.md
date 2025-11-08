# Product Processing Scripts

This directory contains two automated scripts for processing glue-down-vinyl (and other) product collections using Azure GPT-5 for intelligent content refinement and translation.

## Prerequisites

1. **Environment Variables** (`.env` file):
   ```bash
   TARGET_URL=https://kirch-md03vahe-swedencentral.cognitiveservices.azure.com/openai/deployments/gpt-5-chat/chat/completions?api-version=2025-01-01-preview
   AZURE_API_KEY=your-api-key-here
   ```

2. **Dependencies**: All npm packages should already be installed. These scripts use:
   - `dotenv` - for environment variables
   - Native Node.js modules (`fs`, `path`)

3. **Context Files**: The scripts automatically load translation context from:
   - `docs/translation-context/terminology-map.json`
   - `docs/translation-context/bg-market-context.md`
   - `docs/translation-context/en-source-context.md`

## Script 1: `adjust-product-names.js`

### Purpose
Ensures product names in descriptions and SEO metadata match the correct translated names stored in `i18n.bg.name` and `i18n.en.name`.

### What It Does
1. Reads the collection TypeScript file
2. For each product:
   - Extracts the correct English and Bulgarian product names
   - Calls Azure GPT-5 to adjust descriptions and SEO to use these names
   - Ensures natural integration of names into content
3. Updates the collection file with adjusted content
4. Creates timestamped backup before modifications

### Usage

**Preview changes without modifying files:**
```bash
node utils/adjust-product-names.js --dry-run
```

**Process glue-down-vinyl collection (default):**
```bash
node utils/adjust-product-names.js
```

**Process specific collection:**
```bash
node utils/adjust-product-names.js --collection=hybrid-wood
```

**Preview changes for specific collection:**
```bash
node utils/adjust-product-names.js --collection=hybrid-wood --dry-run
```

### Options
- `--collection=NAME` - Collection to process (default: glue-down-vinyl)
- `--dry-run` - Preview changes without modifying files
- `--help` - Show help message

### Output
The script provides:
- Real-time progress for each product
- List of specific changes made per product
- Summary statistics (processed, updated, skipped, errors)
- Automatic backup file (`.backup-TIMESTAMP`)

### Example Output
```
🚀 Starting Product Name Adjustment Process
============================================================
Collection: glue-down-vinyl
Mode: LIVE
============================================================

📖 Loading translation context files...
✓ Translation context loaded successfully

📂 Reading collection: glue-down-vinyl.ts
✓ Found 18 products

💾 Backup created: glue-down-vinyl.ts.backup-2025-11-06T10-30-45-123Z

[1/18] Processing: FLR-3040 - Village Vinyl - Callantsoog
  ✓ Changes detected:
    - Updated English description to use 'Village Vinyl - Callantsoog'
    - Updated Bulgarian SEO title with correct name

[2/18] Processing: FLR-3041 - Village Vinyl - Casares
  ⊘ No changes needed

...

📊 PROCESSING SUMMARY
============================================================
Total products processed: 18
✓ Updated: 12
⊘ Skipped (no changes): 6
❌ Errors: 0
============================================================
```

---

## Script 2: `refine-and-translate.js`

### Purpose
Refines English product content for clarity and luxury positioning, then creates high-quality market-optimized Bulgarian translations.

### What It Does
1. Reads the collection TypeScript file
2. For each product:
   - **Refines English**: Improves descriptions and SEO for clarity
   - **Translates to Bulgarian**: Creates natural, SEO-optimized translations
   - Applies Bulgarian market terminology and quality signals
   - Adds trust builders (warranty mentions, origin, specs)
3. Updates both English and Bulgarian content
4. Creates timestamped backup before modifications

### Translation Approach
The script uses comprehensive translation guidelines:
- **Intent-based translation** (not literal word-for-word)
- **Bulgarian SEO terms** (масивен паркет, трислоен паркет, водоустойчив)
- **Quality signals** (25-годишна гаранция, германско качество)
- **Natural phrasing** (sounds like native speaker wrote it)
- **Professional luxury tone** with warmth and trust

### Usage

**Preview changes with detailed output:**
```bash
node utils/refine-and-translate.js --dry-run --verbose
```

**Process all products in glue-down-vinyl collection:**
```bash
node utils/refine-and-translate.js
```

**Process specific collection:**
```bash
node utils/refine-and-translate.js --collection=hybrid-wood
```

**Preview changes without verbose output:**
```bash
node utils/refine-and-translate.js --dry-run
```

### Options
- `--collection=NAME` - Collection to process (default: glue-down-vinyl)
- `--dry-run` - Preview changes without modifying files (saves preview to `.preview-TIMESTAMP.txt`)
- `--verbose` - Show detailed preview of changes during processing
- `--help` - Show help message

### Output
The script provides:
- Real-time progress for each product
- List of improvements made per product
- Quality signals added (warranty, specs, origin)
- Preview snippets in verbose mode
- Summary statistics with detailed breakdown
- Preview file in dry-run mode for review

### Example Output
```
🚀 Starting Translation & Refinement Process
============================================================
Collection: glue-down-vinyl
Mode: DRY RUN
Verbose: YES
============================================================

📖 Loading translation context files...
✓ Translation context loaded successfully

📂 Reading collection: glue-down-vinyl.ts
✓ Found 18 products

[1/18] Processing: FLR-3040 - Village Vinyl - Callantsoog
  ✓ Improvements made:
    - Enhanced English description with luxury positioning
    - Added warranty mention to Bulgarian translation
    - Improved Bulgarian SEO with market search terms
  📊 Quality signals added:
    - 20-year warranty mention
    - Dutch quality origin
    - Water-resistant specification

  📝 Preview of changes:
  EN Description: Discover the Floer Village Vinyl - Callantsoog Cream White Oak, a premium extra-large vinyl...
  BG Description: Открийте холандския Floer Village Vinyl - Callantsoog Кремwit Дъб с 20-годишна гаранция...
  BG SEO Title: Village Vinyl - Callantsoog Кремwit Дъб | Водоустойчив Холандски Винил | Floer България

[2/18] Processing: FLR-3041 - Village Vinyl - Casares
  ✓ Improvements made:
    - Refined English description clarity
    - Added concrete specifications to Bulgarian content
    - Optimized Bulgarian keywords for local search
  📊 Quality signals added:
    - MEGAMAT finish specification
    - Installation system mention
    - Warranty detail

...

📝 Updating collection file...
✓ Dry run - no changes written to file
✓ Preview saved to: glue-down-vinyl.ts.preview-1699267845123.txt

📊 PROCESSING SUMMARY
============================================================
Total products processed: 18
✓ Updated: 18
⊘ Skipped (no changes): 0
❌ Errors: 0

✅ Products successfully improved:
  - FLR-3040: Village Vinyl - Callantsoog
    Improvements: 3
  - FLR-3041: Village Vinyl - Casares
    Improvements: 3
  ...

⚠️  DRY RUN MODE - No changes were written to collection file
   Review the preview file to see proposed changes
============================================================
```

---

## Safety Features

Both scripts include:

1. **Automatic Backups**: Timestamped backups created before any modifications
2. **Dry-Run Mode**: Preview changes without modifying files
3. **Error Handling**: Continues processing even if individual products fail
4. **Rate Limiting**: Waits between API calls to respect Azure quotas
5. **Progress Tracking**: Real-time feedback on processing status
6. **Summary Reports**: Detailed statistics after completion

## Workflow Recommendations

### Initial Run (Safe Approach)
1. **Always start with dry-run:**
   ```bash
   node utils/adjust-product-names.js --dry-run
   node utils/refine-and-translate.js --dry-run --verbose
   ```

2. **Review the output and preview files**

3. **Run live processing:**
   ```bash
   node utils/adjust-product-names.js
   node utils/refine-and-translate.js
   ```

4. **Review changes with git:**
   ```bash
   git diff collections/glue-down-vinyl.ts
   ```

5. **Test the affected pages in the application**

6. **Commit if satisfied, or restore from backup:**
   ```bash
   # Restore if needed
   cp collections/glue-down-vinyl.ts.backup-TIMESTAMP collections/glue-down-vinyl.ts
   ```

### Processing Order
It's recommended to run scripts in this order:
1. **First**: `adjust-product-names.js` - fixes name consistency
2. **Second**: `refine-and-translate.js` - improves overall quality and translations

### Batch Processing Multiple Collections
```bash
# Process multiple collections in sequence
node utils/adjust-product-names.js --collection=glue-down-vinyl
node utils/adjust-product-names.js --collection=hybrid-wood
node utils/adjust-product-names.js --collection=click-vinyl

# Then refine translations
node utils/refine-and-translate.js --collection=glue-down-vinyl
node utils/refine-and-translate.js --collection=hybrid-wood
node utils/refine-and-translate.js --collection=click-vinyl
```

## Troubleshooting

### Error: "Missing AZURE_API_KEY or TARGET_URL"
- Ensure `.env` file exists in project root
- Check that environment variables are correctly set

### Error: "Could not find products array"
- Verify the collection TypeScript file has correct structure
- Check that file exports default object with `products` array

### Error: "Azure API error: 429"
- Rate limit exceeded - increase wait time between requests
- Edit scripts and change `setTimeout` duration (currently 1-2 seconds)

### Error: Dynamic import fails
- Ensure TypeScript collection file has valid syntax
- Try running `npx tsc --noEmit` to check for TS errors

### Preview file not generated in dry-run
- Check write permissions in `collections/` directory
- Verify disk space available

## API Usage & Costs

### Token Consumption Per Product
- **adjust-product-names.js**: ~1,500-2,500 tokens per product
- **refine-and-translate.js**: ~2,500-4,000 tokens per product

### Estimated Time
- **18 products** (glue-down-vinyl): ~1-2 minutes per script
- Rate limiting: 1-2 seconds between API calls

### Cost Estimation (Azure GPT-5)
Check current Azure pricing for GPT-5 model. Approximate per collection:
- Input tokens: ~30,000-50,000
- Output tokens: ~15,000-30,000

## Files Modified

Both scripts modify:
- `collections/[collection-name].ts` - Main collection file

Both scripts create:
- `collections/[collection-name].ts.backup-TIMESTAMP` - Automatic backup

Script 2 additionally creates (in dry-run mode):
- `collections/[collection-name].ts.preview-TIMESTAMP.txt` - Preview of changes

## Integration with Existing Workflow

These scripts complement the existing translation utilities:
- `polish-translations.js` - For namespace translations in `messages/bg.json`
- `polish-collection-translations.js` - Alternative product translation approach
- Translation agents (polish-text, translate-text) - For manual refinement

Choose the approach that best fits your workflow:
- **Automated batch processing**: Use these new scripts
- **Individual product refinement**: Use translation agents with Claude
- **Namespace translations**: Use `polish-translations.js`

## Support

For issues or questions:
1. Check this README for troubleshooting steps
2. Review script output for specific error messages
3. Examine backup files if unexpected changes occur
4. Use `--dry-run` mode to preview before applying changes

---

**Created**: 2025-11-06
**Scripts**: `adjust-product-names.js`, `refine-and-translate.js`
**Collections**: glue-down-vinyl, hybrid-wood, click-vinyl (and others)
