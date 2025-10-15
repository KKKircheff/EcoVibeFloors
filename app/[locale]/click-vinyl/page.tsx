import 'server-only';
import { Stack } from '@mui/material';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import { ClickVinylHero } from './(sections)/ClickVinylHero.section';
import { ClickVinylOverview } from './(sections)/ClickVinylOverview.section';
import { ClickVinylCollections } from './(sections)/ClickVinylCollections.section';
import { ClickVinylFeatures } from './(sections)/ClickVinylFeatures.section';
import { ClickVinylComparison } from './(sections)/ClickVinylComparison.section';
import { ClickVinylInstallation } from './(sections)/ClickVinylInstallation.section';
import Footer from '@/components/layout/footer/Footer.component';
import { ClickVinylCTA } from './(sections)/ClickVinylCTA.section';

// Force static generation
export const dynamic = 'error';

interface ClickVinylPageProps {
    params: Promise<{
        locale: string;
    }>;
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