import 'server-only';
import { Stack } from '@mui/material';

import { HomeHero } from './home/HomeHero.section';
import { HomeFeatures } from './home/HomeFeatures.section';
import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';

export default async function HomePage() {
    return (
        <Stack>
            <HomeHero />
            <PageLayoutContainer bgcolor='primary.contrastText' pb={{ xs: 8, md: 12 }} pt={{ xs: 6, md: 12 }}>
                <HomeFeatures />
            </PageLayoutContainer>
            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
