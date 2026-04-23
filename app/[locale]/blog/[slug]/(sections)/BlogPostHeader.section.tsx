import 'server-only';
import { Divider, Stack, Typography } from '@mui/material';

import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import Breadcrumb from '@/components/molecules/breadcrumb/Breadcrumb';
import { AuthorByline } from '@/components/molecules/blog/AuthorByline';

import type { BlogCategory } from '@/lib/types/blog';
import type { Author } from '@/lib/authors/authors';

interface BlogPostHeaderProps {
    title: string;
    subtitle: string;
    category: BlogCategory;
    date: string;
    readingTime: number;
    locale: string;
    author: Author;
}

export function BlogPostHeader({ title, subtitle, date, locale, author }: BlogPostHeaderProps) {
    const breadcrumbItems = [
        { label: locale === 'bg' ? 'Начало' : 'Home', href: '/' },
        { label: locale === 'bg' ? 'Блог' : 'Blog', href: '/blog' },
        { label: title },
    ];

    return (
        <PageLayoutContainer bgcolor="grey.50" py={{ xs: 4, lg: 3 }}>
            <Stack spacing={0}>
                <Breadcrumb items={breadcrumbItems} />
                <Stack alignItems={'center'}>
                    <Typography
                        variant="h1"
                        fontWeight={600}
                        color="info.main"
                        pt={2}
                        pb={1.5}
                        textAlign={'center'}
                        maxWidth={'72ch'}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        pb={3}
                        textAlign={'center'}
                        sx={{ maxWidth: '100ch', lineHeight: 1.7 }}
                    >
                        {subtitle}
                    </Typography>
                </Stack>

                <Divider />

                <Stack py={2}>
                    <AuthorByline author={author} locale={locale} compact date={date} />
                </Stack>

                <Divider />
            </Stack>
        </PageLayoutContainer>
    );
}
