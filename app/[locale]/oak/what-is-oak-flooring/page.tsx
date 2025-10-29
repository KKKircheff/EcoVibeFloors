import 'server-only';
import { Stack } from '@mui/material';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import { OakHero } from '../(sections)/OakHero.section';
import { OakConstruction } from '../(sections)/OakConstruction.section';
import { OakOilTreatment } from '../(sections)/OakOilTreatment.section';
import { OakStyles } from '../(sections)/OakStyles.section';
import { OakSpecs } from '../(sections)/OakSpecs.section';
import { OakSustainability } from '../(sections)/OakSustainability.section';
import Footer from '@/components/layout/footer/Footer.component';
import { OakFeatures } from '../(sections)/OakFeatures.section';
import { OakCTA } from '../(sections)/OakCTA.section';

// Force static generation
export const dynamic = 'error';

interface OakFlooringPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: OakFlooringPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'oakFlooring' });

    return {
        title: t('pageTitle'),
        description: t('hero.subtitle')
    };
}

export default async function OakFlooringPage({ params }: OakFlooringPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'breadcrumb' });
    const tCollections = await getTranslations({ locale, namespace: 'collections.names' });

    const breadcrumbItems = [
        { label: t('home'), href: '/' },
        { label: t('collections'), href: '/collections' },
        { label: tCollections('oak'), href: '/oak' },
        { label: 'What is 3-Layer Oak Flooring?' }
    ];

    return (
        <Stack width={'100%'}>
            <OakHero />

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }} id='oak-flooring-learn-more'>
                <OakConstruction />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <OakFeatures />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <OakOilTreatment />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <OakStyles />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <OakSpecs />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <OakSustainability />
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
