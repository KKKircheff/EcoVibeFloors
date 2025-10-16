import 'server-only';
import { notFound } from 'next/navigation';
import { Stack, Typography, Grid, Chip, Divider } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import ProductImageGallery from '@/components/products/product-image-gallery/ProductImageGallery.component';
import ProductActions from '@/components/products/product-actions/ProductActions.component';
import { ProductSpecs, SpecCategory } from '@/components/ui/sections/product/ProductSpecs';
import { isValidPattern } from '@/types/products';
import { getProductBySlug, getProductsByCollection } from '@/utils/products';
import { routing } from '@/i18n/routing';
import { Messages } from '@/global';
import { getStorageUrl } from '@/lib/utils/getStorageUrl';

// Force static generation
export const dynamic = 'error';

interface ProductDetailPageProps {
    params: Promise<{
        locale: string;
        pattern: string;
        slug: string;
    }>;
}

// Generate static params for all glue-down-vinyl products
export async function generateStaticParams() {
    const products = getProductsByCollection('glue-down-vinyl');

    const params = [];
    for (const product of products) {
        for (const locale of routing.locales) {
            params.push({
                locale,
                pattern: product.pattern,
                slug: product.slug,
            });
        }
    }

    return params;
}

// Generate metadata for SEO using product data
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
    const { slug, locale } = await params;

    const product = getProductBySlug('glue-down-vinyl', slug);

    if (!product) {
        return {};
    }

    const localizedContent = product.i18n[locale as keyof typeof product.i18n];

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

export default async function GlueDownVinylProductPage({ params }: ProductDetailPageProps) {
    const { pattern, slug, locale } = await params;

    setRequestLocale(locale);

    if (!isValidPattern(pattern)) {
        notFound();
    }

    const product = getProductBySlug('glue-down-vinyl', slug);

    if (!product || product.pattern !== pattern) {
        notFound();
    }

    const tPatterns = await getTranslations('patterns');
    const tInstallation = await getTranslations('installationSystems');
    const tProducts = await getTranslations('products');
    const tBreadcrumb = await getTranslations('breadcrumb');
    const tNavigation = await getTranslations('navigation');

    const localizedContent = product.i18n[locale as keyof typeof product.i18n];

    const patternKey = product.pattern as keyof Messages['patterns'];
    const installationKey = product.installationSystem as keyof Messages['installationSystems'];

    const patternName = tPatterns(patternKey);
    const installationSystemName = tInstallation(installationKey);

    const breadcrumbItems = [
        { label: tBreadcrumb('home'), href: '/' },
        { label: tBreadcrumb('collections'), href: '/collections' },
        { label: tNavigation('Glue-Down_Vinyl'), href: '/glue-down-vinyl' },
        { label: patternName, href: `/glue-down-vinyl/${pattern}` },
        { label: localizedContent.name },
    ];

    // Generate image URLs
    const imageUrls = product.images.map((image) =>
        getStorageUrl(product.collection, product.pattern, product.sku, image).full
    );

    const dimensions = localizedContent.specifications?.dimensions;
    const specs = localizedContent.specifications;

    // Build spec categories for ProductSpecs component
    const specCategories: SpecCategory[] = [];

    // Technical specifications
    if (specs?.performance || specs?.installation) {
        const technicalSpecs: { label: string; value: string }[] = [];

        if (dimensions?.thickness) {
            technicalSpecs.push({
                label: tProducts('thickness'),
                value: dimensions.thickness
            });
        }
        if (specs.performance?.thermalResistance) {
            technicalSpecs.push({
                label: tProducts('thermalResistance'),
                value: specs.performance.thermalResistance
            });
        }
        if (specs.installation?.clickSystem) {
            technicalSpecs.push({
                label: tProducts('clickSystem'),
                value: specs.installation.clickSystem
            });
        }

        if (technicalSpecs.length > 0) {
            specCategories.push({
                titleKey: 'technicalSpecifications',
                specs: technicalSpecs
            });
        }
    }

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
        if (specs.appearance.structure) {
            appearanceSpecs.push({ label: tProducts('structure'), value: specs.appearance.structure });
        }
        if (specs.installation?.vGroove) {
            appearanceSpecs.push({ label: tProducts('vGroove'), value: specs.installation.vGroove });
        }

        if (appearanceSpecs.length > 0) {
            specCategories.push({
                titleKey: 'appearance',
                specs: appearanceSpecs
            });
        }
    }

    // Performance & Certifications
    if (specs?.performance || specs?.certifications) {
        const performanceSpecs: { label: string; value: string }[] = [];

        if (specs.performance?.waterResistance) {
            performanceSpecs.push({
                label: tProducts('waterResistance'),
                value: specs.performance.waterResistance
            });
        }
        if (specs.performance?.underfloorHeating) {
            performanceSpecs.push({
                label: tProducts('underfloorHeating'),
                value: specs.performance.underfloorHeating
            });
        }
        if (specs.certifications?.warranty) {
            performanceSpecs.push({
                label: tProducts('warranty'),
                value: specs.certifications.warranty
            });
        }
        if (specs.certifications?.qualityMark) {
            performanceSpecs.push({
                label: tProducts('certifications'),
                value: specs.certifications.qualityMark
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

                                {/* <Stack direction="row" spacing={1} flexWrap="wrap">
                                    <Chip label={patternName} color="secondary" size="small" />
                                    <Chip label={installationSystemName} color="secondary" variant="outlined" size="small" />
                                </Stack> */}
                            </Stack>

                            <Divider />

                            {/* Dimensions */}
                            {dimensions && (
                                <Stack spacing={1.5}>
                                    {/* <Typography variant="h6" fontWeight={500} color="text.primary">
                                        {tProducts('dimensions')}
                                    </Typography> */}
                                    <Stack spacing={0.5}>
                                        {dimensions.length && (
                                            <Typography variant="body1" color="info.400">
                                                <strong>{tProducts('length')}:</strong> {dimensions.length}
                                            </Typography>
                                        )}
                                        {dimensions.width && (
                                            <Typography variant="body1" color="info.400">
                                                <strong>{tProducts('width')}:</strong> {dimensions.width}
                                            </Typography>
                                        )}
                                        {dimensions.thickness && (
                                            <Typography variant="body1" color="info.400">
                                                <strong>{tProducts('thickness')}:</strong> {dimensions.thickness}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Stack>
                            )}

                            <Divider />

                            {/* Description */}
                            {localizedContent.description && (
                                <Typography variant="body1" color="info.400">
                                    {localizedContent.description}
                                </Typography>
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
                                        {localizedContent.features.slice(0, 5).map((feature, index) => (
                                            <Typography key={index} variant="body1" color="info.400">
                                                • {feature}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}

                            {/* Product Codes */}
                            {/* <Stack spacing={1}>
                                <Typography variant="body2" color="info.400">
                                    <strong>SKU:</strong> {product.sku}
                                </Typography>
                                {product.gtin && (
                                    <Typography variant="body2" color="info.400">
                                        <strong>GTIN:</strong> {product.gtin}
                                    </Typography>
                                )}
                            </Stack> */}

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

            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
