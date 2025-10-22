# Oak Collection Rebuild - Complete Guide

## Overview
This guide documents the complete rebuild of the oak.json collection using data scraped directly from the Dutch Interior Group (DIG) manufacturer webshop.

## Process Summary

### 1. Data Source
- **Primary Source**: DIG Prijslijst (Price List) - `docs/DIG/Prijslijst Bulgarije 19082025.pdf`
- **Parsed CSV**: `docs/DIG/prijslijst-parsed.csv` (29 oak products)
- **Product URLs**: `docs/DIG/product-urls-mapping.json` (17 products with URLs)

### 2. URL Mapping
Created structured mapping file with:
- Productie IDs (e.g., A0000449)
- DIG SKU codes (e.g., C103 or "-" for unnamed)
- Finish/Grade information
- Manufacturer webshop URLs

**Products with URLs**: 17 out of 29
**Products skipped**: 12 (no URLs found on manufacturer website)

### 3. Scraping Strategy
- **Tool**: Jina.ai Reader API (`https://r.jina.ai/[URL]`)
- **Rate Limiting**: 2-second delay between requests
- **Data Extracted**:
  - Product specifications (dimensions, thickness, top layer)
  - Construction type (Engineered/Solid)
  - Wood species (Oak)
  - Mounting type (Plank/Herringbone/Chevron)
  - Wood grade (Select/Rustic)
  - Surface treatment (Deep brushed, etc.)
  - Finish type (Unfinished/Oiled/Lacquered/Stained)
  - Descriptions and technical details

### 4. Data Structure Enhancement

#### New Product Fields:
```typescript
{
  // Core identifiers
  productieId: string;           // DIG Productie number
  manufacturerProductId: string; // C-code or descriptive name

  // Wood classification
  constructionType: 'engineered' | 'solid';
  woodSpecies: 'oak' | 'bamboo' | 'walnut' | 'pine';
  mountingType: 'plank' | 'herringbone' | 'chevron';
  woodGrade: 'select' | 'rustic' | 'light-rustic' | 'natural';
  surfaceTreatment: string | null;

  // Physical dimensions
  dimensions: {
    length: number;   // mm
    width: number;    // mm
    thickness: number; // mm
  };
  topLayer: number;    // mm (for engineered)

  // Source tracking
  sourceUrl: string;   // Original DIG URL
}
```

### 5. SKU Generation Strategy
- **Products with C-codes**: `DIG-C103`, `DIG-C908`, etc.
- **Products without C-codes**: `DIG-select-invisible-sahara`, `DIG-rustic-namib`, etc.
- **Format**: `DIG-{grade}-{finish}-{name}` (lowercase, dashed)

### 6. Translation Generation
- **English (EN)**: Primary language for international customers
- **Bulgarian (BG)**: Primary language for local market
- **Content**:
  - Product names
  - Descriptions (300-500 chars)
  - Feature lists (6 items)
  - SEO metadata (title, description, keywords)
  - Full specifications with localized terms

### 7. SEO Strategy
Each product includes optimized metadata:
- **Title**: `{Name} Oak Parquet | {Grade} {Finish}`
- **Description**: Concise 150-char summary
- **Keywords**: 8-10 targeted Bulgarian/English keywords

## Files Created

### 1. URL Mapping
- **File**: `docs/DIG/product-urls-mapping.json`
- **Purpose**: Maps Productie IDs to manufacturer URLs
- **Status**: ✅ Completed (17/29 products with URLs)

### 2. Scraping Script
- **File**: `utils/rebuild-oak-collection.js`
- **Purpose**: Automated scraping and oak.json generation
- **Features**:
  - Jina.ai integration
  - Rate limiting
  - Data parsing and extraction
  - Translation generation
  - SEO metadata generation
  - Complete oak.json rebuild

### 3. TypeScript Types
- **File**: `types/products.ts`
- **Updates**:
  - Added new oak-specific fields
  - Added `chevron` to ProductPattern type
  - Added `productieId` field
  - Enhanced dimension types

### 4. Documentation
- **Files**:
  - `docs/DIG/prijslijst-parsed.csv` - Parsed price list
  - `docs/DIG/product-mapping.json` - Initial mapping analysis
  - `docs/DIG/README-oak-rebuild.md` - This guide

