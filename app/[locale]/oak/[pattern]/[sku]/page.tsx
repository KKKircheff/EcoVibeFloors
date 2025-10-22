import 'server-only';
import { notFound } from 'next/navigation';
import { Stack, Typography, Box, Chip, Grid, Divider } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Image from 'next/image';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import { isValidPattern, ProductPattern, Product } from '@/types/products';
import { getProductsByCollectionAndPattern } from '@/utils/products';
import { routing } from '@/i18n/routing';
import { Messages } from '@/global';
import { TreatmentSwatchGallery } from '@/components/ui/treatment/TreatmentSwatchGallery';
import { getAllTreatments } from '@/utils/treatments';
import { getStorageUrl } from '@/lib/utils/getStorageUrl';

// Force static generation
export const dynamic = 'error';

interface ProductPageProps {
    params: Promise<{
        locale: string;
        pattern: string;
        sku: string;
    }>;
}

export async function generateStaticParams() {
    const patterns: ProductPattern[] = ['plank', 'herringbone'];
    const params = [];

    for (const pattern of patterns) {
        const products = getProductsByCollectionAndPattern('oak', pattern);
        for (const product of products) {
            for (const locale of routing.locales) {
                params.push({
                    locale,
                    pattern,
                    sku: product.slug,
                });
            }
        }
    }

    return params;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { locale, pattern, sku } = await params;

    if (!isValidPattern(pattern)) {
        return {};
    }

    const products = getProductsByCollectionAndPattern('oak', pattern as ProductPattern);
    const product = products.find(p => p.slug === sku);

    if (!product) {
        return {};
    }

    const localizedContent = product.i18n[locale as keyof typeof product.i18n];

    return {
        title: `${localizedContent.name} | ${localizedContent.seo.title}`,
        description: localizedContent.seo.description,
        keywords: Array.isArray(localizedContent.seo.keywords)
            ? localizedContent.seo.keywords.join(', ')
            : localizedContent.seo.keywords,
    };
}

