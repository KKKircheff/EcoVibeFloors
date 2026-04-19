import 'server-only';
import { notFound } from 'next/navigation';
import { alpha, Box, Stack, Typography } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import Footer from '@/components/organisms/footer/Footer';
import { BlogSectionRenderer, InlineContent } from '@/components/organisms/blog/BlogSectionRenderer';
import { BlogPostCTA } from './(sections)/BlogPostCTA.section';
import { BlogJsonLd } from '@/components/atoms/seo/BlogJsonLd';
import { BlogPostHeader } from './(sections)/BlogPostHeader.section';
import { BlogHeroImage } from './(sections)/BlogHeroImage.section';
import { BlogSidebar } from './(sections)/BlogSidebar.section';
import { buildAlternates } from '@/lib/seo';
import { getBlogPostBySlug, getBlogStaticParams, getRelatedBlogPosts } from '@/lib/firebase/blog';
import { parseBlocks, extractTocBlock, extractPreH2Blocks } from '@/lib/markdown/parse-blocks';
import { getFirebaseStorageUrl } from '@/lib/utils/getStorageUrl';
import { palette } from '@/lib/styles/pallete';
import { layoutPaddings } from '@/lib/styles/layoutPaddings';
import PageLayoutContainer from '@/components/layout/PageLayoutContainer';

import { BlogCategoryBadge } from '@/components/atoms/blog/BlogCategoryBadge';
import { BlogContent } from '@/components/atoms/typography/BlogContent';
import { borderRadius } from '@/lib/styles/borderRadius';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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
            />

            {/* A: Header — breadcrumb + title + meta strip */}
            <BlogPostHeader
                title={translation.title}
                category={post.category}
                date={formattedDate}
                readingTime={translation.readingTimeMinutes || 5}
                locale={locale}
            />

            {/* B+C: Two-column body — left white, right grey */}
            <PageLayoutContainer
                direction={{ xs: 'column', lg: 'row' }}
                pb={{ xs: 8, md: 20 }}
                width='100%'
                spacing={6}
            >
                {/* Left column — hero image + article (white) */}
                <Stack
                    sx={{
                        width: { xs: '100%', lg: '65%' },
                        py: { xs: 5, md: 0 },
                    }}
                >
                    <Stack component="article" spacing={3}>
                        <Stack direction="row" justifyContent="flex-start" flexWrap="wrap" spacing={2}>
                            <BlogCategoryBadge category={post.category} />
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <CalendarTodayIcon sx={{ fontSize: 15, color: 'info.400' }} />
                                <Typography variant="body2" color="info.400">
                                    {formattedDate}
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <AccessTimeIcon sx={{ fontSize: 15, color: 'info.400' }} />
                                <Typography variant="body2" color="info.400">
                                    {translation.readingTimeMinutes || 5} min
                                </Typography>
                            </Stack>
                        </Stack>

                        {/* Hero image with tags overlay */}
                        <BlogHeroImage
                            src={heroImageUrl}
                            alt={translation.title}
                            tags={translation.tags}
                        />

                        {/* Intro blocks: paragraphs + Накратко blockquote */}
                        <Stack spacing={1.5}>
                            {introBlocks.map((block, i) => {
                                if (block.type === 'paragraph') {
                                    return block.items.map((text: string, j: number) => (
                                        <BlogContent key={`${i}-${j}`}>
                                            <InlineContent text={text} />
                                        </BlogContent>
                                    ));
                                }
                                if (block.type === 'blockquote') {
                                    return (
                                        <Stack
                                            key={i}
                                            component="blockquote"
                                            sx={{
                                                borderLeft: '4px solid',
                                                borderColor: 'primary.main',
                                                borderRadius: '0 8px 8px 0',
                                                pl: 4, pr: 3, py: 3, my: 0,
                                                bgcolor: 'primary.50',
                                            }}
                                        >
                                            <BlogContent><InlineContent text={block.text} /></BlogContent>
                                        </Stack>
                                    );
                                }
                                return null;
                            })}
                        </Stack>

                        {/* Article body sections */}
                        <BlogSectionRenderer content={translation.contentMarkdown} />
                    </Stack>
                </Stack>

                {/* Right column — sidebar (warm grey) */}
                <Box
                    pt={1}
                    sx={{
                        width: { xs: '100%', lg: '35%' },
                    }}>
                    <Stack
                        bgcolor={bgcolor}
                        borderRadius={borderRadius.lg}
                        p={5}

                    >
                        <BlogSidebar
                            title={translation.title}
                            category={post.category}
                            tocItems={tocItems}
                            relatedPosts={relatedPosts}
                            heroImageUrl={heroImageUrl}
                            locale={locale}
                        />
                    </Stack>
                </Box>
            </PageLayoutContainer>

            {/* D: CTA */}
            <PageLayoutContainer bgcolor="primary.main" py={{ xs: 4, md: 8 }}>
                <BlogPostCTA />
            </PageLayoutContainer>

            {/* E: Footer */}
            {/* <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer> */}
        </Stack>
    );
}
