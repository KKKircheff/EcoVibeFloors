'use client';
import { Stack, Typography } from '@mui/material';
import { BlogPost } from '@/lib/types/blog';
import { BlogPostCard } from '@/components/organisms/blog/BlogPostCard';
import { useTranslations } from 'next-intl';

interface BlogPostGridProps {
    posts: BlogPost[];
    locale: 'bg' | 'en';
}

export function BlogPostGrid({ posts, locale }: BlogPostGridProps) {
    const t = useTranslations('blog');

    if (posts.length === 0) {
        return (
            <Stack alignItems="center" py={10} spacing={2}>
                <Typography variant="h5" color="text.secondary">
                    {t('noPosts')}
                </Typography>
            </Stack>
        );
    }

    return (
        <Stack spacing={3} alignItems={'center'}>
            {posts.map((post) => (
                <BlogPostCard key={post.slug} post={post} locale={locale} />
            ))}
        </Stack>
    );
}
