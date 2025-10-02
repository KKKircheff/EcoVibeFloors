import 'server-only';
import { Stack, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import { CustomOakHero } from './CustomOakHero.section';
import Footer from '@/components/layout/footer/Footer.component';

// Force static generation
export const dynamic = 'error';

interface CustomOakPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function CustomOakPage({ params }: CustomOakPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations('customOak');

    return (
        <Stack>
            <CustomOakHero />
            <PageLayoutContainer bgcolor='primary.contrastText' pb={{ xs: 8, md: 12 }} pt={{ xs: 6, md: 12 }}>
                <Typography>{t('pageTitle')}</Typography>
            </PageLayoutContainer>
            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}