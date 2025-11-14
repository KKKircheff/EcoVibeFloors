# Oak Collection Storage Setup Guide

## Overview
Complete guide for setting up Firebase Storage for the Oak collection with GTIN-based SKUs and WebP images.

## What Changed

### 1. SKU Format
- **Old**: `DIG-C103`, `DIG-rustic-everglades`, etc. (inconsistent)
- **New**: `DIG-A0000449` (always `DIG-{GTIN}`)
- **Benefits**: Stable SKUs that match product IDs, easier image management

### 2. Image Management
- **Source**: `public/images/oak/products/{GTIN}.jpg`
- **Converted**: `public/images/oak/products/{GTIN}.webp` (90% quality)
- **Array**: Duplicated for hover effect: `["A0000449.webp", "A0000449.webp"]`

### 3. Storage Structure
- **Path**: `products/oak/{pattern}/{sku}/full/{GTIN}.webp`
- **Example**: `products/oak/plank/DIG-A0000449/full/A0000449.webp`
- **Note**: Only full size images (no thumbnails)

## Prerequisites

✅ **Completed**:
1. oak.json refactored with GTIN-based SKUs
2. Image arrays updated with duplicated GTIN filenames
3. JPG to WebP conversion script created
4. Firebase Storage upload script refactored

⏳ **Pending**:
1. Convert JPG images to WebP
2. Upload images to Firebase Storage
3. Validate Storage structure

## Step-by-Step Instructions

### Step 1: Convert Images to WebP

```bash
# Navigate to project root
cd C:\myProjects\EcoVibeFloors

# Run conversion script
node scripts/convert-oak-images-to-webp.js
```

**Expected output**:
```
🖼️  Converting Oak Product Images to WebP...
📁 Source directory: C:\myProjects\EcoVibeFloors\public\images\oak\products
⚙️  Quality: 90%

📊 Found 21 JPG files to convert

✅ A0000449.jpg → A0000449.webp
   Size: 245.32 KB → 187.45 KB (23.6% smaller)
...
🎉 Conversion Complete!
✅ Converted: 21
```

**What it does**:
- Finds all .jpg files in `public/images/oak/products/`
- Converts to WebP with 90% quality
- Outputs `.webp` files alongside originals
- Shows file size savings

### Step 2: Verify Converted Images

**Manual check**:
1. Navigate to `public/images/oak/products/`
2. Verify 21 `.webp` files exist
3. Spot-check image quality (open a few in browser)
4. Confirm filenames match GTINs (e.g., `A0000449.webp`)

### Step 3: Upload to Firebase Storage

```bash
# Run Firebase Storage setup
node scripts/setup-oak-storage.js
```

**Expected output**:
```
🚀 Oak Collection Firebase Storage Setup
==========================================

📊 Found 21 oak products
📁 Image source: C:\myProjects\EcoVibeFloors\public\images\oak\products
📁 Storage structure: products/oak/{pattern}/{sku}/full/{GTIN}.webp

⚠️  This will upload images to Firebase Storage.

🔄 Starting upload process...

📦 Processing: oak-a0000449 (DIG-A0000449)
   GTIN: A0000449
   Uploading full/A0000449.webp... ✅
...
==========================================
📈 Upload Summary
==========================================
Total products processed: 21
Total uploads attempted: 21
Successful uploads: 21
Success rate: 100.0%
✅ All uploads completed successfully!
```

### Step 4: Validate Firebase Storage

**Firebase Console check**:
1. Go to Firebase Console: https://console.firebase.google.com
2. Navigate to Storage
3. Browse to `products/oak/`
4. Verify folder structure:
   ```
   oak/
   ├── plank/
   │   ├── DIG-A0000449/
   │   │   └── full/
   │   │       └── A0000449.webp
   │   ├── DIG-A0000456/
   │   │   └── full/
   │   │       └── A0000456.webp
   │   ...
   ├── herringbone/
   │   └── DIG-A0002129/
   │       └── full/
   │           └── A0002129.webp
   └── chevron/
       └── DIG-A0002143/
           └── full/
               └── A0002143.webp
   ```

