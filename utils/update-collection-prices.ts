import * as fs from 'fs';
import * as path from 'path';

interface Product {
  price: number;
  [key: string]: any;
}

interface Collection {
  products: Product[];
  [key: string]: any;
}

// Parse command-line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('❌ Usage: npx tsx utils/update-collection-prices.ts <collection-name> <multiplier> [offset]');
  console.error('   Example: npx tsx utils/update-collection-prices.ts oak 1.21');
  console.error('   Example: npx tsx utils/update-collection-prices.ts oak 1.21 3');
  console.error('   Formula: newPrice = (oldPrice * multiplier) + offset');
  process.exit(1);
}

const [collectionName, multiplierStr, offsetStr = '0'] = args;
const multiplier = parseFloat(multiplierStr);
const offset = parseFloat(offsetStr);

if (isNaN(multiplier) || multiplier <= 0) {
  console.error(`❌ Invalid multiplier: ${multiplierStr}. Must be a positive number.`);
  process.exit(1);
}

if (isNaN(offset)) {
  console.error(`❌ Invalid offset: ${offsetStr}. Must be a number.`);
  process.exit(1);
}

const collectionPath = path.join(process.cwd(), 'collections', `${collectionName}.json`);
const backupPath = `${collectionPath}.backup`;

// Check if file exists
if (!fs.existsSync(collectionPath)) {
  console.error(`❌ File not found: ${collectionPath}`);
  process.exit(1);
}

try {
  console.log(`\n📖 Reading ${collectionName}.json...`);

  // Read and parse JSON
  const fileContent = fs.readFileSync(collectionPath, 'utf-8');
  const collection: Collection = JSON.parse(fileContent);

  // Validate structure
  if (!collection.products || !Array.isArray(collection.products)) {
    console.error('❌ Invalid collection structure. Expected { products: [...] }');
    process.exit(1);
  }

  const productCount = collection.products.length;
  console.log(`✓ Found ${productCount} products`);

  // Create backup
  console.log(`\n💾 Creating backup...`);
  fs.writeFileSync(backupPath, fileContent, 'utf-8');
  console.log(`✓ Backup created: ${collectionName}.json.backup`);

  // Track price changes
  const priceChanges: Array<{ old: number; new: number }> = [];
  let minOldPrice = Infinity;
  let maxOldPrice = -Infinity;
  let minNewPrice = Infinity;
  let maxNewPrice = -Infinity;

  // Update prices
  const formulaText = offset !== 0
    ? `Formula: (price × ${multiplier}) + ${offset}`
    : `Formula: price × ${multiplier}`;
  console.log(`\n🔄 Updating prices...`);
  console.log(`   ${formulaText}`);

  collection.products.forEach((product, index) => {
    if (typeof product.price !== 'number') {
      console.warn(`⚠️  Warning: Product ${index + 1} has invalid price: ${product.price}`);
      return;
    }

    const oldPrice = product.price;
    const newPrice = parseFloat(((oldPrice * multiplier) + offset).toFixed(2));

    product.price = newPrice;
    priceChanges.push({ old: oldPrice, new: newPrice });

    // Track min/max
    minOldPrice = Math.min(minOldPrice, oldPrice);
    maxOldPrice = Math.max(maxOldPrice, oldPrice);
    minNewPrice = Math.min(minNewPrice, newPrice);
    maxNewPrice = Math.max(maxNewPrice, newPrice);
  });

  // Save updated collection
  const updatedContent = JSON.stringify(collection, null, 2);
  fs.writeFileSync(collectionPath, updatedContent, 'utf-8');

  // Display summary
  console.log(`✓ All prices updated successfully\n`);
  console.log('📊 Summary:');
  console.log(`   Products updated: ${priceChanges.length}`);
  console.log(`   Old price range: ${minOldPrice.toFixed(2)} - ${maxOldPrice.toFixed(2)}`);
  console.log(`   New price range: ${minNewPrice.toFixed(2)} - ${maxNewPrice.toFixed(2)}`);

  // Show sample changes (first 5 and last 5)
  console.log('\n📈 Sample price changes:');
  const samplesToShow = Math.min(5, priceChanges.length);

  for (let i = 0; i < samplesToShow; i++) {
    const { old, new: newPrice } = priceChanges[i];
    console.log(`   ${old.toFixed(2)} → ${newPrice.toFixed(2)}`);
  }

  if (priceChanges.length > 10) {
    console.log('   ...');
    for (let i = priceChanges.length - samplesToShow; i < priceChanges.length; i++) {
      const { old, new: newPrice } = priceChanges[i];
      console.log(`   ${old.toFixed(2)} → ${newPrice.toFixed(2)}`);
    }
  }

  console.log(`\n✅ Saved to collections/${collectionName}.json`);
  console.log(`\n💡 Next step: Copy the updated data to collections/${collectionName}.ts\n`);

} catch (error) {
  console.error(`\n❌ Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