export default async function OakProductPage({ params }: ProductPageProps) {
    const { pattern, sku, locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    // Validate pattern
    if (!isValidPattern(pattern)) {
        notFound();
    }

    const products = getProductsByCollectionAndPattern('oak', pattern as ProductPattern);
    const product = products.find(p => p.slug === sku);

    if (!product) {
        notFound();
    }

    const tOak = await getTranslations('oak');
    const tPatterns = await getTranslations('patterns');
    const tBreadcrumb = await getTranslations('breadcrumb');
    const tNavigation = await getTranslations('navigation');
    const tProducts = await getTranslations('products');

    const localizedContent = product.i18n[locale as keyof typeof product.i18n];
    const patternKey = pattern as keyof Messages['patterns'];

    // Generate image URLs from filenames
    const imageUrls = product.images.map((image) =>
        getStorageUrl(product.collection, product.pattern, product.sku, image).full
    );

    // Get all treatments for the gallery
    const allTreatments = getAllTreatments();

    const breadcrumbItems = [
        { label: tBreadcrumb('home'), href: '/' },
        { label: tBreadcrumb('collections'), href: '/collections' },
        { label: tNavigation('oak'), href: '/oak' },
        { label: tPatterns(patternKey), href: `/oak/${pattern}` },
        { label: localizedContent.name },
    ];

    return (
        <Stack>
            {/* Breadcrumb and Hero */}
            <PageLayoutContainer bgcolor="white" pt={{ xs: 3, md: 8 }} pb={{ xs: 4, md: 6 }}>
                <Breadcrumb items={breadcrumbItems} />

                <Grid container spacing={{ xs: 4, md: 6 }} sx={{ mt: 2 }}>
                    {/* Product Image */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box
                            sx={{
                                position: 'relative',
                                width: '100%',
                                paddingBottom: '100%',
                                overflow: 'hidden',
                                borderRadius: 2,
                                boxShadow: 3,
                            }}
                        >
                            <Image
                                src={imageUrls[0]}
                                alt={product.imageAlt[locale as keyof typeof product.imageAlt]}
                                fill
                                sizes="(max-width: 900px) 100vw, 50vw"
                                style={{ objectFit: 'cover' }}
                                priority
                            />
                        </Box>
                    </Grid>

                    {/* Product Info */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3}>
                            <Box>
                                <Typography variant="overline" color="primary">
                                    {tOak('collection')}
                                </Typography>
                                <Typography variant="h2" component="h1" fontWeight={600}>
                                    {localizedContent.name}
                                </Typography>
                            </Box>

                            <Box>
                                <Chip
                                    label={product.isFinished ? tOak('finished') : tOak('unfinished')}
                                    color={product.isFinished ? 'success' : 'primary'}
                                    sx={{ mb: 2 }}
                                />
                                <Typography variant="h6" color="primary.main" fontWeight={600}>
                                    €{product.price.toFixed(2)} / m²
                                </Typography>
                            </Box>

                            <Typography variant="body1" color="text.secondary">
                                {localizedContent.description}
                            </Typography>

                            {product.i18n[locale as keyof typeof product.i18n].finishingNote && (
                                <Box
                                    sx={{
                                        p: 2,
                                        bgcolor: 'info.50',
                                        borderRadius: 1,
                                        borderLeft: 4,
                                        borderColor: 'info.main'
                                    }}
                                >
                                    <Typography variant="body2" color="info.dark">
                                        <strong>{tOak('finishingOptions')}:</strong> {product.i18n[locale as keyof typeof product.i18n].finishingNote}
                                    </Typography>
                                </Box>
                            )}

                            {/* Features */}
                            {localizedContent.features && (
                                <Box>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {tProducts('features')}
                                    </Typography>
                                    <Stack spacing={1}>
                                        {localizedContent.features.map((feature: string, index: number) => (
                                            <Typography key={index} variant="body2" color="text.secondary">
                                                • {feature}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </PageLayoutContainer>

            {/* Specifications */}
            {localizedContent.specifications && (
                <PageLayoutContainer bgcolor="grey.50" py={{ xs: 6, md: 10 }}>
                    <Typography variant="h3" fontWeight={600} gutterBottom textAlign="center" mb={6}>
                        {tProducts('specifications')}
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Dimensions */}
                        {localizedContent.specifications.dimensions && (
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {tProducts('dimensions')}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack spacing={1.5}>
                                        {Object.entries(localizedContent.specifications.dimensions).map(([key, value]) => (
                                            <Box key={key}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {value}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </Grid>
                        )}

                        {/* Appearance */}
                        {localizedContent.specifications.appearance && (
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {tProducts('appearance')}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack spacing={1.5}>
                                        {Object.entries(localizedContent.specifications.appearance).map(([key, value]) => (
                                            <Box key={key}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {value}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </Grid>
                        )}

                        {/* Installation */}
                        {localizedContent.specifications.installation && (
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {tProducts('installation')}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack spacing={1.5}>
                                        {Object.entries(localizedContent.specifications.installation).map(([key, value]) => (
                                            <Box key={key}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {value}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </Grid>
                        )}

                        {/* Performance */}
                        {localizedContent.specifications.performance && (
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2, height: '100%' }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {tProducts('performance')}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack spacing={1.5}>
                                        {Object.entries(localizedContent.specifications.performance).map(([key, value]) => (
                                            <Box key={key}>
                                                <Typography variant="caption" color="text.secondary">
                                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {value}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </Grid>
                        )}
                    </Grid>

                    {/* Certifications */}
                    {localizedContent.specifications.certifications && (
                        <Box sx={{ mt: 4, p: 3, bgcolor: 'white', borderRadius: 2 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                {tProducts('certifications')}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={3}>
                                {Object.entries(localizedContent.specifications.certifications).map(([key, value]) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={key}>
                                        <Typography variant="caption" color="text.secondary">
                                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={500}>
                                            {value}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </PageLayoutContainer>
            )}

            {/* Treatment Options - Show only for unfinished products */}
            {!product.isFinished && product.finishingOptions?.colorTreatments && (
                <PageLayoutContainer bgcolor="background.paper" py={{ xs: 6, md: 10 }}>
                    <Typography variant="h3" fontWeight={600} gutterBottom textAlign="center" mb={2}>
                        {tOak('availableTreatments')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth="800px" mx="auto" mb={6}>
                        {tOak('treatmentsDescription')}
                    </Typography>
                    <TreatmentSwatchGallery
                        treatments={allTreatments}
                        availableSlugs={product.finishingOptions.colorTreatments}
                    />
                </PageLayoutContainer>
            )}

            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
