import 'server-only';
import { notFound } from 'next/navigation';
import { alpha, Box, Stack } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import { BlogPostCTA } from './(sections)/BlogPostCTA.section';
import { BlogJsonLd } from '@/components/atoms/seo/BlogJsonLd';
import { BlogPostHeader } from './(sections)/BlogPostHeader.section';
import { BlogSidebar } from './(sections)/BlogSidebar.section';
import { BlogArticleBody } from './(sections)/BlogArticleBody.section';
import { buildAlternates } from '@/lib/seo';
import { getAuthor } from '@/lib/authors/authors';
import { getBlogPostBySlug, getBlogStaticParams, getRelatedBlogPosts } from '@/lib/firebase/blog';
import { parseBlocks, extractTocBlock, extractPreH2Blocks } from '@/lib/markdown/parse-blocks';
import { getFirebaseStorageUrl } from '@/lib/utils/getStorageUrl';
import { palette } from '@/lib/styles/pallete';
import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import { borderRadius } from '@/lib/styles/borderRadius';

export const dynamicParams = true;

interface BlogPostPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

const bgcolor = alpha(palette.info[50], .4)

export async function generateStaticParams() {
    return getBlogStaticParams();
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
    if (!post) notFound();

    const translation = post.translations[locale as 'bg' | 'en'];
    if (!translation) notFound();

    const heroImageUrl = getFirebaseStorageUrl(post.heroImage);
    const datePublished = toDate(translation.datePublished || post.datePublished);
    const dateModified = toDate(post.dateModified);
    const author = getAuthor(post.author);

    const formattedDate = datePublished.toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const allBlocks = parseBlocks(translation.contentMarkdown);
    const introBlocks = extractPreH2Blocks(allBlocks);
    const tocItems = extractTocBlock(allBlocks);

    const relatedPosts = post.relatedPostSlugs?.length
        ? await getRelatedBlogPosts(post.relatedPostSlugs, locale)
        : [];

    return (
        <Stack width={{ xs: '100%', xl: '90vw' }} mx={'auto'}>
            <BlogJsonLd
                title={translation.title}
                description={translation.metaDescription}
                slug={slug}
                heroImageUrl={heroImageUrl}
                datePublished={datePublished}
                dateModified={dateModified}
                schemaType={post.schemaType}
                locale={locale}
                author={author}
                faq={translation.faq}
                sources={translation.sources}
            />

            {/* A: Header — breadcrumb + title + meta strip */}
            <BlogPostHeader
                title={translation.title}
                category={post.category}
                date={formattedDate}
                readingTime={translation.readingTimeMinutes || 5}
                locale={locale}
                author={author}
            />

            {/* B+C: Two-column body — left article, right sidebar */}
            <PageLayoutContainer pb={{ xs: 8, lg: 12 }} width='100%' spacing={6}>
                <Stack direction={{ xs: 'column', lg: 'row' }} spacing={6}>
                    {/* Left column — article */}
                    <Stack
                        sx={{
                            width: { xs: '100%', lg: '65%' },
                            py: { xs: 5, md: 0 },
                        }}
                    >
                        <BlogArticleBody
                            contentMarkdown={translation.contentMarkdown}
                            heroImageUrl={heroImageUrl}
                            alt={translation.heroImageAlt || translation.title}
                            tags={translation.tags}
                            formattedDate={formattedDate}
                            readingTimeMinutes={translation.readingTimeMinutes || 5}
                            category={post.category}
                            introBlocks={introBlocks}
                            sources={translation.sources}
                            locale={locale}
                        />
                    </Stack>

                    {/* Right column — sticky sidebar */}
                    <Box
                        pt={1}
                        sx={{ width: { xs: '100%', lg: '35%' } }}
                    >
                        <Box sx={{ position: { lg: 'sticky' }, top: { lg: '80px' } }}>
                            <Stack
                                bgcolor={bgcolor}
                                borderRadius={borderRadius.lg}
                                p={{ xs: 1, lg: 5 }}
                                sx={{
                                    maxHeight: { lg: 'calc(100vh - 96px)' },
                                    overflowY: { lg: 'auto' },
                                    scrollbarWidth: 'none',
                                    '&::-webkit-scrollbar': { display: 'none' },
                                }}
                            >
                                <BlogSidebar
                                    category={post.category}
                                    tocItems={tocItems}
                                    relatedPosts={relatedPosts}
                                    heroImageUrl={heroImageUrl}
                                    locale={locale}
                                />
                            </Stack>
                        </Box>
                    </Box>
                </Stack>

                {/* D: CTA */}
                <PageLayoutContainer bgcolor="primary.main" py={{ xs: 4, md: 8 }}>
                    <BlogPostCTA />
                </PageLayoutContainer>
            </PageLayoutContainer>
        </Stack>
    );
}
