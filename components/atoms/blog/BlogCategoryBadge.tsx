'use client';
import { Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import type { BlogCategory } from '@/lib/types/blog';

interface BlogCategoryBadgeProps {
    category: BlogCategory;
}

export function BlogCategoryBadge({ category }: BlogCategoryBadgeProps) {
    const t = useTranslations('blog.categories');
    return (
        <Chip
            label={t(category)}
            color="primary"
            size="small"
        />
    );
}