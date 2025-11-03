/**
 * Hy-Wood Collection Product Utilities
 * Provides functions to filter and retrieve products from the Ter Hürne Hy-Wood collection
 */

import { Product, ProductPattern } from '@/types/products';
import { hyWoodCollection } from '@/collections/hy-wood';

/**
 * Get all products from the Hy-Wood collection
 */
export function getHyWoodProducts(): Product[] {
    return hyWoodCollection.products;
}

/**
 * Get Hy-Wood products filtered by pattern
 */
export function getHyWoodProductsByPattern(pattern: ProductPattern): Product[] {
    return hyWoodCollection.products.filter((product) => product.pattern === pattern);
}

/**
 * Get a single Hy-Wood product by slug
 */
export function getHyWoodProductBySlug(slug: string): Product | undefined {
    return hyWoodCollection.products.find((product) => product.slug === slug);
}

/**
 * Get a single Hy-Wood product by pattern and slug
 */
export function getHyWoodProductByPatternSlug(
    pattern: ProductPattern,
    slug: string
): Product | undefined {
    const products = getHyWoodProductsByPattern(pattern);
    return products.find((product) => product.slug === slug);
}

/**
 * Count total Hy-Wood products
 */
export function getHyWoodProductCount(): number {
    return hyWoodCollection.products.length;
}

/**
 * Count Hy-Wood products by pattern
 */
export function getHyWoodProductCountByPattern(pattern: ProductPattern): number {
    return getHyWoodProductsByPattern(pattern).length;
}

/**
 * Get collection metadata
 */
export function getHyWoodMetadata() {
    return hyWoodCollection.metadata;
}
