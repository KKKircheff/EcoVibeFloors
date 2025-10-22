/**
 * Oak Treatment Type Definitions
 * Type definitions for oak color treatments
 */

import { Locale } from '@/i18n/routing';

// ============================================================================
// Treatment Types
// ============================================================================

/**
 * Treatment categories
 */
export type TreatmentCategory = 'warm' | 'cool' | 'neutral' | 'dramatic';

/**
 * Image alt text for accessibility (i18n)
 */
export interface TreatmentImageAlt {
    en: string;
    bg: string;
}

/**
 * SEO metadata for treatment
 */
export interface TreatmentSEO {
    title: string;
    description: string;
    keywords: string[];
}

/**
 * Localized treatment content
 */
export interface TreatmentLocalizedContent {
    name: string;
    description: string;
    benefits: string[];
    recommendedFor: string[];
    application: string;
    maintenance: string;
    seo: TreatmentSEO;
}

/**
 * I18n content for treatment
 */
export interface TreatmentI18n {
    bg: TreatmentLocalizedContent;
    en: TreatmentLocalizedContent;
}

/**
 * Treatment characteristics
 */
export interface TreatmentCharacteristics {
    finishType: string;
    intensity: string;
    styleCompatibility: string[];
}

/**
 * Oak Treatment
 */
export interface OakTreatment {
    slug: string;
    category: TreatmentCategory;
    characteristics: TreatmentCharacteristics;
    images: string[];
    imageAlt: TreatmentImageAlt;
    i18n: TreatmentI18n;
}

/**
 * Treatment collection metadata
 */
export interface TreatmentCollectionMetadata {
    generatedAt: string;
    totalTreatments: number;
    collection: string;
    description: string;
}

/**
 * Treatment collection structure
 */
export interface TreatmentCollection {
    metadata: TreatmentCollectionMetadata;
    treatments: OakTreatment[];
}

// ============================================================================
// Type Guards & Validators
// ============================================================================

/**
 * Check if a string is a valid treatment category
 */
export function isValidTreatmentCategory(category: string): category is TreatmentCategory {
    return ['warm', 'cool', 'neutral', 'dramatic'].includes(category);
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
    return locale === 'bg' || locale === 'en';
}

/**
 * Get all valid treatment slugs from a collection
 */
export function getValidTreatmentSlugs(collection: TreatmentCollection): string[] {
    return collection.treatments.map(treatment => treatment.slug);
}

/**
 * Check if a slug exists in the collection
 */
export function isValidTreatmentSlug(slug: string, collection: TreatmentCollection): boolean {
    return getValidTreatmentSlugs(collection).includes(slug);
}
