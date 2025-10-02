import 'server-only';
import { notFound } from 'next/navigation';
import { Stack, Typography, Grid, Chip, Divider } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import { isValidCollection, isValidPattern, CollectionType, ProductPattern } from '@/types/products';
import { getProductBySlug, getProductsByCollection } from '@/utils/products';
import { routing } from '@/i18n/routing';
import { Messages } from '@/global';

// Force static generation
export const dynamic = 'error';

interface ProductDetailPageProps {
    params: Promise<{
        locale: string;
        collection: string;
        pattern: string;
        slug: string;
    }>;
}

// Generate static params for all products
export async function generateStaticParams() {
    const collections: CollectionType[] = ['hybrid-wood'];

    const params = [];
    for (const collection of collections) {
        const products = getProductsByCollection(collection);

        for (const product of products) {
            for (const locale of routing.locales) {
                params.push({
                    locale,
                    collection: product.collection,
                    pattern: product.pattern,
                    slug: product.slug,
                });
            }
        }
    }

    return params;
}

// Generate metadata for SEO using product data
export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
    const { collection, slug, locale } = await params;

    if (!isValidCollection(collection)) {
        return {};
    }

    const product = getProductBySlug(collection as CollectionType, slug);

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

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { collection, pattern, slug, locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    // Validate collection and pattern
    if (!isValidCollection(collection) || !isValidPattern(pattern)) {
        notFound();
    }

    // Get product by slug
    const product = getProductBySlug(collection as CollectionType, slug);

    if (!product || product.pattern !== pattern) {
        notFound();
    }

    const tPatterns = await getTranslations('patterns');
    const tInstallation = await getTranslations('installationSystems');
    const tProducts = await getTranslations('products');

    const localizedContent = product.i18n[locale as keyof typeof product.i18n];

    // Get Firebase Storage base URL from env
    const baseImageUrl = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_URL || '';
    const imagePath = `${baseImageUrl}/products/${product.collection}/${product.pattern}/${product.sku}/full`;

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
                    <Stack direction="row" spacing={1}>
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
                            {product.images.slice(0, 3).map((image, index) => (
                                <img
                                    key={index}
                                    src={`${imagePath}/${image}`}
                                    alt={product.imageAlt[locale as keyof typeof product.imageAlt]}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        borderRadius: '8px',
                                    }}
                                />
                            ))}
                        </Stack>
                    </Grid>

                    {/* Product Info */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={3}>
                            <Typography variant="h4" color="primary.main">
                                €{product.price.toFixed(2)}
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
                            {localizedContent.specifications && (
                                <Stack spacing={2}>
                                    <Typography variant="h5">{tProducts('specifications')}</Typography>
                                    {/* Add specifications rendering here based on your needs */}
                                    <Typography variant="body2" color="text.secondary">
                                        SKU: {product.sku}
                                    </Typography>
                                </Stack>
                            )}
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
