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
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    const fullPath = `products/${collection}/${pattern}/${sku}/full/${imageName}`;
    const thumbnailPath = `products/${collection}/${pattern}/${sku}/thumbnail/${imageName}`;

    const encodedFullPath = encodeURIComponent(fullPath);
    const encodedThumbnailPath = encodeURIComponent(thumbnailPath);

    return {
        full: `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodedFullPath}?alt=media`,
        thumbnail: `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodedThumbnailPath}?alt=media`,
    };
}
