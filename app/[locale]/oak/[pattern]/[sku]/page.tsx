import 'server-only';
import { notFound } from 'next/navigation';
import { Stack, Typography, Box, Chip, Grid, Divider } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import ProductImageGallery from '@/components/products/product-image-gallery/ProductImageGallery.component';
import ProductActions from '@/components/products/product-actions/ProductActions.component';
import { ProductSpecs, SpecCategory } from '@/components/ui/sections/product/ProductSpecs';
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

    // Build spec categories for ProductSpecs component
    const specs = localizedContent.specifications;
    const dimensions = specs?.dimensions;
    const specCategories: SpecCategory[] = [];

    // Dimensions
    if (dimensions) {
        const dimensionSpecs: { label: string; value: string }[] = [];
        if (dimensions.length) {
            dimensionSpecs.push({ label: tProducts('length'), value: dimensions.length });
        }
        if (dimensions.width) {
            dimensionSpecs.push({ label: tProducts('width'), value: dimensions.width });
        }
        if (dimensions.thickness) {
            dimensionSpecs.push({ label: tProducts('thickness'), value: dimensions.thickness });
        }
        if (dimensionSpecs.length > 0) {
            specCategories.push({
                titleKey: 'dimensions',
                specs: dimensionSpecs
            });
        }
    }

    // Appearance
    if (specs?.appearance) {
        const appearanceSpecs: { label: string; value: string }[] = [];
        if (specs.appearance.color) {
            appearanceSpecs.push({ label: tProducts('color'), value: specs.appearance.color });
        }
        if (specs.appearance.grade) {
            appearanceSpecs.push({ label: tProducts('grade'), value: specs.appearance.grade });
        }
        if (specs.appearance.finish) {
            appearanceSpecs.push({ label: tProducts('finish'), value: specs.appearance.finish });
        }
        if (appearanceSpecs.length > 0) {
            specCategories.push({
                titleKey: 'appearance',
                specs: appearanceSpecs
            });
        }
    }

    // Installation
    if (specs?.installation) {
        const installationSpecs: { label: string; value: string }[] = [];
        if (specs.installation.method) {
            installationSpecs.push({ label: tProducts('installationMethod'), value: specs.installation.method });
        }
        if (specs.installation.vGroove) {
            installationSpecs.push({ label: tProducts('vGroove'), value: specs.installation.vGroove });
        }
        if (specs.installation.coveragePerPack) {
            installationSpecs.push({ label: tProducts('coveragePerPack'), value: specs.installation.coveragePerPack });
        }
        if (installationSpecs.length > 0) {
            specCategories.push({
                titleKey: 'installation',
                specs: installationSpecs
            });
        }
    }

    // Performance & Certifications
    if (specs?.performance || specs?.certifications) {
        const performanceSpecs: { label: string; value: string }[] = [];
        if (specs.performance?.underfloorHeating) {
            performanceSpecs.push({
                label: tProducts('underfloorHeating'),
                value: specs.performance.underfloorHeating
            });
        }
        if (specs.performance?.thermalResistance) {
            performanceSpecs.push({
                label: tProducts('thermalResistance'),
                value: specs.performance.thermalResistance
            });
        }
        if (specs.certifications?.warranty) {
            performanceSpecs.push({
                label: tProducts('warranty'),
                value: specs.certifications.warranty
            });
        }
        if (specs.certifications?.countryOfProduction) {
            performanceSpecs.push({
                label: tProducts('countryOfProduction'),
                value: specs.certifications.countryOfProduction
            });
        }
        if (performanceSpecs.length > 0) {
            specCategories.push({
                titleKey: 'performanceQuality',
                specs: performanceSpecs
            });
        }
    }

    return (
        <Stack>
            {/* Product Details */}
            <PageLayoutContainer bgcolor="background.paper" py={{ xs: 4, md: 8 }}>
                <Breadcrumb items={breadcrumbItems} />
                <Grid container spacing={{ xs: 4, md: 12 }}>
                    {/* Product Images */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <ProductImageGallery
                            images={imageUrls}
                            productName={localizedContent.name}
                        />
                    </Grid>

                    {/* Product Info */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3}>
                            {/* Title and Price Row */}
                            <Stack spacing={2}>
                                <Stack
                                    direction={{ xs: 'column', sm: 'row' }}
                                    spacing={{ xs: 1, sm: 2 }}
                                    alignItems={{ xs: 'flex-start', sm: 'baseline' }}
                                    justifyContent="space-between"
                                >
                                    <Typography variant="h3" component="h1" color="text.primary">
                                        {localizedContent.name}
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color="primary.main"
                                        sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                                    >
                                        €{product.price.toFixed(2)}
                                    </Typography>
                                </Stack>

                                <Chip
                                    label={product.isFinished ? tOak('finished') : tOak('unfinished')}
                                    color={product.isFinished ? 'success' : 'primary'}
                                    size="small"
                                />
                            </Stack>

                            <Divider />

                            {/* Description */}
                            {localizedContent.description && (
                                <Typography variant="body1" color="info.400">
                                    {localizedContent.description}
                                </Typography>
                            )}

                            {/* Finishing Note */}
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

                            {/* Action Buttons */}
                            <ProductActions
                                product={{
                                    sku: product.sku,
                                    productName: localizedContent.name,
                                    collection: product.collection,
                                    pattern: product.pattern,
                                    price: product.price,
                                    imageUrl: imageUrls[0],
                                }}
                                addToBasketText={tProducts('addToBasket')}
                                orderSamplesText={tProducts('orderSamples')}
                            />

                            <Divider />

                            {/* Features */}
                            {localizedContent.features && localizedContent.features.length > 0 && (
                                <Stack spacing={2}>
                                    <Typography variant="h6" fontWeight={500}>{tProducts('keyFeatures')}</Typography>
                                    <Stack spacing={1}>
                                        {localizedContent.features.slice(0, 5).map((feature: string, index: number) => (
                                            <Typography key={index} variant="body1" color="info.400">
                                                • {feature}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </PageLayoutContainer>

            {/* Product Specifications Section */}
            {specCategories.length > 0 && (
                <PageLayoutContainer bgcolor="background.default" py={{ xs: 3, md: 6 }}>
                    <Stack spacing={4}>
                        <ProductSpecs
                            translationKey="products"
                            specCategories={specCategories}
                        />
                    </Stack>
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
