import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Extract width mappings from CSV file
 * @param {string} csvPath - Path to CSV file
 * @returns {Object} - Mapping of SKU to width value
 */
function extractWidthsFromCSV(csvPath) {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(csvContent);
  const widthMap = {};

  // Skip header row (index 0), process all data rows
  for (let i = 1; i < rows.length; i++) {
    const columns = rows[i];

    // Column 3 (index 2) = Article number (SKU)
    // Column 15 (index 14) = Waarde eigenschap 1 (Width value)
    const sku = columns[2]?.trim();
    const width = columns[14]?.replace(/\\,/g, '.').trim();

    if (sku && sku.startsWith('FLR-') && width && width.includes('cm')) {
      widthMap[sku] = width;
    }
  }

  return widthMap;
}

/**
 * Parse CSV content with proper handling of multi-line quoted fields
 * @param {string} content - CSV content
 * @returns {Array<Array<string>>} - Array of rows, each row is an array of columns
 */
function parseCSV(content) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote (doubled quote)
        currentField += '"';
        i += 2;
        continue;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      // Row separator (handle \r\n, \n, \r)
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n after \r
      }

      // End current row
      currentRow.push(currentField);
      if (currentRow.some(field => field.trim())) {
        // Only add non-empty rows
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      // Regular character
      currentField += char;
    }

    i++;
  }

  // Add last row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(field => field.trim())) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Add width to products in a collection JSON file
 * @param {string} jsonPath - Path to collection JSON file
 * @param {Object} widthMap - Mapping of SKU to width
 */
function addWidthToCollection(jsonPath, widthMap) {
  const collectionData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  let updatedCount = 0;

  collectionData.products.forEach(product => {
    const width = widthMap[product.sku];

    if (width) {
      // Add width to English specifications
      if (product.i18n?.en?.specifications?.dimensions) {
        product.i18n.en.specifications.dimensions.width = width;
        updatedCount++;
      }

      // Add width to Bulgarian specifications
      if (product.i18n?.bg?.specifications?.dimensions) {
        product.i18n.bg.specifications.dimensions.width = width;
      }
    } else {
      console.warn(`⚠️  Width not found for SKU: ${product.sku}`);
    }
  });

  // Write updated JSON back to file
  fs.writeFileSync(jsonPath, JSON.stringify(collectionData, null, 2), 'utf-8');

  return updatedCount;
}

// Main execution
(function main() {
  console.log('🚀 Starting width addition process...\n');

  const projectRoot = path.resolve(__dirname, '..');
  const csvPath = path.join(projectRoot, 'docs', 'floer', 'Floer-Vinyl-Collections.csv');
  const glueDownPath = path.join(projectRoot, 'collections', 'glue-down-vinyl.json');
  const clickVinylPath = path.join(projectRoot, 'collections', 'click-vinyl.json');

  // Step 1: Extract widths from CSV
  console.log('📊 Extracting width data from CSV...');
  const widthMap = extractWidthsFromCSV(csvPath);
  console.log(`✅ Found ${Object.keys(widthMap).length} SKUs with width data\n`);

  // Step 2: Update glue-down-vinyl.json
  console.log('📝 Updating glue-down-vinyl.json...');
  const glueDownUpdated = addWidthToCollection(glueDownPath, widthMap);
  console.log(`✅ Updated ${glueDownUpdated} products in glue-down-vinyl.json\n`);

  // Step 3: Update click-vinyl.json
  console.log('📝 Updating click-vinyl.json...');
  const clickVinylUpdated = addWidthToCollection(clickVinylPath, widthMap);
  console.log(`✅ Updated ${clickVinylUpdated} products in click-vinyl.json\n`);

  console.log('🎉 Width addition completed successfully!');
  console.log(`   Total products updated: ${glueDownUpdated + clickVinylUpdated}`);
})();
