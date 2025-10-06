import 'server-only';
import { alpha, Stack } from '@mui/material';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import { HybridWoodHero } from './HybridWoodHero.section';
import { HybridWoodOverview } from './HybridWoodOverview.section';
import { HybridWoodFeatures } from './HybridWoodFeatures.section';
import { HybridWoodSustainability } from './HybridWoodSustainability.section';
import { HybridWoodSpecs } from './HybridWoodSpecs.section';
import { HybridWoodStyles } from './HybridWoodStyles.section';
import { HybridWoodCta } from './HybridWoodCta.section';
import Footer from '@/components/layout/footer/Footer.component';
import { palette } from '@/lib/styles/pallete';

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
    const overviewBgcolor = alpha(palette.info[50], .4);

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

            <PageLayoutContainer bgcolor='secondary.main' py={{ xs: 6, md: 10 }} >
                <HybridWoodSustainability />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <HybridWoodSpecs />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 6, md: 10 }}>
                <HybridWoodCta />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}