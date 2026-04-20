import 'server-only';
import Image from 'next/image';
import Link from 'next/link';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import { getTranslations } from 'next-intl/server';
import type { BlogCategory } from '@/lib/types/blog';
import type { MinimalBlogPost } from '@/lib/firebase/blog';
import type { CollectionType } from '@/types/products';
import { getCollectionMetadata } from '@/utils/products/getCollections';
import { getCollectionCardImages } from '@/lib/utils/getCollectionCardImages';
import { BlogTocCard } from './BlogTocCard.section';
import { BlogShareCard } from './BlogShareCard.section';
import { NewsletterCard } from './NewsletterCard.section';

interface BlogSidebarProps {
    category: BlogCategory;
    tocItems: { text: string; anchor: string }[] | null;
    relatedPosts: MinimalBlogPost[];
    heroImageUrl: string;
    locale: string;
}

const categoryRouteMap: Record<BlogCategory, string> = {
    'engineered-parquet': '/oak',
    hybrid: '/hybrid-wood',
    'spc-lvt': '/click-vinyl',
    comparison: '/collections',
    brand: '/collections',
};

const categoryCollectionMap: Partial<Record<BlogCategory, CollectionType>> = {
    'engineered-parquet': 'oak',
    hybrid: 'hybrid-wood',
    'spc-lvt': 'click-vinyl',
};

export async function BlogSidebar({
    category,
    tocItems,
    relatedPosts,
    heroImageUrl,
    locale,
}: BlogSidebarProps) {
    const t = await getTranslations('blog.sidebar');
    const tCategories = await getTranslations('blog.categories');
    const collectionRoute = `/${locale}${categoryRouteMap[category]}`;
    const collectionName = tCategories(category);

    const collectionId = categoryCollectionMap[category];
    const collectionMeta = collectionId ? getCollectionMetadata(collectionId) : null;
    const collectionImage = collectionMeta?.cardImages
        ? getCollectionCardImages(collectionId!, collectionMeta.cardImages.main, collectionMeta.cardImages.hover).mainImage
        : heroImageUrl;

    return (
        <Stack
            component="aside"
            spacing={4}
        >
            {/* Share */}
            <BlogShareCard label={t('share')} />

            {/* Table of Contents */}
            {tocItems && tocItems.length > 0 && (
                <BlogTocCard items={tocItems} label={t('contents')} />
            )}

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'divider' }}>
                    <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}
                        >
                            {t('relatedPosts')}
                        </Typography>
                        <Divider sx={{ my: 1.5 }} />
                        <Stack spacing={2}>
                            {relatedPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/${locale}/blog/${post.slug}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Stack
                                        direction="row"
                                        spacing={1.5}
                                        alignItems="center"
                                        sx={{ '&:hover .related-title': { color: 'primary.main' } }}
                                    >
                                        <Box
                                            position="relative"
                                            flexShrink={0}
                                            sx={{ width: 72, height: 56, borderRadius: 1, overflow: 'hidden' }}
                                        >
                                            <Image
                                                src={post.heroImageUrl}
                                                alt={post.title}
                                                fill
                                                sizes="72px"
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </Box>
                                        <Stack spacing={0.25}>
                                            <Typography
                                                className="related-title"
                                                variant="body2"
                                                color="info.500"
                                                fontWeight={500}
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    transition: 'color 0.2s ease',
                                                }}
                                            >
                                                {post.title}
                                            </Typography>
                                            {post.date && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {post.date}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Stack>
                                </Link>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* Collection Card — visual card linking to the category collection */}
            <Link href={collectionRoute} style={{ textDecoration: 'none' }}>
                <Card
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        borderColor: 'divider',
                        cursor: 'pointer',
                        '&:hover .collection-btn': { bgcolor: 'primary.dark' },
                    }}
                >
                    <Box position="relative" sx={{ height: 250 }}>
                        <Image
                            src={collectionImage}
                            alt={collectionName}
                            fill
                            sizes="350px"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)',
                            }}
                        />
                        <Stack
                            sx={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}
                            spacing={0.25}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: 'rgba(255,255,255,0.75)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    fontSize: '0.62rem',
                                }}
                            >
                                {t('relatedProducts')}
                            </Typography>
                            <Typography variant="subtitle2" color="white" fontWeight={700}>
                                {collectionName}
                            </Typography>
                        </Stack>
                    </Box>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Button
                            className="collection-btn"
                            variant="contained"
                            color="primary"
                            size="small"
                            fullWidth
                            sx={{ borderRadius: 1, transition: 'background-color 0.2s ease', pointerEvents: 'none' }}
                        >
                            {t('exploreCollection')}
                        </Button>
                    </CardContent>
                </Card>
            </Link>

            {/* Newsletter */}
            <NewsletterCard
                locale={locale}
                title={t('newsletter.title')}
                subtitle={t('newsletter.subtitle')}
                placeholder={t('newsletter.placeholder')}
                buttonLabel={t('newsletter.button')}
                loggedInInfo={t('newsletter.loggedInInfo')}
                successMessage={t('newsletter.success')}
            />
        </Stack>
    );
}
