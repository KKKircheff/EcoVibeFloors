import 'server-only';
import { notFound } from 'next/navigation';
import { Stack } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import Footer from '@/components/organisms/footer/Footer';
import { BlogPostHero } from './(sections)/BlogPostHero.section';
import { BlogSectionRenderer, extractIntroBlocks } from '@/components/organisms/blog/BlogSectionRenderer';
import { BlogPostCTA } from './(sections)/BlogPostCTA.section';
import { BlogJsonLd } from '@/components/atoms/seo/BlogJsonLd';
import { BlogIntroSection } from './(sections)/BlogIntroSection.section';
import { BlogPostTags } from './(sections)/BlogPostTags.section';
import { buildAlternates } from '@/lib/seo';
import { getBlogPostBySlug, getBlogStaticParams } from '@/lib/firebase/blog';
import { parseBlocks } from '@/lib/markdown/parse-blocks';

// Allow new blog posts to generate their pages on first visit
export const dynamicParams = true;

interface BlogPostPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateStaticParams() {
    return getBlogStaticParams();
}

function getFirebaseStorageUrl(path: string): string {
    const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'ecovibe-floors.firebasestorage.app';
    const encodedPath = encodeURIComponent(path);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
}

function toDate(value: unknown): Date {
    if (!value) return new Date();
    if (typeof value === 'object' && value !== null && 'toDate' in value) {
        return (value as { toDate: () => Date }).toDate();
    }
    if (value instanceof Date) return value;
    return new Date(value as string);
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { locale, slug } = await params;

    const post = await getBlogPostBySlug(slug);
    if (!post) return {};

    const translation = post.translations[locale as 'bg' | 'en'];
    if (!translation) return {};

    return {
        title: `${translation.title} | EcoVibe Floors Blog`,
        description: translation.metaDescription,
        keywords: translation.tags.join(', '),
        alternates: buildAlternates(locale, `/blog/${slug}`),
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { locale, slug } = await params;

    setRequestLocale(locale);

    const post = await getBlogPostBySlug(slug);
    if (!post) {
        notFound();
    }

    const translation = post.translations[locale as 'bg' | 'en'];
    if (!translation) {
        notFound();
    }

    const heroImageUrl = getFirebaseStorageUrl(post.heroImage);
    const datePublished = toDate(translation.datePublished || post.datePublished);
    const dateModified = toDate(post.dateModified);

    const formattedDate = datePublished.toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Extract intro paragraphs (content before the first H2)
    const allBlocks = parseBlocks(translation.contentMarkdown);
    const introParagraphs = extractIntroBlocks(allBlocks);

    return (
        <Stack>
            <BlogJsonLd
                title={translation.title}
                description={translation.metaDescription}
                slug={slug}
                heroImageUrl={heroImageUrl}
                datePublished={datePublished}
                dateModified={dateModified}
                schemaType={post.schemaType}
                locale={locale}
            />

            <BlogPostHero
                title={translation.title}
                heroImageUrl={heroImageUrl}
            />

            {/* Intro section: meta strip + opening paragraphs */}
            <PageLayoutContainer py={0} justifyContent={'center'} alignItems={'center'}>
                <BlogIntroSection
                    category={post.category}
                    date={formattedDate}
                    readingTime={translation.readingTimeMinutes || 5}
                    introParagraphs={introParagraphs}
                />
            </PageLayoutContainer>

            {/* Article body: grouped into 2–3 full-width sections */}
            <BlogSectionRenderer content={translation.contentMarkdown} />

            {/* Tags section */}
            {translation.tags && translation.tags.length > 0 && (
                <PageLayoutContainer bgcolor="InfoBackground" py={{ xs: 4, md: 6 }}>
                    <BlogPostTags tags={translation.tags} />
                </PageLayoutContainer>
            )}

            <PageLayoutContainer bgcolor="primary.main" py={{ xs: 4, md: 8 }}>
                <BlogPostCTA />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
