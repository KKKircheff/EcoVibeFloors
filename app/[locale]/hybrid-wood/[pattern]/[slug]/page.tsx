import 'server-only';
import { notFound } from 'next/navigation';
import { Stack, Typography, Grid, Chip, Divider, Box } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import { isValidPattern, ProductPattern } from '@/types/products';
import { getProductBySlug, getProductsByCollection } from '@/utils/products';
import { routing } from '@/i18n/routing';
import { Messages } from '@/global';

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

    // Get Firebase Storage bucket from env
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    // Construct Firebase Storage URL with proper encoding
    const getStorageUrl = (imageName: string, size: 'thumbnail' | 'full' = 'full') => {
        const path = `products/${product.collection}/${product.pattern}/${product.sku}/${size}/${imageName}`;
        const encodedPath = encodeURIComponent(path);
        return `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodedPath}?alt=media`;
    };

    const patternKey = product.pattern as keyof Messages['patterns'];
    const installationKey = product.installationSystem as keyof Messages['installationSystems'];

    const patternName = tPatterns(patternKey);
    const installationSystemName = tInstallation(installationKey);

    return (
        <Stack>
            {/* Hero Section with Product Name */}
            <PageLayoutContainer bgcolor="primary.main" py={{ xs: 6, md: 8 }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                    <Typography variant="h1" color="primary.contrastText">
                        {localizedContent.name}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                        <Chip label={patternName} color="secondary" />
                        <Chip label={installationSystemName} color="secondary" variant="outlined" />
                    </Stack>
                </Stack>
            </PageLayoutContainer>

            {/* Product Details */}
            <PageLayoutContainer bgcolor="background.paper" py={{ xs: 6, md: 10 }}>
                <Grid container spacing={4}>
                    {/* Product Images */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                            {product.images.map((image, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '4/3',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <img
                                        src={getStorageUrl(image, 'full')}
                                        alt={`${product.imageAlt[locale as keyof typeof product.imageAlt]} - ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Product Info */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3}>
                            <Typography variant="h4" color="primary.main">
                                {tProducts('priceFrom')} €{product.price.toFixed(2)}
                            </Typography>

                            {localizedContent.description && (
                                <>
                                    <Typography variant="body1">
                                        {localizedContent.description}
                                    </Typography>
                                    <Divider />
                                </>
                            )}

                            {/* Features */}
                            {localizedContent.features && localizedContent.features.length > 0 && (
                                <Stack spacing={2}>
                                    <Typography variant="h5">{tProducts('features')}</Typography>
                                    <Stack spacing={1}>
                                        {localizedContent.features.map((feature, index) => (
                                            <Typography key={index} variant="body2">
                                                • {feature}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Stack>
                            )}

                            <Divider />

                            {/* Specifications */}
                            <Stack spacing={2}>
                                <Typography variant="h5">{tProducts('specifications')}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    SKU: {product.sku}
                                </Typography>
                                {product.gtin && (
                                    <Typography variant="body2" color="text.secondary">
                                        GTIN: {product.gtin}
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
