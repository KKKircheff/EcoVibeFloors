import 'server-only';
import { Stack } from '@mui/material';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import { GlueDownVinylHero } from './(sections)/GlueDownVinylHero.section';
import { GlueDownVinylCollections } from './(sections)/GlueDownVinylCollections.section';
import { GlueDownVinylFeatures } from './(sections)/GlueDownVinylFeatures.section';
import { GlueDownVinylCta } from './(sections)/GlueDownVinylCta.section';
import Footer from '@/components/layout/footer/Footer.component';

// Force static generation
export const dynamic = 'error';

interface GlueDownVinylPageProps {
    params: Promise<{
        locale: string;
    }>;
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

            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <GlueDownVinylCollections />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <GlueDownVinylFeatures />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 6, md: 10 }}>
                <GlueDownVinylCta />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
