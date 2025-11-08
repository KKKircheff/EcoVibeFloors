import { z } from 'zod';

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Image alt text in multiple languages
 */
export const ImageAltTextSchema = z.object({
    en: z.string(),
    bg: z.string(),
});

/**
 * SEO metadata for search engine optimization
 */
export const SEOMetadataSchema = z.object({
    title: z.string().min(1, 'SEO title is required'),
    description: z.string().min(1, 'SEO description is required'),
    keywords: z.union([
        z.array(z.string().min(1)),
        z.string().min(1)
    ], {
        errorMap: () => ({ message: 'Keywords must be array of strings or single string' })
    }),
});

/**
 * Dimensions object
 */
export const DimensionsSchema = z.object({
    length: z.union([z.string(), z.number()]).optional(),
    width: z.union([z.string(), z.number()]).optional(),
    thickness: z.union([z.string(), z.number()]).optional(),
}).optional();

/**
 * Appearance specifications
 */
export const AppearanceSchema = z.object({
    colorCode: z.string().optional(),
    materialCode: z.string().optional(),
    pattern: z.string().optional(),
    finish: z.string().optional(),
}).optional();

/**
 * Installation specifications
 */
export const InstallationSchema = z.object({
    vGroove: z.string().optional(),
    clickSystem: z.string().optional(),
    underlayment: z.string().optional(),
}).optional();

/**
 * Performance specifications
 */
export const PerformanceSchema = z.object({
    underfloorHeatingCode: z.string().optional(),
    waterResistanceCode: z.string().optional(),
    thermalResistance: z.string().optional(),
    wearLayer: z.union([z.string(), z.number()]).optional(),
    usageClass: z.string().optional(),
}).optional();

/**
 * Certifications
 */
export const CertificationsSchema = z.object({
    warranty: z.string().optional(),
    qualityMark: z.string().optional(),
    environmentalCerts: z.string().optional(),
}).optional();

/**
 * Product specifications (flexible structure)
 */
export const SpecificationsSchema = z.object({
    dimensions: DimensionsSchema,
    appearance: AppearanceSchema,
    installation: InstallationSchema,
    performance: PerformanceSchema,
    certifications: CertificationsSchema,
    general: z.record(z.string()).optional(),
}).catchall(z.any()).optional(); // Allow additional fields

/**
 * Localized content for a single language
 */
export const LocalizedContentSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    finishingNote: z.string().nullable().optional(),
    features: z.array(z.string()).optional(),
    seo: SEOMetadataSchema,
    specifications: SpecificationsSchema, // DEPRECATED but still in data
});

/**
 * Internationalized content (English and Bulgarian)
 */
export const I18nContentSchema = z.object({
    bg: LocalizedContentSchema,
    en: LocalizedContentSchema,
});

/**
 * Product metadata
 */
export const ProductMetadataSchema = z.object({
    totalImages: z.number().int().nonnegative(),
    imageSizes: z.array(z.enum(['thumbnail', 'full'])),
    createdAt: z.string(),
    updatedAt: z.string().optional(),
    lastUpdated: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']).optional(),
    dataSource: z.string().optional(),
    imagePathPattern: z.string().optional(),
}).optional();

/**
 * Finishing options for oak products
 */
export const FinishingOptionsSchema = z.object({
    available: z.boolean(),
    options: z.array(z.string()),
    colorTreatments: z.array(z.string()).optional(),
}).optional();

// ============================================================================
// Main Product Schema
// ============================================================================

/**
 * Complete product schema matching Product interface
 */
export const ProductSchema = z.object({
    // Required fields
    sku: z.string().min(1, 'SKU is required'),
    slug: z.string().min(1, 'Slug is required'),
    collection: z.string().min(1, 'Collection is required'),
    pattern: z.string().min(1, 'Pattern is required'),
    installationSystem: z.enum(['click', 'glue', 'glue-down'], {
        errorMap: () => ({ message: 'Installation system must be click, glue, or glue-down' })
    }),
    price: z.number().positive('Price must be positive'),

    // Optional identifiers
    gtin: z.union([z.string(), z.number()]).optional(),
    productieId: z.string().optional(),
    categories: z.string().optional(),

    // Images
    images: z.array(z.string().min(1)),
    imageAlt: ImageAltTextSchema,
    displayImages: z.array(z.number().int().nonnegative()).optional(),

    // Internationalized content
    i18n: I18nContentSchema,

    // Metadata and specifications
    metadata: ProductMetadataSchema,
    specifications: SpecificationsSchema,

    // Oak-specific fields (optional)
    isFinished: z.boolean().optional(),
    finishType: z.enum(['unfinished', 'oiled', 'lacquered', 'stained']).optional(),
    finishingOptions: FinishingOptionsSchema,
    constructionType: z.enum(['engineered', 'solid']).optional(),
    woodSpecies: z.enum(['oak', 'bamboo', 'walnut', 'pine']).optional(),
    mountingType: z.enum(['plank', 'herringbone', 'chevron']).optional(),
    manufacturerProductId: z.string().optional(),
    woodGrade: z.enum(['select', 'rustic', 'light-rustic', 'natural']).optional(),
    surfaceTreatment: z.string().nullable().optional(),
    dimensions: DimensionsSchema,
    topLayer: z.number().optional(),
    sourceUrl: z.string().url().optional(),
});

// ============================================================================
// Translation Result Schema
// ============================================================================

/**
 * Schema for Azure API translation response
 */
export const TranslationResultSchema = z.object({
    en: z.object({
        description: z.string().optional(),
        seo: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            keywords: z.array(z.string()).optional(),
        }).optional(),
    }),
    bg: z.object({
        description: z.string().optional(),
        seo: z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            keywords: z.array(z.string()).optional(),
        }).optional(),
    }),
    improvements: z.array(z.string()),
    quality_signals_added: z.array(z.string()).optional(),
});

// ============================================================================
// Validation Helper Functions
// ============================================================================

/**
 * Validate a product object
 * @param product - Product object to validate
 * @returns Validation result with success flag and errors if any
 */
export function validateProduct(product: unknown): {
    success: boolean;
    data?: z.infer<typeof ProductSchema>;
    errors?: z.ZodError;
} {
    const result = ProductSchema.safeParse(product);

    if (result.success) {
        return { success: true, data: result.data };
    } else {
        return { success: false, errors: result.error };
    }
}

/**
 * Validate translation result from API
 * @param result - Translation result to validate
 * @returns Validation result with success flag and errors if any
 */
export function validateTranslationResult(result: unknown): {
    success: boolean;
    data?: z.infer<typeof TranslationResultSchema>;
    errors?: z.ZodError;
} {
    const validationResult = TranslationResultSchema.safeParse(result);

    if (validationResult.success) {
        return { success: true, data: validationResult.data };
    } else {
        return { success: false, errors: validationResult.error };
    }
}

/**
 * Format Zod validation errors for logging
 * @param errors - Zod errors object
 * @returns Formatted error message
 */
export function formatValidationErrors(errors: z.ZodError): string {
    return errors.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('; ');
}

// ============================================================================
// Type Exports
// ============================================================================

export type Product = z.infer<typeof ProductSchema>;
export type TranslationResult = z.infer<typeof TranslationResultSchema>;
export type I18nContent = z.infer<typeof I18nContentSchema>;
export type LocalizedContent = z.infer<typeof LocalizedContentSchema>;
export type SEOMetadata = z.infer<typeof SEOMetadataSchema>;
export type ProductMetadata = z.infer<typeof ProductMetadataSchema>;
export type Specifications = z.infer<typeof SpecificationsSchema>;
