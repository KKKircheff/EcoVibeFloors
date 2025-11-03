import 'server-only';
import { Stack } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import { CollectionsHero } from './CollectionsHero.section';
import { CollectionsGrid } from './CollectionsGrid.section';
import Footer from '@/components/layout/footer/Footer.component';
import { palette } from '@/lib/styles/pallete';

// Force static generation
export const dynamic = 'error';

interface CollectionsPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: CollectionsPageProps): Promise<Metadata> {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: 'collections' });

    const ogImageUrl = 'https://ecovibefloors.com/images/OG.webp';
    const collectionsUrl = `https://ecovibefloors.com/${locale}/collections`;

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        openGraph: {
            title: t('metadata.title'),
            description: t('metadata.description'),
            type: 'website',
            url: collectionsUrl,
            siteName: 'EcoVibeFloors',
            locale: locale === 'bg' ? 'bg_BG' : 'en_US',
            images: [{
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: t('metadata.ogImageAlt'),
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('metadata.title'),
            description: t('metadata.description'),
            images: [ogImageUrl],
        },
    };
}

export default async function CollectionsPage({ params }: CollectionsPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const c = await getTranslations('collections');
    const t = await getTranslations('home');

    return (
        <Stack>
            <CollectionsHero />
            <PageLayoutContainer bgcolor={{ xs: 'grey.100', md: 'grey.200' }}>
                <CollectionsGrid title={c('title')} subtitle={t('hero.subtitle')} />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}