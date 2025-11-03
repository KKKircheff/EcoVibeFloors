/**
 * Oak Collection Product Utilities
 * Provides functions to filter and retrieve products from the Oak collection
 */

import { Product, ProductPattern } from '@/types/products';
import { oakCollection } from '@/collections/oak';

/**
 * Get all products from the Oak collection
 */
export function getOakProducts(): Product[] {
    return oakCollection.products;
}

/**
 * Get Oak products filtered by pattern
 */
export function getOakProductsByPattern(pattern: ProductPattern): Product[] {
    return oakCollection.products.filter((product) => product.pattern === pattern);
}

/**
 * Get a single Oak product by slug
 */
export function getOakProductBySlug(slug: string): Product | undefined {
    return oakCollection.products.find((product) => product.slug === slug);
}

/**
 * Get a single Oak product by pattern and slug
 */
export function getOakProductByPatternSlug(
    pattern: ProductPattern,
    slug: string
): Product | undefined {
    const products = getOakProductsByPattern(pattern);
    return products.find((product) => product.slug === slug);
}

/**
 * Count total Oak products
 */
export function getOakProductCount(): number {
    return oakCollection.products.length;
}

/**
 * Count Oak products by pattern
 */
export function getOakProductCountByPattern(pattern: ProductPattern): number {
    return getOakProductsByPattern(pattern).length;
}

/**
 * Get collection metadata
 */
export function getOakMetadata() {
    return oakCollection.metadata;
}
