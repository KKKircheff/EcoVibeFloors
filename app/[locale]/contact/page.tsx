import 'server-only';
import { Stack } from '@mui/material';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import { ContactHero } from './ContactHero.section';
import Footer from '@/components/layout/footer/Footer.component';
import ContactForm from './ContactForm.section';

export default async function ContactPage() {
    return (
        <Stack>
            <ContactHero />
            <PageLayoutContainer id="contact-form" bgcolor='primary.contrastText' py={{ xs: 8, md: 12 }}>
                <ContactForm />
            </PageLayoutContainer>
            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}