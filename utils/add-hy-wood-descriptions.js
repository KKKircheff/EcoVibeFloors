/**
 * Script to add descriptions and surfaceTreatment field to Hy-Wood products
 *
 * Usage: node utils/add-hy-wood-descriptions.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Description mappings from docs/hy-wood-descr.md
const DESCRIPTIONS = {
  'classic-evo': {
    en: "Experience the natural warmth of oak in every plank, enriched with unique grain patterns and subtle knots. The EVO lacquered finish enhances durability while preserving the wood's elegant, cozy appeal. With innovative hybrid technology, the floor offers excellent water and scratch resistance, perfect for active homes. Its click system ensures fast installation and long-lasting comfort in spaces with underfloor heating.",
    bg: "Усетете естествената топлина на дъба във всяка дъска, подчертана от уникална шарка и финни възли. Лакираната EVO повърхност осигурява изключителна издръжливост, като същевременно запазва елегантния и уютен характер на дървото. Благодарение на хибридната технология подът е водоустойчив, устойчив на надраскване и идеален за домакинства с динамичен живот. Иновативната клик система гарантира бърз монтаж, приятно усещане и съвместимост с подово отопление."
  },
  'classic-olio': {
    en: "Each oak plank brings the authentic warmth and character of natural wood, enhanced by a soft oiled finish. The surface feels inviting and tactile, creating a calm and cozy atmosphere in every room. With hybrid durability, it resists moisture and daily wear while maintaining a beautifully natural feel. Easy installation and compatibility with underfloor heating make it perfect for comfortable modern living.",
    bg: "Всяка дъбова дъска носи истинската топлина и характер на природното дърво, подчертано от нежно омаслено покритие. Повърхността е приятна на допир и създава тиха и уютна атмосфера във всеки интериор. Хибридната устойчивост защитава от влага и ежедневно натоварване, като запазва естествения вид и усещане. Бързият монтаж и съвместимостта с подово отопление гарантират комфорт и уют в съвременния дом."
  },
  'noblessse-evo': {
    en: "With extra-wide dimensions, these hybrid planks bring a sense of space and gentle elegance to your home. The lacquered EVO surface delivers exceptional resistance to scratches and moisture while highlighting the oak's natural charm. Perfect for families, pets, and everyday life, the surface stays beautiful with minimal care. The wide-format design and click system create a seamless, cozy flooring experience.",
    bg: "С екстрашироки размери тези хибридни дъски придават усещане за простор и елегантност в дома. Лакираната EVO повърхност предлага изключителна устойчивост на влага и надраскване, като подчертава естествената красота на дъба. Идеален избор за семейства и домашни любимци, подът остава красив с минимална поддръжка. Широкият формат и клик системата осигуряват плавна визия и уютно усещане."
  },
  'noblessse-olio': {
    en: "The soft, matte oiled finish accentuates the natural character of extra-wide oak planks, creating a warm and serene interior atmosphere. Hybrid technology ensures long-lasting strength, water resistance, and comfort underfoot. The tactile natural surface invites relaxation and homey warmth. Easy installation and underfloor heating compatibility make it an ideal choice for luxurious everyday living.",
    bg: "Матово омасленото покритие подчертава природния характер на екстрашироките дъбови дъски, носейки топлина и спокойствие в интериора. Хибридната технология гарантира дълготрайна здравина, водоустойчивост и комфорт при всяка стъпка. Естествената текстура създава усещане за уют и домашен комфорт. Лесният монтаж и съвместимостта с подово отопление са идеални за ежедневен лукс."
  },
  'herringbone-evo': {
    en: "This elegant herringbone design combines timeless style with the advanced performance of hybrid wood. The EVO lacquered surface provides high scratch and moisture resistance, ensuring beauty and comfort for years. Each piece features unique oak textures that bring depth and warmth into your space. A perfect balance of sophistication and cozy living.",
    bg: "Този елегантен под с подредба рибена кост съчетава вечна естетика с модерната издръжливост на хибридното дърво. Лакираната EVO повърхност предлага висока устойчивост на надраскване и влага, гарантирайки красота и комфорт във времето. Всяка част показва уникална текстура на дъба, носеща дълбочина и уют в пространството. Съвършен баланс между изисканост и топлина."
  },
  'herringbone-olio': {
    en: "The oiled herringbone pattern brings natural charm and a refined, cozy feeling to any interior. Its soft, organic surface enhances the wood's texture and invites warmth into your home. With hybrid durability and water resistance, it suits both elegant and everyday living spaces. Ideal for those seeking authentic wood character with modern comfort.",
    bg: "Подът с дизайн рибена кост, импрегниран с висококачествени масла, носи естествен чар и фин уют във всеки интериор. Меката, органична повърхност подчертава текстурата на дървото и създава топла домашна атмосфера. Благодарение на хибридната здравина и водоустойчивост е подходящ както за стилни, така и за ежедневни пространства. Идеален избор за ценители на естествения характер на дървото в съчетание със съвременен комфорт."
  }
};

// SEO description mappings from docs/hy-wood-seo-descr.md
const SEO_DESCRIPTIONS = {
  'classic-evo': {
    en: "Luxurious oak planks with natural texture and durable lacquer finish. Water-resistant, scratch-resistant, and perfect for cozy family homes with underfloor heating.",
    bg: "Луксозни дъбови дъски с естествена текстура и здраво лакирано покритие. Водо- и удароустойчив под, идеален за уютни семейни домове с подово отопление."
  },
  'classic-olio': {
    en: "Warm oiled oak planks with natural grain and soft, cozy feel. Hybrid durability and warm touch, perfect for calm and welcoming interiors.",
    bg: "Топли омаслени дъбови дъски с естествен релеф и меко, уютно усещане. Хибридна здравина и топъл допир за спокойни и гостоприемни интериори."
  },
  'noblessse-evo': {
    en: "Extra-wide lacquered oak planks that elevate your space with elegance and warmth. Ultra-durable, water-resistant, and designed for modern cozy living.",
    bg: "Екстрашироки лакирани дъбови дъски, които придават елегантност и топлина на дома. Изключително издръжливи и водоустойчиви, създадени за модерен уют."
  },
  'noblessse-olio': {
    en: "Extra-wide oiled oak planks with a natural matte feel for a warm and serene home atmosphere. Hybrid strength with an authentic, cozy wood character.",
    bg: "Екстрашироки омаслени дъбови дъски с естествен матов финиш и топъл, спокоен характер. Хибридна здравина и автентично уютно усещане."
  },
  'herringbone-evo': {
    en: "Elegant lacquered herringbone flooring with natural oak detail and hybrid durability. Water-resistant, scratch-resistant, and perfect for warm, stylish interiors.",
    bg: "Елегантна лакирана рибена кост с естествен дъбов релеф и хибридна издръжливост. Водоустойчива, удароустойчива и идеална за топли, стилни интериори."
  },
  'herringbone-olio': {
    en: "Oiled herringbone flooring with rich natural texture and warm, refined ambiance. Soft natural finish and hybrid performance for welcoming living spaces.",
    bg: "Омаслена рибена кост с богата естествена текстура и топла, изискана атмосфера. Нежен естествен финиш и хибридна устойчивост за гостоприемни пространства."
  }
};

/**
 * Extract surface treatment from pattern name
 * @param {string} pattern - Pattern name (e.g., "classic-evo", "herringbone-olio")
 * @returns {string} - Surface treatment: "evo" or "olio"
 */
