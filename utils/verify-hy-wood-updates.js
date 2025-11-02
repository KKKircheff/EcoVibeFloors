/**
 * Script to verify Hy-Wood product updates
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const collectionPath = path.join(__dirname, '..', 'collections', 'hy-wood.json');
const data = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

const stats = {
  total: data.products.length,
  hasDescription: 0,
  hasSurfaceTreatment: 0,
  evo: 0,
  olio: 0,
  noPlaceholders: 0
};

data.products.forEach(p => {
  // Check if descriptions are not placeholders
  if (p.i18n.en.description !== 'en' &&
      p.i18n.bg.description !== 'bg' &&
      p.i18n.en.description.length > 50 &&
      p.i18n.bg.description.length > 50) {
    stats.hasDescription++;
  }

  // Check if no placeholders in SEO descriptions
  if (p.i18n.en.seo.description !== 'en' &&
      p.i18n.bg.seo.description !== 'bg') {
    stats.noPlaceholders++;
  }

  // Check surfaceTreatment
  if (p.surfaceTreatment) {
    stats.hasSurfaceTreatment++;
  }

  // Count by surface treatment
  if (p.surfaceTreatment === 'evo') {
    stats.evo++;
  } else if (p.surfaceTreatment === 'olio') {
    stats.olio++;
  }
});

console.log('\n✅ Verification Results:');
console.log('========================');
console.log(`Total products: ${stats.total}`);
console.log(`✓ Has full descriptions: ${stats.hasDescription}/${stats.total}`);
console.log(`✓ Has SEO descriptions: ${stats.noPlaceholders}/${stats.total}`);
console.log(`✓ Has surfaceTreatment: ${stats.hasSurfaceTreatment}/${stats.total}`);
console.log(`✓ EVO products: ${stats.evo}`);
console.log(`✓ OLIO products: ${stats.olio}`);

if (stats.hasDescription === stats.total &&
    stats.noPlaceholders === stats.total &&
    stats.hasSurfaceTreatment === stats.total &&
    stats.evo + stats.olio === stats.total) {
  console.log('\n🎉 All verifications passed!');
} else {
  console.log('\n⚠️  Some products may need attention');
}
