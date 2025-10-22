/**
 * Product Type Definitions for Eco Vibe Floors
 * Next.js 15 + next-intl multi-language support
 *
 * Updated: Simplified image structure (flat array)
 */

import {Locale} from '@/i18n/routing';

// ============================================================================
// Image Types
// ============================================================================

/**
 * Image alt text for accessibility (i18n)
 */
export interface ImageAltText {
    en: string;
    bg: string;
}

/**
 * Product images - Simple flat array of filenames
 * Images are stored in Firebase Storage at:
 * products/{collection}/{pattern}/{sku}/{size}/{filename}
 *
 * Sizes: 'thumbnail' | 'full'
 */
export type ProductImages = string[];

export interface Dimensions {
    length?: string;
    width?: string;
    thickness?: string;
}

export interface Appearance {
    color?: string;
    structure?: string;
}

export interface Installation {
    vGroove?: string;
    clickSystem?: string;
}

export interface Performance {
    waterResistance?: string;
    thermalResistance?: string;
    underfloorHeating?: string;
}

export interface Certifications {
    qualityMark?: string;
    warranty?: string;
    countryOfProduction?: string;
}

export interface Specifications {
    dimensions?: Dimensions;
    appearance?: Appearance;
    installation?: Installation;
    performance?: Performance;
    certifications?: Certifications;
    general?: Record<string, string>;
}

export interface SEOMetadata {
    title: string;
    description: string;
    keywords: string[] | string;
}

export interface LocalizedContent {
    name: string;
    description?: string;
    finishingNote?: string | null; // Note about finishing options for unfinished products
    features?: string[];
    seo: SEOMetadata;
    specifications?: Specifications;
}

export interface I18nContent {
    bg: LocalizedContent; // Bulgarian - Primary
    en: LocalizedContent; // English - Secondary
}

export interface ProductMetadata {
    totalImages: number;
    imageSizes: ('thumbnail' | 'full')[];
    createdAt: string;
    updatedAt?: string;
    status?: 'draft' | 'published' | 'archived';
}

export interface Product {
    sku: string;
    slug: string;
    collection: string; // Product collection/line (e.g., "hybrid-wood", "oak")
    pattern: ProductPattern; // Flooring pattern/style
    installationSystem: 'click' | 'glue';
    price: number;
    gtin?: string | number;
    productieId?: string; // DIG Productie number (e.g., "A0000449")
    categories?: string; // CSV categories field

    images: ProductImages;
    imageAlt: ImageAltText;

    displayImages?: number[];

    i18n: I18nContent;

    metadata?: ProductMetadata;

    // Oak-specific fields
    isFinished?: boolean;
    finishType?: 'unfinished' | 'oiled' | 'lacquered' | 'stained';
    finishingOptions?: {
        available: boolean;
        options: string[];
        colorTreatments?: string[];
    };

    // New structured oak fields (from DIG prijslijst)
    constructionType?: 'engineered' | 'solid';
    woodSpecies?: 'oak' | 'bamboo' | 'walnut' | 'pine';
    mountingType?: 'plank' | 'herringbone' | 'chevron';
    manufacturerProductId?: string; // C-code or descriptive name
    woodGrade?: 'select' | 'rustic' | 'light-rustic' | 'natural';
    surfaceTreatment?: string | null; // e.g., "deep-brushed", "wire-brushed"

    // Physical dimensions (extracted from manufacturer)
    dimensions?: {
        length?: number; // mm
        width?: number; // mm
        thickness?: number; // mm
    };
    topLayer?: number; // Top layer thickness in mm (for engineered)

    // Source tracking
    sourceUrl?: string; // Original DIG webshop URL
}

export interface ProductCollection {
    metadata: {
        generatedAt: string;
        totalProducts: number;
        collection?: string;
        description: string;
        version?: string;
        lastSorted?: string;
        lastRefined?: string;
        refinementNote?: string;
        // Vinyl-specific metadata fields
        vinylType?: string;
        installationSystem?: 'click' | 'glue' | 'glue-down';
    };
    products: Product[]; // Array format for optimal performance
}

