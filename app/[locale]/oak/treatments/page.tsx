import 'server-only';
import { Stack, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import { TreatmentGrid } from '@/components/ui/treatment/TreatmentGrid';
import { getAllTreatments } from '@/utils/treatments';
import { routing } from '@/i18n/routing';

// Force static generation
export const dynamic = 'error';

interface TreatmentsPageProps {
    params: Promise<{
        locale: string;
    }>;
}

// Generate static params for all locales
export async function generateStaticParams() {
    const params = [];
    for (const locale of routing.locales) {
        params.push({
            locale,
        });
    }
    return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TreatmentsPageProps): Promise<Metadata> {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: 'oakTreatments' });

    return {
        title: t('pageTitle'),
        description: t('pageDescription'),
    };
}

export default async function OakTreatmentsPage({ params }: TreatmentsPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'oakTreatments' });
    const tBreadcrumb = await getTranslations({ locale, namespace: 'breadcrumb' });

    const treatments = getAllTreatments();

    const breadcrumbItems = [
        { label: tBreadcrumb('home'), href: '/' },
        { label: tBreadcrumb('collections'), href: '/collections' },
        { label: t('oakCollection'), href: '/oak' },
        { label: t('pageTitle') },
    ];

    return (
        <Stack>
            <PageLayoutContainer bgcolor="white" pt={{ xs: 3, md: 8 }} pb={0}>
                <Breadcrumb items={breadcrumbItems} />
                <Stack spacing={3} alignItems="center" textAlign="center" py={{ xs: 4, md: 6 }}>
                    <Typography variant="h1" fontWeight={600}>
                        {t('pageTitle')}
                    </Typography>
                    <Typography variant="h5" maxWidth="800px" color="text.secondary">
                        {t('pageDescription')}
                    </Typography>
                </Stack>
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor="grey.50" py={{ xs: 6, md: 10 }}>
                <TreatmentGrid
                    treatments={treatments}
                    emptyMessage={t('noTreatmentsFound')}
                />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