## Product Mapping

### All 21 Products:

| #  | GTIN      | Old SKU               | New SKU      | Pattern      | Image File      |
|----|-----------|----------------------|--------------|--------------|-----------------|
| 1  | A0000449  | DIG-C103             | DIG-A0000449 | plank        | A0000449.webp   |
| 2  | A0000456  | DIG-C104             | DIG-A0000456 | plank        | A0000456.webp   |
| 3  | A0000463  | DIG-C110             | DIG-A0000463 | plank        | A0000463.webp   |
| 4  | A0000120  | DIG-C12              | DIG-A0000120 | plank        | A0000120.webp   |
| 5  | A0000029  | DIG-C3               | DIG-A0000029 | plank        | A0000029.webp   |
| 6  | A0000197  | DIG-C38              | DIG-A0000197 | plank        | A0000197.webp   |
| 7  | A0000071  | DIG-C6               | DIG-A0000071 | plank        | A0000071.webp   |
| 8  | A0000113  | DIG-C11              | DIG-A0000113 | plank        | A0000113.webp   |
| 9  | A0002269  | DIG-C960             | DIG-A0002269 | plank        | A0002269.webp   |
| 10 | A0002276  | DIG-C961             | DIG-A0002276 | plank        | A0002276.webp   |
| 11 | A0019111  | DIG-natural-mojave   | DIG-A0019111 | plank        | A0019111.webp   |
| 12 | A0019104  | DIG-oak-sahara       | DIG-A0019104 | plank        | A0019104.webp   |
| 13 | A0019097  | DIG-oak-kalahari     | DIG-A0019097 | plank        | A0019097.webp   |
| 14 | A0019090  | DIG-select-alacama   | DIG-A0019090 | plank        | A0019090.webp   |
| 15 | A0025985  | DIG-rustic-namib     | DIG-A0025985 | plank        | A0025985.webp   |
| 16 | A0025992  | DIG-rustic-simpson   | DIG-A0025992 | plank        | A0025992.webp   |
| 17 | A0002129  | DIG-C908             | DIG-A0002129 | herringbone  | A0002129.webp   |
| 18 | A0011054  | DIG-C903             | DIG-A0011054 | herringbone  | A0011054.webp   |
| 19 | A0002143  | DIG-C909             | DIG-A0002143 | chevron      | A0002143.webp   |
| 20 | A0000008  | DIG-C2               | DIG-A0000008 | plank        | A0000008.webp   |
| 21 | A0000603  | DIG-C224             | DIG-A0000603 | plank        | A0000603.webp   |

## Troubleshooting

### Issue: "Image not found" during conversion
**Solution**: Verify JPG files exist in `public/images/oak/products/` with GTIN names

### Issue: "Sharp module not found"
**Solution**: Sharp is already installed via Next.js, no action needed

### Issue: Upload fails to Firebase
**Solution**:
1. Check Firebase credentials in script
2. Verify Storage bucket name
3. Check internet connection
4. Review Firebase Storage Rules

### Issue: Images don't display on website
**Solution**:
1. Verify Storage URL in app matches new structure
2. Check oak.json has correct image filenames
3. Clear browser cache
4. Check Firebase Storage Rules allow read access

## Files Modified

1. ✅ `collections/oak.json` - All SKUs refactored to `DIG-{GTIN}`
2. ✅ `utils/refactor-oak-skus.js` - SKU refactoring script
3. ✅ `scripts/convert-oak-images-to-webp.js` - Image conversion script
4. ✅ `scripts/setup-oak-storage.js` - Firebase upload script (refactored)

## Next Steps After Upload

1. **Test Image Loading**: Visit oak product pages and verify images load
2. **Check Hover Effect**: Verify hover shows "second" image (same image)
3. **Performance Check**: Verify WebP reduces page load time
4. **Clean Up**: Optionally delete original JPG files to save space

---

**Created**: 2025-10-22
**Last Updated**: 2025-10-22
**Status**: Ready for image conversion and upload
