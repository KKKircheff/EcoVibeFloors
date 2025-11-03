/**
 * Product fetching utilities
 * Provides functions to filter and retrieve products from TypeScript collections
 *
 * Note: This file provides backward compatibility for utilities that need dynamic collection access.
 * For direct collection access in routes, prefer importing collection-specific utilities instead.
 */

import {Product, ProductPattern, CollectionType} from '@/types/products';
import {hyWoodCollection} from '@/collections/hy-wood';
import {hybridWoodCollection} from '@/collections/hybrid-wood';
import {clickVinylCollection} from '@/collections/click-vinyl';
import {glueDownVinylCollection} from '@/collections/glue-down-vinyl';
import {oakCollection} from '@/collections/oak';

/**
 * Get all products from a specific collection
 */
export function getProductsByCollection(collection: CollectionType): Product[] {
    switch (collection) {
        case 'hy-wood':
            return hyWoodCollection.products;
        case 'hybrid-wood':
            return hyWoodCollection.products;
        case 'click-vinyl':
            return clickVinylCollection.products;
        case 'glue-down-vinyl':
            return glueDownVinylCollection.products;
        case 'oak':
            return oakCollection.products;
        default:
            return [];
    }
}

/**
 * Get products filtered by collection and pattern
 */
export function getProductsByCollectionAndPattern(collection: CollectionType, pattern: ProductPattern): Product[] {
    const collectionProducts = getProductsByCollection(collection);
    return collectionProducts.filter((product) => product.pattern === pattern);
}

/**
 * Get all products (from all collections)
 */
export function getAllProducts(): Product[] {
    return [
        ...hyWoodCollection.products,
        ...hybridWoodCollection.products,
        ...clickVinylCollection.products,
        ...glueDownVinylCollection.products,
        ...oakCollection.products,
    ];
}

/**
 * Count products by collection
 */
export function getProductCountByCollection(collection: CollectionType): number {
    return getProductsByCollection(collection).length;
}

/**
 * Count products by collection and pattern
 */
export function getProductCountByCollectionAndPattern(collection: CollectionType, pattern: ProductPattern): number {
    return getProductsByCollectionAndPattern(collection, pattern).length;
}

/**
 * Get a single product by collection, pattern, and slug
 */
export function getProductByCollectionPatternSlug(
    collection: CollectionType,
    pattern: ProductPattern,
    slug: string
): Product | undefined {
    const products = getProductsByCollectionAndPattern(collection, pattern);
    return products.find((product) => product.slug === slug);
}
