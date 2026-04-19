import 'server-only';
import { Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTag } from '@/components/atoms/blog/BlogTag';

interface BlogPostTagsProps {
    tags: string[];
}

export async function BlogPostTags({ tags }: BlogPostTagsProps) {
    const t = await getTranslations('blog.sidebar');

    return (
        <Stack spacing={2}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                {t('tags')}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
                {tags.map((tag) => (
                    <BlogTag key={tag} tag={tag} />
                ))}
            </Stack>
        </Stack>
    );
}