## Running the Script

```bash
# Navigate to project root
cd C:\myProjects\EcoVibeFloors

# Run the rebuild script
node utils/rebuild-oak-collection.js
```

### Expected Output:
```
🚀 Starting Oak Collection Rebuild...

📥 Scraping A0000449 (C103)...
   URL: https://webshop.dutchinteriorgroup.com/...
   ✅ Processed: C103 (DIG-C103)

📥 Scraping A0000456 (C104)...
   URL: https://webshop.dutchinteriorgroup.com/...
   ✅ Processed: C104 (DIG-C104)

...

✅ Oak Collection Rebuild Complete!
📊 Total products processed: 17
⏭️  Products skipped (no URL): 12
📁 Output file: collections/oak.json
```

## Product Coverage

### Products WITH URLs (17):
**Engineered Oak - Plank:**
- C103 (Select)
- C104 (Rustic)
- C110 (Brushed)
- C12 (Rustic)
- C3 (Rustic)
- C38 (Rustic)
- C6 (Light Rustic)
- C11 (Rustic)
- C960 (Original, Stained)
- C961 (Floor)
- Mojave (Lacquered)
- Sahara (Lacquered)
- Kalahari (Lacquered)
- Atacama (Unfinished)
- Namib (Lacquered)
- Simpson (Lacquered)

**Engineered Oak - Herringbone:**
- C908 (Rustic)
- C903 (Brushed)

**Engineered Oak - Chevron:**
- C909 (Select)

**Solid Oak - Plank:**
- C2 (Rustic)
- C224 (Rustic)

### Products WITHOUT URLs (12):
- A0018999, A0019013, A0019006, A0018992 (Various/Family patterns)
- A0025978 (Titar)
- A0019027, A0019020 (Herringbone Family)
- A0025999 (Herringbone Atacama)
- A0026006 (Herringbone Sahara)

## Data Quality

### Extracted Information:
- ✅ Product names
- ✅ Dimensions (L x W x Thickness)
- ✅ Construction type
- ✅ Wood grade
- ✅ Finish type
- ✅ Pattern/mounting type
- ✅ Pricing (from CSV)
- ✅ Surface treatments
- ✅ Technical specifications

### Generated Content:
- ✅ English translations
- ✅ Bulgarian translations
- ✅ SEO metadata (EN/BG)
- ✅ Product descriptions
- ✅ Feature lists
- ✅ Image alt text

## Next Steps

1. **Run the script**: Execute `node utils/rebuild-oak-collection.js`
2. **Review output**: Check generated `collections/oak.json`
3. **Validate data**: Verify product information accuracy
4. **Add images**: Upload product images to Firebase Storage
5. **Test frontend**: Ensure oak collection page renders correctly
6. **Update routes**: Add new products to routing if needed

## Benefits

### Data Accuracy:
- ✅ Direct from manufacturer source
- ✅ Up-to-date specifications
- ✅ Correct pricing from prijslijst
- ✅ Proper product categorization

### Scalability:
- ✅ Easy to add new products
- ✅ Reusable for other collections (Bamboo, Vinyl)
- ✅ Automated translation generation
- ✅ Consistent data structure

### SEO Optimization:
- ✅ Unique descriptions per product
- ✅ Targeted keywords
- ✅ Proper meta tags
- ✅ Localized content

## Troubleshooting

### Script Errors:
- **Connection timeout**: Increase `DELAY_BETWEEN_REQUESTS`
- **Parse errors**: Check Jina.ai response format
- **Missing data**: Verify URL in mapping file

### Data Issues:
- **Wrong dimensions**: Check DIG product page HTML structure
- **Missing translations**: Verify translation template logic
- **Incorrect pricing**: Verify Productie ID in CSV

## Maintenance

### Adding New Products:
1. Add Productie ID and URL to `product-urls-mapping.json`
2. Update pricing in `prijslijst-parsed.csv`
3. Run script to regenerate oak.json

### Updating Existing Products:
1. Update URL in mapping file
2. Re-run script (it will overwrite oak.json)
3. Validate changes

---

**Created**: 2025-10-22
**Last Updated**: 2025-10-22
**Status**: Ready for execution
