import 'server-only';
import { notFound } from 'next/navigation';
import { Stack, Typography, Grid, Chip, Divider, Box } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import { PrimaryActionButton } from '@/components/ui/buttons/PrimaryActionButton.component';
import { getAllTreatments, getTreatmentBySlug } from '@/utils/treatments';
import { routing } from '@/i18n/routing';
import { Messages } from '@/global';
import { useRouter } from '@/i18n/navigation';
import { borderRadius } from '@/lib/styles/borderRadius';

// Force static generation
export const dynamic = 'error';

interface TreatmentDetailPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

// Generate static params for all treatments
export async function generateStaticParams() {
    const treatments = getAllTreatments();

    const params = [];
    for (const treatment of treatments) {
        for (const locale of routing.locales) {
            params.push({
                locale,
                slug: treatment.slug,
            });
        }
    }

    return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: TreatmentDetailPageProps): Promise<Metadata> {
    const { slug, locale } = await params;

    const treatment = getTreatmentBySlug(slug);

    if (!treatment) {
        return {};
    }

    const localizedContent = treatment.i18n[locale as keyof typeof treatment.i18n];

    if (!localizedContent?.seo) {
        return {
            title: localizedContent.name,
            description: localizedContent.description,
        };
    }

    const keywords = Array.isArray(localizedContent.seo.keywords)
        ? localizedContent.seo.keywords.join(', ')
        : localizedContent.seo.keywords;

    return {
        title: localizedContent.seo.title,
        description: localizedContent.seo.description,
        keywords,
        openGraph: {
            title: localizedContent.seo.title,
            description: localizedContent.seo.description,
            type: 'website',
        },
    };
}

export default async function TreatmentDetailPage({ params }: TreatmentDetailPageProps) {
    const { slug, locale } = await params;

    setRequestLocale(locale);

    const treatment = getTreatmentBySlug(slug);

    if (!treatment) {
        notFound();
    }

    const t = await getTranslations({ locale, namespace: 'oakTreatments' });
    const tBreadcrumb = await getTranslations({ locale, namespace: 'breadcrumb' });

    const localizedContent = treatment.i18n[locale as keyof typeof treatment.i18n];

    const breadcrumbItems = [
        { label: tBreadcrumb('home'), href: '/' },
        { label: tBreadcrumb('collections'), href: '/collections' },
        { label: t('oakCollection'), href: '/oak' },
        { label: t('pageTitle'), href: '/oak/treatments' },
        { label: localizedContent.name },
    ];

    const imageUrl = treatment.images[0];

    // Map category to translated label
    const categoryKey = `categories.${treatment.category}` as keyof Messages['oakTreatments'];

    return (
        <Stack>
            {/* Treatment Details */}
            <PageLayoutContainer bgcolor="background.paper" py={{ xs: 4, md: 8 }}>
                <Breadcrumb items={breadcrumbItems} />
                <Grid container spacing={{ xs: 4, md: 12 }}>
                    {/* Treatment Image */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                paddingBottom: '100%', // 1:1 aspect ratio
                                borderRadius: borderRadius.lg,
                                overflow: 'hidden',
                                backgroundColor: 'grey.100',
                            }}
                        >
                            <Image
                                src={imageUrl}
                                alt={treatment.imageAlt[locale as keyof typeof treatment.imageAlt]}
                                fill
                                priority
                                sizes="(max-width: 900px) 100vw, 50vw"
                                style={{
                                    objectFit: 'cover',
                                }}
                            />
                        </Box>
                    </Grid>

                    {/* Treatment Info */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3}>
                            {/* Title and Category */}
                            <Stack spacing={2}>
                                <Typography variant="h3" component="h1" color="text.primary">
                                    {localizedContent.name}
                                </Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    <Chip label={t(categoryKey)} color="primary" size="medium" />
                                    <Chip
                                        label={treatment.characteristics.finishType}
                                        color="secondary"
                                        variant="outlined"
                                        size="medium"
                                    />
                                </Stack>
                            </Stack>

                            <Divider />

                            {/* Description */}
                            {localizedContent.description && (
                                <Typography variant="body1" color="text.primary">
                                    {localizedContent.description}
                                </Typography>
                            )}

                            <Divider />

                            {/* Benefits */}
                            {localizedContent.benefits && localizedContent.benefits.length > 0 && (
                                <Stack spacing={2}>
                                    <Typography variant="h6" fontWeight={500}>
                                        {t('benefits')}
                                    </Typography>
                                    <Stack spacing={1}>
                                        {localizedContent.benefits.map((benefit, index) => (
                                            <Typography key={index} variant="body1" color="info.400">
                                                • {benefit}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}

                            <Divider />

                            {/* Recommended For */}
                            {localizedContent.recommendedFor && localizedContent.recommendedFor.length > 0 && (
                                <Stack spacing={2}>
                                    <Typography variant="h6" fontWeight={500}>
                                        {t('recommendedFor')}
                                    </Typography>
                                    <Stack spacing={1}>
                                        {localizedContent.recommendedFor.map((use, index) => (
                                            <Typography key={index} variant="body1" color="info.400">
                                                • {use}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </PageLayoutContainer>

            {/* Application & Maintenance Section */}
            <PageLayoutContainer bgcolor="background.default" py={{ xs: 6, md: 10 }}>
                <Grid container spacing={{ xs: 4, md: 6 }}>
                    {/* Application */}
                    {localizedContent.application && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={2}>
                                <Typography variant="h5" fontWeight={600}>
                                    {t('application')}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {localizedContent.application}
                                </Typography>
                            </Stack>
                        </Grid>
                    )}

                    {/* Maintenance */}
                    {localizedContent.maintenance && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={2}>
                                <Typography variant="h5" fontWeight={600}>
                                    {t('maintenance')}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {localizedContent.maintenance}
                                </Typography>
                            </Stack>
                        </Grid>
                    )}
                </Grid>
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
