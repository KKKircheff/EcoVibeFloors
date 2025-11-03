/**
 * Glue-Down Vinyl Collection Product Utilities
 * Provides functions to filter and retrieve products from the Glue-Down Vinyl collection
 */

import { Product, ProductPattern } from '@/types/products';
import { glueDownVinylCollection } from '@/collections/glue-down-vinyl';

/**
 * Get all products from the Glue-Down Vinyl collection
 */
export function getGlueDownVinylProducts(): Product[] {
    return glueDownVinylCollection.products;
}

/**
 * Get Glue-Down Vinyl products filtered by pattern
 */
export function getGlueDownVinylProductsByPattern(pattern: ProductPattern): Product[] {
    return glueDownVinylCollection.products.filter((product) => product.pattern === pattern);
}

/**
 * Get a single Glue-Down Vinyl product by slug
 */
export function getGlueDownVinylProductBySlug(slug: string): Product | undefined {
    return glueDownVinylCollection.products.find((product) => product.slug === slug);
}

/**
 * Get a single Glue-Down Vinyl product by pattern and slug
 */
export function getGlueDownVinylProductByPatternSlug(
    pattern: ProductPattern,
    slug: string
): Product | undefined {
    const products = getGlueDownVinylProductsByPattern(pattern);
    return products.find((product) => product.slug === slug);
}

/**
 * Count total Glue-Down Vinyl products
 */
export function getGlueDownVinylProductCount(): number {
    return glueDownVinylCollection.products.length;
}

/**
 * Count Glue-Down Vinyl products by pattern
 */
export function getGlueDownVinylProductCountByPattern(pattern: ProductPattern): number {
    return getGlueDownVinylProductsByPattern(pattern).length;
}

/**
 * Get collection metadata
 */
export function getGlueDownVinylMetadata() {
    return glueDownVinylCollection.metadata;
}
