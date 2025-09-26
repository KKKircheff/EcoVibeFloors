import 'server-only';
import { alpha, Stack } from '@mui/material';

import { HomeHero } from './home/HomeHero.section';
import { HomeFeatures } from './home/HomeFeatures.section';
import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import { ImageTextGrid } from '@/components/ui/grid/ImageTextGrid';
import QuotesSection from './home/Quotes.section';
import { palette } from '@/lib/styles/pallete';
import HomecardsSection from './home/Homecards.section';

export default async function HomePage() {
    const bgcolor = alpha(palette.info[50], .4)
    return (
        <Stack width={'100%'}>
            <HomeHero />

            <PageLayoutContainer pb={{ xs: 8, md: 20 }} pt={{ xs: 6, md: 20 }} width='100%' bgcolor={bgcolor} >
                <HomeFeatures />
            </PageLayoutContainer>

            <PageLayoutContainer
                py={{ xs: 4, md: 6 }}
                sx={{
                    backgroundImage: 'url(/images/tree-bg-1.webp)',
                    backgroundSize: 'auto',
                    backgroundPosition: 'left center',
                    backgroundRepeat: 'repeat-y',
                }}
            >
                <QuotesSection />
                <HomecardsSection />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>

        </Stack>
    );
}
