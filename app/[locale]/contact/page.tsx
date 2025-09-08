import 'server-only';
import { Stack, Typography } from '@mui/material';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import { ContactHero } from './ContactHero.section';
import Footer from '@/components/layout/footer/Footer.component';

export default async function ContactPage() {
    return (
        <Stack>
            <ContactHero />
            <PageLayoutContainer bgcolor='primary.contrastText' pb={{ xs: 8, md: 12 }} pt={{ xs: 6, md: 12 }}>
                <Typography>Contact</Typography>
            </PageLayoutContainer>
            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}