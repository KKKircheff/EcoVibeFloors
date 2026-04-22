import 'server-only';
import { Stack, Typography } from '@mui/material';

import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import Breadcrumb from '@/components/molecules/breadcrumb/Breadcrumb';
import { AuthorByline } from '@/components/molecules/blog/AuthorByline';

import type { BlogCategory } from '@/lib/types/blog';
import type { Author } from '@/lib/authors/authors';

interface BlogPostHeaderProps {
    title: string;
    category: BlogCategory;
    date: string;
    readingTime: number;
    locale: string;
    author: Author;
}

export function BlogPostHeader({ title, category, date, readingTime, locale, author }: BlogPostHeaderProps) {
    const breadcrumbItems = [
        { label: locale === 'bg' ? 'Начало' : 'Home', href: '/' },
        { label: locale === 'bg' ? 'Блог' : 'Blog', href: '/blog' },
        { label: title },
    ];

    return (
        <PageLayoutContainer bgcolor="grey.50" py={{ xs: 4, lg: 2 }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
                {/* Breadcrumb stays left-aligned inside the centered stack */}
                <Stack alignSelf="flex-start">
                    <Breadcrumb items={breadcrumbItems} />
                </Stack>

                <Typography
                    variant="h1"
                    fontWeight={600}
                    color="info.main"
                    pt={0}
                    pb={2}
                >
                    {title}
                </Typography>

                <Stack alignItems="center" pb={4}>
                    <AuthorByline author={author} locale={locale} />
                </Stack>

            </Stack>
        </PageLayoutContainer>
    );
}
