/**
 * Retrieve single product by slug
 */

import {Product, CollectionType} from '@/types/products';
import {getProductsByCollection, getAllProducts} from './getProducts';

/**
 * Get a single product by its slug from a specific collection
 */
export function getProductBySlug(collection: CollectionType, slug: string): Product | null {
    const products = getProductsByCollection(collection);
    return products.find((product) => product.slug === slug) || null;
}

/**
 * Get a single product by its slug (search across all collections)
 */
export function findProductBySlug(slug: string): Product | null {
    const allProducts = getAllProducts();
    return allProducts.find((product) => product.slug === slug) || null;
}

/**
 * Get a single product by SKU from a specific collection
 */
export function getProductBySku(collection: CollectionType, sku: string): Product | null {
    const products = getProductsByCollection(collection);
    return products.find((product) => product.sku === sku) || null;
}

/**
 * Find product by SKU (search across all collections)
 */
export function findProductBySku(sku: string): Product | null {
    const allProducts = getAllProducts();
    return allProducts.find((product) => product.sku === sku) || null;
}
