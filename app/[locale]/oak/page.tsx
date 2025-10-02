import 'server-only';
import { Stack, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import { OakHero } from './OakHero.section';
import Footer from '@/components/layout/footer/Footer.component';

export const dynamic = 'error';

interface OakPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function OakPage({ params }: OakPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations('oak');

    return (
        <Stack>
            <OakHero />
            <PageLayoutContainer bgcolor='primary.contrastText' pb={{ xs: 8, md: 12 }} pt={{ xs: 6, md: 12 }}>
                <Typography>{t('pageTitle')}</Typography>
            </PageLayoutContainer>
            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}