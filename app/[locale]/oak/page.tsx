import 'server-only';
import { Stack } from '@mui/material';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import { OakHero } from './OakHero.section';
import { OakOverview } from './(sections)/OakOverview.section';
import { OakFeatures } from './(sections)/OakFeatures.section';
import { OakPatterns } from './(sections)/OakPatterns.section';
import { OakCTA } from './(sections)/OakCTA.section';
import Footer from '@/components/layout/footer/Footer.component';

export const dynamic = 'error';

interface OakPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: OakPageProps): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: locale === 'en'
            ? 'Natural Oak Parquet Collection | Premium Dutch Oak Flooring'
            : 'Колекция натурален дъбов паркет | Премиум холандски дъб',
        description: locale === 'en'
            ? 'Discover our Natural Oak Parquet collection featuring premium engineered oak flooring with customizable finishing options. Dutch quality with 10-year warranty.'
            : 'Открийте нашата колекция натурален дъбов паркет с премиум ламелен дъбов паркет и персонализируеми опции за довършителни работи. Холандско качество с 10-годишна гаранция.'
    };
}

export default async function OakPage({ params }: OakPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'breadcrumb' });
    const tNavigation = await getTranslations({ locale, namespace: 'navigation' });

    const breadcrumbItems = [
        { label: t('home'), href: '/' },
        { label: t('collections'), href: '/collections' },
        { label: tNavigation('oak') }
    ];

    return (
        <Stack width={'100%'}>
            <PageLayoutContainer bgcolor='grey.50' pt={{ xs: 2, md: 4 }}>
                <Breadcrumb items={breadcrumbItems} />
                <OakHero />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }} id='oak-learn-more'>
                <OakPatterns />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <OakFeatures />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <OakOverview />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 6, md: 10 }}>
                <OakCTA />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}