function getSurfaceTreatment(pattern) {
  if (pattern.endsWith('-evo')) {
    return 'evo';
  } else if (pattern.endsWith('-olio')) {
    return 'olio';
  }
  throw new Error(`Unknown pattern format: ${pattern}`);
}

/**
 * Update product with descriptions and surface treatment
 * @param {Object} product - Product object to update
 * @returns {Object} - Updated product
 */
function updateProduct(product) {
  const { pattern } = product;

  // Add surfaceTreatment field
  product.surfaceTreatment = getSurfaceTreatment(pattern);

  // Get descriptions for this pattern
  const description = DESCRIPTIONS[pattern];
  const seoDescription = SEO_DESCRIPTIONS[pattern];

  if (!description || !seoDescription) {
    console.warn(`⚠️  No descriptions found for pattern: ${pattern} (SKU: ${product.sku})`);
    return product;
  }

  // Update English descriptions
  product.i18n.en.description = description.en;
  product.i18n.en.seo.description = seoDescription.en;

  // Update Bulgarian descriptions
  product.i18n.bg.description = description.bg;
  product.i18n.bg.seo.description = seoDescription.bg;

  return product;
}

/**
 * Main function to process the collection file
 */
function main() {
  const collectionPath = path.join(__dirname, '..', 'collections', 'hy-wood.json');

  console.log('📖 Reading Hy-Wood collection...');
  const collectionData = JSON.parse(fs.readFileSync(collectionPath, 'utf8'));

  console.log(`📊 Found ${collectionData.products.length} products`);

  // Create backup
  const backupPath = collectionPath + '.backup-' + Date.now();
  fs.writeFileSync(backupPath, JSON.stringify(collectionData, null, 4));
  console.log(`💾 Backup created: ${path.basename(backupPath)}`);

  // Track statistics
  const stats = {
    total: collectionData.products.length,
    updated: 0,
    evo: 0,
    olio: 0,
    patterns: {}
  };

  // Update all products
  collectionData.products = collectionData.products.map(product => {
    const updatedProduct = updateProduct(product);
    stats.updated++;

    // Track surface treatment
    if (updatedProduct.surfaceTreatment === 'evo') {
      stats.evo++;
    } else if (updatedProduct.surfaceTreatment === 'olio') {
      stats.olio++;
    }

    // Track patterns
    stats.patterns[product.pattern] = (stats.patterns[product.pattern] || 0) + 1;

    return updatedProduct;
  });

  // Write updated collection
  fs.writeFileSync(collectionPath, JSON.stringify(collectionData, null, 4));

  console.log('\n✅ Update complete!');
  console.log('\n📈 Statistics:');
  console.log(`   Total products: ${stats.total}`);
  console.log(`   Updated: ${stats.updated}`);
  console.log(`   EVO (lacquered): ${stats.evo}`);
  console.log(`   OLIO (oiled): ${stats.olio}`);
  console.log('\n📊 Products per pattern:');
  Object.entries(stats.patterns).forEach(([pattern, count]) => {
    console.log(`   ${pattern}: ${count}`);
  });
  console.log('\n🎉 All products now have descriptions and surfaceTreatment field!');
}

// Run the script
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
