import 'server-only';
import { Stack } from '@mui/material';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import { buildAlternates } from '@/lib/seo';
import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import Breadcrumb from '@/components/molecules/breadcrumb/Breadcrumb';
import { ClickVinylHero } from './(sections)/ClickVinylHero.section';
import { ClickVinylCollections } from './(sections)/ClickVinylCollections.section';
import { ClickVinylFeatures } from './(sections)/ClickVinylFeatures.section';
import Footer from '@/components/organisms/footer/Footer';
import { ClickVinylCTA } from './(sections)/ClickVinylCTA.section';

// Force static generation
export const dynamic = 'error';

interface ClickVinylPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: ClickVinylPageProps): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: buildAlternates(locale, '/click-vinyl') };
}

export default async function ClickVinylPage({ params }: ClickVinylPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'breadcrumb' });
    const tCollections = await getTranslations({ locale, namespace: 'collections.names' });

    const breadcrumbItems = [
        { label: t('home'), href: '/' },
        { label: t('collections'), href: '/collections' },
        { label: tCollections('click-vinyl') }
    ];

    return (
        <Stack width={'100%'}>
            <PageLayoutContainer bgcolor='grey.50' pt={{ xs: 2, md: 4 }}>
                <Breadcrumb items={breadcrumbItems} />
                <ClickVinylHero />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }} id='click-vinyl-learn-more'>
                <ClickVinylCollections />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <ClickVinylFeatures />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 6, md: 10 }}>
                <ClickVinylCTA />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}