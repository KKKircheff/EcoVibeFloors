import 'server-only';
import { Stack, Typography, Container, Divider } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import { routing } from '@/i18n/routing';

// Force static generation
export const dynamic = 'error';

interface PrivacyPolicyPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PrivacyPolicyPageProps): Promise<Metadata> {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: 'privacyPolicy' });

    const ogImageUrl = `https://ecovibefloors.com/images/OG-${locale}.webp`;
    const pageUrl = `https://ecovibefloors.com/${locale}/privacy-policy`;

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        openGraph: {
            title: t('metadata.title'),
            description: t('metadata.description'),
            type: 'website',
            url: pageUrl,
            siteName: 'EcoVibeFloors',
            locale: locale === 'bg' ? 'bg_BG' : 'en_US',
            images: [{
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: t('metadata.ogImageAlt'),
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('metadata.title'),
            description: t('metadata.description'),
            images: [ogImageUrl],
        },
    };
}

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const t = await getTranslations({ locale, namespace: 'privacyPolicy' });
    const tCommon = await getTranslations({ locale, namespace: 'common' });

    const breadcrumbItems = [
        { label: tCommon('home'), href: '/' },
        { label: t('title'), href: '/privacy-policy' },
    ];

    return (
        <Stack>
            <PageLayoutContainer bgcolor="grey.50">
                <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
                    <Breadcrumb items={breadcrumbItems} />

                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            fontWeight: 600,
                            color: 'primary.main',
                            mb: 2,
                            mt: 3,
                        }}
                    >
                        {t('title')}
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        {t('lastUpdated')}: {new Date().toLocaleDateString(locale === 'bg' ? 'bg-BG' : 'en-US')}
                    </Typography>

                    <Divider sx={{ mb: 4 }} />

                    <Stack spacing={4}>
                        <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8 }}>
                            {t('introduction')}
                        </Typography>

                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                fontWeight: 600,
                                color: 'primary.main',
                                mt: 4,
                            }}
                        >
                            {t('section1.title')}
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8 }}>
                            {t('section1.content')}
                        </Typography>

                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                fontWeight: 600,
                                color: 'primary.main',
                                mt: 4,
                            }}
                        >
                            {t('section2.title')}
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8 }}>
                            {t('section2.content')}
                        </Typography>

                        <Typography
                            variant="h2"
                            sx={{
                                fontSize: { xs: '1.5rem', md: '2rem' },
                                fontWeight: 600,
                                color: 'primary.main',
                                mt: 4,
                            }}
                        >
                            {t('section3.title')}
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.8 }}>
                            {t('section3.content')}
                        </Typography>
                    </Stack>
                </Container>
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
