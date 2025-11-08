# Quick Start Guide - JSON Product Scripts

## Overview
Two scripts to process product collections using Azure GPT-5:
1. **adjust-product-names-json.js** - Fix product name consistency
2. **refine-and-translate-json.js** - Improve English + translate to Bulgarian

## Prerequisites
- `.env` file with `AZURE_API_KEY` and `TARGET_URL`
- JSON version of your collection (e.g., `glue-down-vinyl.json`)

## Step 1: Adjust Product Names

Fixes product names in descriptions and SEO to match `i18n.bg.name` and `i18n.en.name`.

```bash
# Run on glue-down-vinyl.json
node utils/adjust-product-names-json.js

# Or specify collection
node utils/adjust-product-names-json.js --collection=hybrid-wood
```

**What it does:**
- Reads `collections/[name].json`
- Creates automatic backup
- Processes all products (1 second delay between each)
- Updates product names in descriptions and SEO
- Saves updated JSON

**Time:** ~30-40 seconds for 18 products

## Step 2: Refine & Translate

Improves English content quality and creates market-optimized Bulgarian translations.

```bash
# Run on glue-down-vinyl.json
node utils/refine-and-translate-json.js

# With verbose output
node utils/refine-and-translate-json.js --verbose

# Or specify collection
node utils/refine-and-translate-json.js --collection=hybrid-wood
```

**What it does:**
- Reads `collections/[name].json`
- Creates automatic backup
- Refines English descriptions and SEO
- Translates to Bulgarian with market optimization
- Adds quality signals (warranty, origin, specs)
- Saves updated JSON

**Time:** ~60-80 seconds for 18 products (2 second delay)

## Step 3: Copy Back to TypeScript

After processing the JSON:

1. Open the updated `collections/glue-down-vinyl.json`
2. Copy the `products` array
3. Paste into `collections/glue-down-vinyl.ts` replacing the old products array
4. Test in your application

## Safety Features

- **Automatic Backups**: `.backup-[timestamp]` files created before changes
- **Error Handling**: Continues even if individual products fail
- **Rate Limiting**: Respects Azure API quotas
- **Summary Reports**: Detailed statistics after completion

## Restoring from Backup

```bash
# List backups
ls collections/*.backup*

# Restore specific backup
cp collections/glue-down-vinyl.json.backup-2025-11-06T13-29-43-535Z collections/glue-down-vinyl.json
```

## Example Output

```
🚀 Starting Product Name Adjustment Process
============================================================
Collection: glue-down-vinyl
Mode: LIVE
============================================================

📂 Reading collection: glue-down-vinyl.json
✓ Found 18 products

💾 Backup created: glue-down-vinyl.json.backup-2025-11-06T13-29-43-535Z

[1/18] Processing: FLR-3040 - De Waal
  ✓ Changes detected:
    - Replaced incorrect product name in English description
    - Replaced incorrect product name in Bulgarian SEO

[2/18] Processing: FLR-3038 - Noordwijk Natural
  ✓ Changes detected:
    - Updated English SEO title
    - Updated Bulgarian description

...

📊 PROCESSING SUMMARY
============================================================
Total products processed: 18
✓ Updated: 15
⊘ Skipped (no changes): 3
❌ Errors: 0
============================================================
```

## Complete Workflow

```bash
# 1. Create JSON from TypeScript (if needed)
#    (You already did this manually)

# 2. Fix product name consistency
node utils/adjust-product-names-json.js

# 3. Refine and translate content
node utils/refine-and-translate-json.js

# 4. Review changes
git diff collections/glue-down-vinyl.json

# 5. Copy JSON products array back to .ts file

# 6. Test in application
npm run dev
```

## Help

```bash
node utils/adjust-product-names-json.js --help
node utils/refine-and-translate-json.js --help
```

## Notes

- Script 1 takes ~30-40 seconds (1s delay per product)
- Script 2 takes ~60-80 seconds (2s delay per product)
- Both create automatic backups
- Both print detailed progress and summary
- JSON is easier to work with than TypeScript imports
- After processing, copy the `products` array back to your `.ts` file

---

**Quick Commands:**
```bash
# Process glue-down-vinyl
node utils/adjust-product-names-json.js
node utils/refine-and-translate-json.js

# Then copy results from .json back to .ts file
```
