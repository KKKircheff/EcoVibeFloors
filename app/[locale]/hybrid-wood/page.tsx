import 'server-only';
import { Stack } from '@mui/material';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import Breadcrumb from '@/components/molecules/breadcrumb/Breadcrumb';
import { HybridWoodHero } from './(sections)/HybridWoodHero.section';
import { HybridWoodFeatures } from './(sections)/HybridWoodFeatures.section';
import { HybridWoodSpecs } from './(sections)/HybridWoodSpecs.section';
import { HybridWoodStyles } from './(sections)/HybridWoodStyles.section';
import Footer from '@/components/organisms/footer/Footer';
import { Sustainability } from './(sections)/Sustainability.section';
import { HybridWoodCTA } from './(sections)/HybridWoodCTA.section';

// Force static generation
export const dynamic = 'error';

interface HybridWoodPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function HybridWoodPage({ params }: HybridWoodPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'breadcrumb' });
    const tCollections = await getTranslations({ locale, namespace: 'collections.names' });

    const breadcrumbItems = [
        { label: t('home'), href: '/' },
        { label: t('collections'), href: '/collections' },
        { label: tCollections('hybrid-wood') }
    ];

    return (
        <Stack width={'100%'}>
            <PageLayoutContainer bgcolor='grey.50' pt={{ xs: 2, md: 4 }}>
                <Breadcrumb items={breadcrumbItems} />
                <HybridWoodHero />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }} id='hybrid-wood-learn-more'>
                <HybridWoodStyles />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <HybridWoodFeatures />
            </PageLayoutContainer>


            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <HybridWoodSpecs />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }} >
                <Sustainability />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 6, md: 10 }}>
                <HybridWoodCTA />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}