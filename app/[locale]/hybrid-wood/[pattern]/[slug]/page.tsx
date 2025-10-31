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
import { AuthenticatedPrice } from '@/components/ui/price/AuthenticatedPrice';
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

// Generate static params for all hybrid-wood products
export async function generateStaticParams() {
    const products = getProductsByCollection('hybrid-wood');

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

    const product = getProductBySlug('hybrid-wood', slug);

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

export default async function HybridWoodProductPage({ params }: ProductDetailPageProps) {
    const { pattern, slug, locale } = await params;

    setRequestLocale(locale);

    if (!isValidPattern(pattern)) {
        notFound();
    }

    const product = getProductBySlug('hybrid-wood', slug);

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
        { label: tNavigation('hybridWood'), href: '/hybrid-wood' },
        { label: patternName, href: `/hybrid-wood/${pattern}` },
        { label: localizedContent.name },
    ];

    // Generate image URLs
    const imageUrls = product.images.map((image) =>
        getStorageUrl(product.collection, product.pattern, product.sku, image).full
    );

    const specs = product.specifications;
    const dimensions = specs?.dimensions;
    const localizedSpecs = localizedContent.specifications;

    // Build spec categories for ProductSpecs component
    const specCategories: SpecCategory[] = [];

    // Technical specifications
    if (specs?.performance || specs?.installation) {
        const technicalSpecs: { label: string; value: string }[] = [];

        if (dimensions?.thickness) {
            const unit = tProducts('units.mm');
            technicalSpecs.push({
                label: tProducts('thickness'),
                value: `${dimensions.thickness} ${unit}`
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
        const unit = tProducts('units.mm');
        const dimensionSpecs: { label: string; value: string }[] = [];

        if (dimensions.length) {
            dimensionSpecs.push({ label: tProducts('length'), value: `${dimensions.length} ${unit}` });
        }
        if (dimensions.width) {
            dimensionSpecs.push({ label: tProducts('width'), value: `${dimensions.width} ${unit}` });
        }
        if (dimensions.thickness) {
            dimensionSpecs.push({ label: tProducts('thickness'), value: `${dimensions.thickness} ${unit}` });
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

        if (specs.appearance.colorCode) {
            appearanceSpecs.push({
                label: tProducts('color'),
                value: tProducts(`specValues.appearance.color.${specs.appearance.colorCode}` as keyof Messages['products'])
            });
        }
        if (specs.appearance.structureCode) {
            appearanceSpecs.push({
                label: tProducts('structure'),
                value: tProducts(`specValues.appearance.structure.${specs.appearance.structureCode}` as keyof Messages['products'])
            });
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
    if (specs?.performance || specs?.certifications || localizedSpecs?.certifications) {
        const performanceSpecs: { label: string; value: string }[] = [];

        if (specs?.performance?.waterResistanceCode) {
            performanceSpecs.push({
                label: tProducts('waterResistance'),
                value: tProducts(`specValues.performance.waterResistance.${specs.performance.waterResistanceCode}` as keyof Messages['products'])
            });
        }
        if (specs?.performance?.underfloorHeatingCode) {
            performanceSpecs.push({
                label: tProducts('underfloorHeating'),
                value: tProducts(`specValues.performance.underfloorHeating.${specs.performance.underfloorHeatingCode}` as keyof Messages['products'])
            });
        }
        // Warranty stays in i18n (localized text)
        if (localizedSpecs?.certifications?.warranty) {
            performanceSpecs.push({
                label: tProducts('warranty'),
                value: localizedSpecs.certifications.warranty
            });
        }
        if (specs?.certifications?.qualityMark) {
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
                                    <AuthenticatedPrice
                                        price={product.price}
                                        variant="h4"
                                        color="primary.main"
                                        fontWeight={600}
                                    />
                                </Stack>
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
                                                <strong>{tProducts('length')}:</strong> {dimensions.length} {tProducts('units.mm')}
                                            </Typography>
                                        )}
                                        {dimensions.width && (
                                            <Typography variant="body1" color="info.400">
                                                <strong>{tProducts('width')}:</strong> {dimensions.width} {tProducts('units.mm')}
                                            </Typography>
                                        )}
                                        {dimensions.thickness && (
                                            <Typography variant="body1" color="info.400">
                                                <strong>{tProducts('thickness')}:</strong> {dimensions.thickness} {tProducts('units.mm')}
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
