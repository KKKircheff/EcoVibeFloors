import 'server-only';
import { Stack } from '@mui/material';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import { buildAlternates } from '@/lib/seo';
import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import Breadcrumb from '@/components/molecules/breadcrumb/Breadcrumb';
import { GlueDownVinylHero } from './(sections)/GlueDownVinylHero.section';
import { GlueDownVinylCollections } from './(sections)/GlueDownVinylCollections.section';
import { GlueDownVinylFeatures } from './(sections)/GlueDownVinylFeatures.section';
import Footer from '@/components/organisms/footer/Footer';
import { GlueDownVinylCTA } from './(sections)/GlueDownVinylCTA.section';

// Force static generation
export const dynamic = 'error';

interface GlueDownVinylPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: GlueDownVinylPageProps): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: buildAlternates(locale, '/glue-down-vinyl') };
}

export default async function GlueDownVinylPage({ params }: GlueDownVinylPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'breadcrumb' });
    const tCollections = await getTranslations({ locale, namespace: 'collections.names' });

    const breadcrumbItems = [
        { label: t('home'), href: '/' },
        { label: t('collections'), href: '/collections' },
        { label: tCollections('glue-down-vinyl') }
    ];

    return (
        <Stack width={'100%'}>
            <PageLayoutContainer bgcolor='grey.50' pt={{ xs: 2, md: 4 }}>
                <Breadcrumb items={breadcrumbItems} />
                <GlueDownVinylHero />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }} id='glue-down-vinyl-learn-more'>
                <GlueDownVinylCollections />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <GlueDownVinylFeatures />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 6, md: 10 }}>
                <GlueDownVinylCTA />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
