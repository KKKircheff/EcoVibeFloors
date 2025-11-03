/**
 * Click Vinyl Collection Product Utilities
 * Provides functions to filter and retrieve products from the Click Vinyl collection
 */

import { Product, ProductPattern } from '@/types/products';
import { clickVinylCollection } from '@/collections/click-vinyl';

/**
 * Get all products from the Click Vinyl collection
 */
export function getClickVinylProducts(): Product[] {
    return clickVinylCollection.products;
}

/**
 * Get Click Vinyl products filtered by pattern
 */
export function getClickVinylProductsByPattern(pattern: ProductPattern): Product[] {
    return clickVinylCollection.products.filter((product) => product.pattern === pattern);
}

/**
 * Get a single Click Vinyl product by slug
 */
export function getClickVinylProductBySlug(slug: string): Product | undefined {
    return clickVinylCollection.products.find((product) => product.slug === slug);
}

/**
 * Get a single Click Vinyl product by pattern and slug
 */
export function getClickVinylProductByPatternSlug(
    pattern: ProductPattern,
    slug: string
): Product | undefined {
    const products = getClickVinylProductsByPattern(pattern);
    return products.find((product) => product.slug === slug);
}

/**
 * Count total Click Vinyl products
 */
export function getClickVinylProductCount(): number {
    return clickVinylCollection.products.length;
}

/**
 * Count Click Vinyl products by pattern
 */
export function getClickVinylProductCountByPattern(pattern: ProductPattern): number {
    return getClickVinylProductsByPattern(pattern).length;
}

/**
 * Get collection metadata
 */
export function getClickVinylMetadata() {
    return clickVinylCollection.metadata;
}
