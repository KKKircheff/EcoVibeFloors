import 'server-only';
import { notFound } from 'next/navigation';
import { Stack, Typography, Grid, Chip, Divider, Box } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import ProductImageGallery from '@/components/products/product-image-gallery/ProductImageGallery.component';
import ProductActions from '@/components/products/product-actions/ProductActions.component';
import { isValidPattern, ProductPattern } from '@/types/products';
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

    // Enable static rendering
    setRequestLocale(locale);

    // Validate pattern
    if (!isValidPattern(pattern)) {
        notFound();
    }

    // Get product by slug from hybrid-wood collection
    const product = getProductBySlug('hybrid-wood', slug);

    if (!product || product.pattern !== pattern) {
        notFound();
    }

    const tPatterns = await getTranslations('patterns');
    const tInstallation = await getTranslations('installationSystems');
    const tProducts = await getTranslations('products');

    const localizedContent = product.i18n[locale as keyof typeof product.i18n];

    const patternKey = product.pattern as keyof Messages['patterns'];
    const installationKey = product.installationSystem as keyof Messages['installationSystems'];

    const patternName = tPatterns(patternKey);
    const installationSystemName = tInstallation(installationKey);

    // Generate image URLs
    const imageUrls = product.images.map((image) =>
        getStorageUrl(product.collection, product.pattern, product.sku, image).full
    );

    // Get dimensions from specifications
    const dimensions = localizedContent.specifications?.dimensions;

    return (
        <Stack>
            {/* Product Details */}
            <PageLayoutContainer bgcolor="background.paper" py={{ xs: 4, md: 8 }}>
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

                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    <Chip label={patternName} color="secondary" size="small" />
                                    <Chip label={installationSystemName} color="secondary" variant="outlined" size="small" />
                                </Stack>
                            </Stack>

                            <Divider />

                            {/* Dimensions */}
                            {dimensions && (
                                <Stack spacing={1.5}>
                                    <Typography variant="h6" color="text.primary">
                                        {tProducts('dimensions')}
                                    </Typography>
                                    <Stack spacing={0.5}>
                                        {dimensions.width && (
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{tProducts('width')}:</strong> {dimensions.width}
                                            </Typography>
                                        )}
                                        {dimensions.length && (
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{tProducts('length')}:</strong> {dimensions.length}
                                            </Typography>
                                        )}
                                        {dimensions.thickness && (
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>{tProducts('thickness')}:</strong> {dimensions.thickness}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Stack>
                            )}

                            <Divider />

                            {/* Description */}
                            {localizedContent.description && (
                                <Typography variant="body1" color="text.secondary">
                                    {localizedContent.description}
                                </Typography>
                            )}

                            {/* Action Buttons */}
                            <ProductActions
                                orderSamplesText={tProducts('orderSamples')}
                                contactUsText={tProducts('contactUs')}
                            />

                            <Divider />

                            {/* Features */}
                            {localizedContent.features && localizedContent.features.length > 0 && (
                                <Stack spacing={2}>
                                    <Typography variant="h6">{tProducts('keyFeatures')}</Typography>
                                    <Stack spacing={1}>
                                        {localizedContent.features.slice(0, 5).map((feature, index) => (
                                            <Typography key={index} variant="body2" color="text.secondary">
                                                • {feature}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}

                            {/* Specifications */}
                            <Stack spacing={1}>
                                <Typography variant="h6">{tProducts('specifications')}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>SKU:</strong> {product.sku}
                                </Typography>
                                {product.gtin && (
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>GTIN:</strong> {product.gtin}
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
