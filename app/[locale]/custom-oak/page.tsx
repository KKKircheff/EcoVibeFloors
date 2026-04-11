import 'server-only';
import { Stack, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import { buildAlternates } from '@/lib/seo';
import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import { CustomOakHero } from './CustomOakHero.section';
import Footer from '@/components/organisms/footer/Footer';

// Force static generation
export const dynamic = 'error';

interface CustomOakPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: CustomOakPageProps): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: buildAlternates(locale, '/custom-oak') };
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