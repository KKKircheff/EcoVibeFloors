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
        {
            id: 'click-vinyl',
            slug: 'click-vinyl',
            nameKey: 'collections.names.clickVinyl',
            descriptionKey: 'collections.clickVinyl.description',
            patterns: ['walvisgraat-click', 'natuur-click', 'landhuis-click', 'tegel-click', 'visgraat-click'],
            cardImages: {
                main: {
                    sku: 'FLR-3911',
                    imageIndex: 0,
                    full: true,
                },
                hover: {
                    sku: 'FLR-3912',
                    imageIndex: 0,
                    full: true,
                },
            },
        },
        {
            id: 'glue-down-vinyl',
            slug: 'glue-down-vinyl',
            nameKey: 'collections.names.glueDownVinyl',
            descriptionKey: 'collections.glueDownVinyl.description',
            patterns: ['dorpen', 'hongaarse-punt', 'landhuis'],
            cardImages: {
                main: {
                    sku: 'FLR-3040',
                    imageIndex: 0,
                    full: true,
                },
                hover: {
                    sku: 'FLR-3041',
                    imageIndex: 0,
                    full: true,
                },
            },
        },
        // Future collections to be added:
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

export function getCollectionMetadata(collectionId: CollectionType): CollectionMetadata | null {
    return getAllCollections().find((col) => col.id === collectionId) || null;
}

export function getCollectionPatterns(collectionId: CollectionType): ProductPattern[] {
    const metadata = getCollectionMetadata(collectionId);
    return metadata?.patterns || [];
}
