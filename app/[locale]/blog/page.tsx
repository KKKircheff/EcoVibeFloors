import 'server-only';
import { notFound } from 'next/navigation';
import { alpha, Stack } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import Footer from '@/components/organisms/footer/Footer';
import { BlogIndexHero } from './(sections)/BlogIndexHero.section';
import { BlogPostGrid } from './(sections)/BlogPostGrid.section';
import { buildAlternates } from '@/lib/seo';
import { getPublishedBlogPosts } from '@/lib/firebase/blog';
import { routing } from '@/i18n/routing';
import { palette } from '@/lib/styles/pallete';

// Allow new blog posts to generate their pages on first visit
export const dynamicParams = true;

interface BlogIndexPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: BlogIndexPageProps): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: 'Flooring Insights & Inspiration | EcoVibe Floors Blog',
        description: 'Expert guidance on engineered parquet, hybrid flooring, and SPC. Learn about materials, installation, and care from EcoVibe Floors.',
        alternates: buildAlternates(locale, '/blog'),
    };
}

export default async function BlogIndexPage({ params }: BlogIndexPageProps) {
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as 'bg' | 'en')) {
        notFound();
    }

    setRequestLocale(locale);

    const posts = await getPublishedBlogPosts(locale);
    const bgcolor = alpha(palette.info[50], .4)
    return (
        <Stack >
            <BlogIndexHero />
            <PageLayoutContainer bgcolor={bgcolor} py={{ xs: 6, md: 10 }} >
                <BlogPostGrid posts={posts} locale={locale as 'bg' | 'en'} />
            </PageLayoutContainer>
        </Stack>
    );
}
