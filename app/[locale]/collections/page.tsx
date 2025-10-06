import 'server-only';
import { Stack } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import { CollectionsHero } from './CollectionsHero.section';
import { CollectionsGrid } from './CollectionsGrid.section';
import Footer from '@/components/layout/footer/Footer.component';

// Force static generation
export const dynamic = 'error';

interface CollectionsPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function CollectionsPage({ params }: CollectionsPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const c = await getTranslations('collections');
    const t = await getTranslations('home');

    return (
        <Stack>
            <CollectionsHero />
            <PageLayoutContainer bgcolor={{ xs: '#EFEEE5', md: "#DEDCD8" }}>
                <CollectionsGrid title={c('title')} subtitle={t('hero.subtitle')} />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}