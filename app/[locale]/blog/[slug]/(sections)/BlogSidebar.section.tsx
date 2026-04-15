import 'server-only';
import { Stack, Typography, Box } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTag } from '@/components/atoms/blog/BlogTag';
import { BlogCategoryBadge } from '@/components/atoms/blog/BlogCategoryBadge';
import { BlogMeta } from '@/components/atoms/blog/BlogMeta';
import PrimaryActionButton from '@/components/atoms/buttons/PrimaryActionButton';
import { BlogPost } from '@/lib/types/blog';

interface BlogSidebarProps {
    post: BlogPost;
    locale: 'bg' | 'en';
}

function formatDate(date: unknown, locale: string): string {
    if (!date) return '';
    const d = typeof date === 'object' && date !== null && 'toDate' in date
        ? (date as { toDate: () => Date }).toDate()
        : new Date(date as string);

    return d.toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export async function BlogSidebar({ post, locale }: BlogSidebarProps) {
    const t = await getTranslations('blog.sidebar');
    const translation = post.translations[locale];

    if (!translation) return null;

    const formattedDate = formatDate(translation.datePublished || post.datePublished, locale);

    return (
        <Stack spacing={4} position="sticky" top={120}>
            {/* Category */}
            <Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    {t('category')}
                </Typography>
                <BlogCategoryBadge category={post.category} />
            </Box>

            {/* Meta */}
            <Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                    {t('published')}
                </Typography>
                <BlogMeta
                    date={formattedDate}
                    readingTime={translation.readingTimeMinutes || 5}
                />
            </Box>

            {/* Tags */}
            {translation.tags && translation.tags.length > 0 && (
                <Box>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        {t('tags')}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {translation.tags.map((tag) => (
                            <BlogTag key={tag} tag={tag} />
                        ))}
                    </Stack>
                </Box>
            )}

            {/* Collection CTA */}
            <Box>
                <PrimaryActionButton
                    variant="contained"
                    href={`/${post.category === 'brand' ? 'collections' : post.category}`}
                    sx={{ width: '100%' }}
                >
                    {t('exploreCollection')}
                </PrimaryActionButton>
            </Box>
        </Stack>
    );
}
