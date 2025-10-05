/**
 * Collection metadata utilities
 */

import {CollectionType, ProductPattern} from '@/types/products';

export interface CollectionCardImageConfig {
    main: {
        sku: string; // Product SKU for main image
        imageIndex?: number; // Index of image (default: 0)
        full?: boolean; // Whether to use full or thumbnail (default: false)
    };
    hover: {
        sku: string; // Product SKU for hover image
        imageIndex?: number; // Index of image (default: 0)
        full?: boolean; // Whether to use full or thumbnail (default: false)
    };
}

export interface CollectionMetadata {
    id: CollectionType;
    slug: string;
    nameKey: string; // Translation key for collection name
    descriptionKey: string; // Translation key for description
    patterns: ProductPattern[]; // Available patterns for this collection
    heroImage?: string; // Optional hero image path (deprecated - use cardImages instead)
    cardImages?: CollectionCardImageConfig; // Images for collection card
}

export function getAllCollections(): CollectionMetadata[] {
    return [
        {
            id: 'hybrid-wood',
            slug: 'hybrid-wood',
            nameKey: 'collections.names.hybridWood',
            descriptionKey: 'collections.hybridWood.description',
            patterns: ['plank', 'fishbone'],
            cardImages: {
                main: {
                    sku: 'FLR-5015',
                    imageIndex: 0,
                    full: true,
                },
                hover: {
                    sku: 'FLR-5002',
                    imageIndex: 0,
                    full: true,
                },
            },
        },
        // Future collections to be added:
        // {
        //     id: 'vinyl',
        //     slug: 'vinyl',
        //     nameKey: 'collections.names.vinyl',
        //     descriptionKey: 'collections.vinyl.description',
        //     patterns: ['plank', 'fishbone'], // Adjust based on actual vinyl patterns
        // },
        // {
        //     id: 'oak',
        //     slug: 'oak',
        //     nameKey: 'collections.names.oak',
        //     descriptionKey: 'collections.naturalOak.description',
        //     patterns: ['plank'],
        // },
        // {
        //     id: 'custom-oak',
        //     slug: 'custom-oak',
        //     nameKey: 'collections.names.customOak',
        //     descriptionKey: 'collections.customOak.description',
        //     patterns: ['plank'],
        // },
    ];
}

/**
 * Get metadata for a specific collection
 */
export function getCollectionMetadata(collectionId: CollectionType): CollectionMetadata | null {
    return getAllCollections().find((col) => col.id === collectionId) || null;
}

/**
 * Get available patterns for a collection
 */
export function getCollectionPatterns(collectionId: CollectionType): ProductPattern[] {
    const metadata = getCollectionMetadata(collectionId);
    return metadata?.patterns || [];
}
