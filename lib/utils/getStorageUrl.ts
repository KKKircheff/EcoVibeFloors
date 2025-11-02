import { FIREBASE_STORAGE_BUCKET } from '@/lib/firebase';

/**
 * Generates Firebase Storage URLs for product images
 * @param collection - Product collection name
 * @param pattern - Product pattern name
 * @param sku - Product SKU
 * @param imageName - Image filename
 * @returns Object with full and thumbnail URLs
 */
export function getStorageUrl(
    collection: string,
    pattern: string,
    sku: string,
    imageName: string
): { full: string; thumbnail: string } {
    // Map frontend collection names to Firebase Storage paths
    // This handles cases where the collection identifier differs from the storage path
    const storageCollectionMap: Record<string, string> = {
        'hybrid-wood': 'hy-wood', // Frontend uses 'hybrid-wood', storage uses 'hy-wood'
    };

    // Use mapped path if exists, otherwise use collection name as-is
    const storagePath = storageCollectionMap[collection] || collection;

    const fullPath = `products/${storagePath}/${pattern}/${sku}/full/${imageName}`;
    const thumbnailPath = `products/${storagePath}/${pattern}/${sku}/thumbnail/${imageName}`;

    const encodedFullPath = encodeURIComponent(fullPath);
    const encodedThumbnailPath = encodeURIComponent(thumbnailPath);

    return {
        full: `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${encodedFullPath}?alt=media`,
        thumbnail: `https://firebasestorage.googleapis.com/v0/b/${FIREBASE_STORAGE_BUCKET}/o/${encodedThumbnailPath}?alt=media`,
    };
}
