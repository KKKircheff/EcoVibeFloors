/**
 * Hybrid Wood Collection Product Utilities
 * Provides functions to filter and retrieve products from the Floer Hybrid Wood collection
 */

import {Product, ProductPattern} from '@/types/products';
import {hybridWoodCollection} from '@/collections/json-backup/hybrid-wood';

/**
 * Get all products from the Hybrid Wood collection
 */
export function getHybridWoodProducts(): Product[] {
    return hybridWoodCollection.products;
}

/**
 * Get Hybrid Wood products filtered by pattern
 */
export function getHybridWoodProductsByPattern(pattern: ProductPattern): Product[] {
    return hybridWoodCollection.products.filter((product) => product.pattern === pattern);
}

/**
 * Get a single Hybrid Wood product by slug
 */
export function getHybridWoodProductBySlug(slug: string): Product | undefined {
    return hybridWoodCollection.products.find((product) => product.slug === slug);
}

/**
 * Get a single Hybrid Wood product by pattern and slug
 */
export function getHybridWoodProductByPatternSlug(pattern: ProductPattern, slug: string): Product | undefined {
    const products = getHybridWoodProductsByPattern(pattern);
    return products.find((product) => product.slug === slug);
}

/**
 * Count total Hybrid Wood products
 */
export function getHybridWoodProductCount(): number {
    return hybridWoodCollection.products.length;
}

/**
 * Count Hybrid Wood products by pattern
 */
export function getHybridWoodProductCountByPattern(pattern: ProductPattern): number {
    return getHybridWoodProductsByPattern(pattern).length;
}

/**
 * Get collection metadata
 */
export function getHybridWoodMetadata() {
    return hybridWoodCollection.metadata;
}