export interface PatternTranslation {
    name: string;
    description?: string;
}

export interface Patterns {
    fishbone: PatternTranslation;
    plank: PatternTranslation;
}

export interface CollectionInfo {
    id: string;
    name: string;
    description?: string;
}

// ============================================================================
// Firebase Types
// ============================================================================
// Note: Products stored in Firestore use the same Product interface above
// with image URLs resolved. Structure: /products/{collection}/{pattern}/{sku}

// ============================================================================
// Utility Types
// ============================================================================

export type CollectionType = 'hybrid-wood' | 'glue-down-vinyl' | 'click-vinyl' | 'oak';

export type ProductPattern =
    // Hybrid Wood patterns
    | 'fishbone'
    | 'plank'
    // Oak patterns
    | 'herringbone'
    | 'chevron'
    // Glue-down vinyl patterns
    | 'dorpen'
    | 'hongaarse-punt'
    | 'landhuis'
    // Click vinyl patterns
    | 'walvisgraat-click'
    | 'natuur-click'
    | 'landhuis-click'
    | 'tegel-click'
    | 'visgraat-click';

export type ImageSize = 'thumbnail' | 'full';

// ============================================================================
// Type Guards & Validators
// ============================================================================

export function isValidLocale(locale: string): locale is Locale {
    return locale === 'bg' || locale === 'en';
}

export function isValidPattern(pattern: string): pattern is ProductPattern {
    return [
        'fishbone',
        'plank',
        'herringbone',
        'chevron',
        'dorpen',
        'hongaarse-punt',
        'landhuis',
        'walvisgraat-click',
        'natuur-click',
        'landhuis-click',
        'tegel-click',
        'visgraat-click',
    ].includes(pattern);
}

export function isValidCollection(collection: string): collection is CollectionType {
    return ['hybrid-wood', 'glue-down-vinyl', 'click-vinyl', 'oak'].includes(collection);
}

export function isValidImageSize(size: string): size is ImageSize {
    return size === 'thumbnail' || size === 'full';
}

// ============================================================================
// Image Helper Functions
// ============================================================================

/**
 * Build Firebase Storage URL for product image
 * @param product - Product object
 * @param size - Image size ('thumbnail' | 'full')
 * @param filename - Image filename
 * @param baseUrl - Firebase Storage base URL (from env)
 * @returns Complete Firebase Storage URL
 */
export function buildImageUrl(product: Product, size: ImageSize, filename: string, baseUrl: string): string {
    return `${baseUrl}/products/${product.collection}/${product.pattern}/${product.sku}/${size}/${filename}`;
}

/**
 * Build Firebase Storage URL for product image by index
 * @param product - Product object
 * @param size - Image size ('thumbnail' | 'full')
 * @param index - Image index (0-based)
 * @param baseUrl - Firebase Storage base URL (from env)
 * @returns Complete Firebase Storage URL or null if index out of bounds
 */
export function buildImageUrlByIndex(product: Product, size: ImageSize, index: number, baseUrl: string): string | null {
    if (index < 0 || index >= product.images.length) {
        return null;
    }
    return buildImageUrl(product, size, product.images[index], baseUrl);
}

/**
 * Get thumbnail URLs for collection page (first 2 images)
 * @param product - Product object
 * @param baseUrl - Firebase Storage base URL (from env)
 * @returns Object with main and hover thumbnail URLs
 */
export function getCollectionThumbnails(
    product: Product,
    baseUrl: string
): {main: string | null; hover: string | null} {
    return {
        main: buildImageUrlByIndex(product, 'thumbnail', 0, baseUrl),
        hover: buildImageUrlByIndex(product, 'thumbnail', 1, baseUrl),
    };
}

/**
 * Get all image URLs for product gallery
 * @param product - Product object
 * @param size - Image size ('thumbnail' | 'full')
 * @param baseUrl - Firebase Storage base URL (from env)
 * @returns Array of image URLs
 */
export function getAllImageUrls(product: Product, size: ImageSize, baseUrl: string): string[] {
    return product.images.map((filename) => buildImageUrl(product, size, filename, baseUrl));
}
