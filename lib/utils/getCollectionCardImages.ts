/**
 * Utility to get collection card images from product data
 * Fetches product images by SKU for collection cards
 */

import { CollectionType } from '@/types/products';
import { getProductsByCollection } from '@/utils/products/getProducts';
import { getStorageUrl } from './getStorageUrl';

interface CollectionCardImages {
    mainImage: string;
    hoverImage: string;
}

interface ImageConfig {
    sku: string;
    imageIndex?: number;
    full?: boolean;
}

/**
 * Gets a single image URL from product data
 */
function getImageUrl(
    collection: CollectionType,
    config: ImageConfig
): string {
    const products = getProductsByCollection(collection);
    const product = products.find((p) => p.sku === config.sku);

    if (!product) {
        throw new Error(`Product with SKU ${config.sku} not found in collection: ${collection}`);
    }

    const imageIndex = config.imageIndex ?? 0;
    const imageName = product.images[imageIndex];

    if (!imageName) {
        throw new Error(
            `Image index ${imageIndex} out of bounds. Product ${product.sku} has ${product.images.length} images`
        );
    }

    const imageUrls = getStorageUrl(
        collection,
        product.pattern,
        product.sku,
        imageName
    );

    return config.full ? imageUrls.full : imageUrls.thumbnail;
}

/**
 * Gets collection card images from product data
 * @param collection - Product collection (e.g., 'hybrid-wood')
 * @param mainConfig - Configuration for main image (sku, imageIndex, full)
 * @param hoverConfig - Configuration for hover image (sku, imageIndex, full)
 * @returns Object with mainImage and hoverImage Firebase Storage URLs
 */
export function getCollectionCardImages(
    collection: CollectionType,
    mainConfig: ImageConfig,
    hoverConfig: ImageConfig
): CollectionCardImages {
    return {
        mainImage: getImageUrl(collection, mainConfig),
        hoverImage: getImageUrl(collection, hoverConfig),
    };
}
