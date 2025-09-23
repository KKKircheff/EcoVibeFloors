import 'server-only';
import { alpha, Stack } from '@mui/material';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import { VinylHero } from './VinylHero.section';
import { VinylOverview } from './VinylOverview.section';
import { VinylCollections } from './VinylCollections.section';
import { VinylFeatures } from './VinylFeatures.section';
import { VinylComparison } from './VinylComparison.section';
import { VinylInstallation } from './VinylInstallation.section';
import { VinylCta } from './VinylCta.section';
import Footer from '@/components/layout/footer/Footer.component';
import { palette } from '@/lib/styles/pallete';

export default async function VinylPage() {
    const overviewBgcolor = alpha(palette.info[50], .4);

    return (
        <Stack width={'100%'}>
            <VinylHero />

            <PageLayoutContainer bgcolor={overviewBgcolor} py={{ xs: 6, md: 10 }}>
                <VinylOverview />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <VinylCollections />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='primary.contrastText' py={{ xs: 6, md: 10 }}>
                <VinylFeatures />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.100' py={{ xs: 6, md: 10 }}>
                <VinylComparison />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='secondary.main' py={{ xs: 6, md: 10 }}>
                <VinylInstallation />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 6, md: 10 }}>
                <VinylCta />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}