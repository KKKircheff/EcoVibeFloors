import 'server-only';
import { alpha, Stack } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
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

    return (
        <Stack width={'100%'}>
            <HybridWoodHero />

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <HybridWoodStyles />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor={overviewBgcolor} py={{ xs: 6, md: 10 }}>
                <HybridWoodOverview />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <HybridWoodFeatures />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='secondary.main' py={{ xs: 6, md: 10 }}>
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