/**
 * Server-side Firestore blog post queries using the Admin SDK.
 * Used in generateStaticParams and Server Components — never imported client-side.
 */
import 'server-only';
import { Timestamp } from 'firebase-admin/firestore';
import { adminDb } from '@/lib/firebase-admin';
import { BlogPost } from '@/lib/types/blog';
import { routing } from '@/i18n/routing';

const COLLECTION = 'blogPosts';

/** Recursively strip Firestore Timestamps from a document and all nested objects */
function serialize(data: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
        if (value instanceof Timestamp) {
            result[key] = value.toDate();
        } else if (Array.isArray(value)) {
            result[key] = value.map((item) =>
                typeof item === 'object' && item !== null && !(item instanceof Timestamp)
                    ? serialize(item as Record<string, unknown>)
                    : item instanceof Timestamp
                    ? item.toDate()
                    : item
            );
        } else if (typeof value === 'object' && value !== null) {
            result[key] = serialize(value as Record<string, unknown>);
        } else {
            result[key] = value;
        }
    }
    return result;
}

/** Fetch a single blog post by slug (direct document ID lookup). */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const snap = await adminDb.collection(COLLECTION).doc(slug).get();
    if (!snap.exists) return null;
    const data = snap.data();
    if (!data) return null;
    return serialize(data) as unknown as BlogPost;
}

/** Fetch all blog posts — used in generateStaticParams to enumerate every page. */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
    const snap = await adminDb.collection(COLLECTION).get();
    return snap.docs
        .map((d) => {
            const data = d.data();
            return data ? serialize(data) : null;
        })
        .filter((d): d is Record<string, unknown> & BlogPost => d !== null);
}

/**
 * Fetch published blog posts for a given locale.
 * Filters in JS by checking translations.{lang}.status === 'published'.
 */
export async function getPublishedBlogPosts(locale: string): Promise<BlogPost[]> {
    const all = await getAllBlogPosts();
    return all.filter((post) => {
        const translation = post.translations[locale as 'bg' | 'en'];
        return translation?.status === 'published';
    });
}

export interface MinimalBlogPost {
    slug: string;
    title: string;
    heroImageUrl: string;
    date: string;
}

/** Fetch minimal data for related posts to display in the sidebar (max 3). */
export async function getRelatedBlogPosts(slugs: string[], locale: string): Promise<MinimalBlogPost[]> {
    const limited = slugs.slice(0, 3);
    const results = await Promise.all(limited.map((slug) => getBlogPostBySlug(slug)));
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'ecovibe-floors.firebasestorage.app';

    return results
        .filter((post): post is NonNullable<typeof post> => post !== null)
        .map((post) => {
            const translation = post.translations[locale as 'bg' | 'en'];
            const encodedPath = encodeURIComponent(post.heroImage);
            return {
                slug: post.slug,
                title: translation?.title ?? post.slug,
                heroImageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`,
                date: post.datePublished ? new Date(post.datePublished as unknown as string).toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
            };
        });
}

/** Fetch posts authored by `authorSlug` that are published in the given locale. */
export async function getBlogPostsByAuthor(authorSlug: string, locale: string): Promise<BlogPost[]> {
    const all = await getPublishedBlogPosts(locale);
    return all.filter((post) => (post.author ?? 'gancho-georgiev') === authorSlug);
}

/** Generate static params for all blog posts across all locales. */
export async function getBlogStaticParams() {
    const posts = await getAllBlogPosts();

    const params: { locale: string; slug: string }[] = [];

    for (const post of posts) {
        for (const locale of routing.locales) {
            const translation = post.translations[locale as 'bg' | 'en'];
            if (translation?.status === 'published') {
                params.push({ locale, slug: post.slug });
            }
        }
    }

    return params;
}
