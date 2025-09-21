import 'server-only';
import { Stack, Typography } from '@mui/material';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import { OakHero } from './OakHero.section';
import Footer from '@/components/layout/footer/Footer.component';

export default async function OakPage() {
    return (
        <Stack>
            <OakHero />
            <PageLayoutContainer bgcolor='primary.contrastText' pb={{ xs: 8, md: 12 }} pt={{ xs: 6, md: 12 }}>
                <Typography>Premium Oak Collection</Typography>
            </PageLayoutContainer>
            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}