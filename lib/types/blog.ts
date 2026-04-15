export type BlogCategory =
    | 'engineered-parquet'
    | 'hybrid'
    | 'spc-lvt'
    | 'comparison'
    | 'brand';

export type BlogSchemaType = 'Article' | 'HowTo' | 'FAQPage';

/** Date is used for both Firestore Timestamp (client) and serialized server dates */
export type DateValue = Date | null;

export interface BlogTranslation {
    title: string;
    metaDescription: string;
    primaryKeyword: string;
    tags: string[];
    contentMarkdown: string;
    wordCount: number;
    readingTimeMinutes: number;
    inLanguage: 'bg' | 'en';
    status: 'draft' | 'published' | 'archived';
    datePublished?: DateValue;
}

export interface BlogFeaturedProduct {
    name: string;
    brand: string;
    slug: string;
}

export interface BlogMention {
    type: 'Brand' | 'Product';
    name: string;
}

export interface BlogPost {
    slug: string;
    strategyId: string;
    postType?: 'pillar' | 'cluster' | 'cross-pillar' | 'brand';
    phase?: number;
    category: BlogCategory;
    schemaType?: BlogSchemaType;
    heroImage: string;
    isPartOf?: string | null;
    hasPart?: string[];
    linksTo?: string[];
    relatedPostSlugs?: string[];
    featuredProducts?: BlogFeaturedProduct[];
    mentions?: BlogMention[];
    datePublished?: DateValue;
    dateModified?: DateValue;
    publishedLanguages?: ('bg' | 'en')[];
    translations: {
        bg?: BlogTranslation;
        en?: BlogTranslation;
    };
}

/** Firestore Timestamp check (works on both client and server) */
function isFirestoreTimestamp(v: unknown): v is { toDate: () => Date } {
    return typeof v === 'object' && v !== null && 'toDate' in v;
}

/** Strip Firestore Timestamps for safe serialization to Client Components */
export function serializeBlogPost(data: Record<string, unknown>): BlogPost {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
        if (isFirestoreTimestamp(v)) {
            result[k] = v.toDate();
        } else if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
            // Recursively serialize nested objects (e.g. translations submap)
            result[k] = serializeBlogPost(v as Record<string, unknown>);
        } else {
            result[k] = v;
        }
    }
    return result as unknown as BlogPost;
}
