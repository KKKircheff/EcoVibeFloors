/**
 * Utility to get style card images from product data
 * Fetches product images by SKU for style cards
 */

import {CollectionType} from '@/types/products';
import {getProductsByCollection} from '@/utils/products/getProducts';
import {getStorageUrl} from './getStorageUrl';

interface StyleCardImages {
    mainImage: string;
    hoverImage: string;
}

/**
 * Gets style card images from product data by SKU
 * @param collection - Product collection (e.g., 'hybrid-wood')
 * @param sku - Product SKU (e.g., 'FLR-5000')
 * @param mainImageIndex - Index of main image in product's images array
 * @param hoverImageIndex - Index of hover image in product's images array
 * @param full - Whether to use full or thumbnail images (default: true)
 * @returns Object with mainImage and hoverImage Firebase Storage URLs
 */
export function getStyleCardImages(
    collection: CollectionType,
    sku: string,
    mainImageIndex: number = 0,
    hoverImageIndex: number = 1,
    full: boolean = true
): StyleCardImages {
    // Get all products from collection
    const products = getProductsByCollection(collection);

    // Find product by SKU
    const product = products.find((p) => p.sku === sku);

    if (!product) {
        throw new Error(`Product with SKU ${sku} not found in collection: ${collection}`);
    }

    // Get images at specified indexes
    const mainImageName = product.images[mainImageIndex];
    const hoverImageName = product.images[hoverImageIndex];

    if (!mainImageName || !hoverImageName) {
        throw new Error(
            `Image index out of bounds. Product ${product.sku} has ${product.images.length} images, requested indexes: ${mainImageIndex}, ${hoverImageIndex}`
        );
    }

    // Generate Firebase Storage URLs
    // Note: Use the collection parameter (file-level type like 'glue-down-vinyl', 'click-vinyl')
    // NOT product.collection (which contains sub-collection names like 'village-vinyl')
    // Firebase Storage structure uses the file-level collection type
    const mainImageUrls = getStorageUrl(collection, product.pattern, product.sku, mainImageName);

    const hoverImageUrls = getStorageUrl(collection, product.pattern, product.sku, hoverImageName);

    return {
        mainImage: full ? mainImageUrls.full : mainImageUrls.thumbnail,
        hoverImage: full ? hoverImageUrls.full : hoverImageUrls.thumbnail,
    };
}
