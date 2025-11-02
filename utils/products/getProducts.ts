/**
 * Product fetching utilities
 * Provides functions to filter and retrieve products from JSON collections
 */

import {Product, ProductPattern, CollectionType} from '@/types/products';
import hyWoodData from '@/collections/hy-wood.json';
import clickVinylData from '@/collections/click-vinyl.json';
import glueDownVinylData from '@/collections/glue-down-vinyl.json';
import oakData from '@/collections/oak.json';

/**
 * Get all products from a specific collection
 */
export function getProductsByCollection(collection: CollectionType): Product[] {
    switch (collection) {
        case 'hybrid-wood':
            return hyWoodData.products as Product[];
        case 'click-vinyl':
            return clickVinylData.products as Product[];
        case 'glue-down-vinyl':
            return glueDownVinylData.products as Product[];
        case 'oak':
            return oakData.products as Product[];
        default:
            return [];
    }
}

/**
 * Get products filtered by collection and pattern
 */
export function getProductsByCollectionAndPattern(
    collection: CollectionType,
    pattern: ProductPattern
): Product[] {
    const collectionProducts = getProductsByCollection(collection);
    return collectionProducts.filter((product) => product.pattern === pattern);
}

/**
 * Get all products (from all collections)
 */
export function getAllProducts(): Product[] {
    return [
        ...(hyWoodData.products as Product[]),
        ...(clickVinylData.products as Product[]),
        ...(glueDownVinylData.products as Product[]),
        ...(oakData.products as Product[])
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
export function getProductCountByCollectionAndPattern(
    collection: CollectionType,
    pattern: ProductPattern
): number {
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
