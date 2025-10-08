import 'server-only';
import { notFound } from 'next/navigation';
import { Stack, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import { isValidCollection, isValidPattern, CollectionType, ProductPattern } from '@/types/products';
import { getProductsByCollectionAndPattern } from '@/utils/products';
import { routing } from '@/i18n/routing';
import { Messages } from '@/global';
import { ProductGrid } from '@/components/ui/product/ProductGrid';

// Force static generation
export const dynamic = 'error';

interface PatternPageProps {
    params: Promise<{
        locale: string;
        collection: string;
        pattern: string;
    }>;
}

// Generate static params for all collection/pattern combinations
export async function generateStaticParams() {
    const collections: CollectionType[] = ['hybrid-wood'];
    const patterns: ProductPattern[] = ['plank', 'fishbone'];

    const params = [];
    for (const collection of collections) {
        for (const pattern of patterns) {
            for (const locale of routing.locales) {
                params.push({
                    locale,
                    collection,
                    pattern,
                });
            }
        }
    }

    return params;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PatternPageProps): Promise<Metadata> {
    const { collection, pattern, locale } = await params;

    if (!isValidCollection(collection) || !isValidPattern(pattern)) {
        return {};
    }

    const tCollections = await getTranslations({ locale, namespace: 'collections.names' });
    const tPatterns = await getTranslations({ locale, namespace: 'patterns' });
    const tCollectionDetails = await getTranslations({ locale, namespace: `collections.${collection}` });

    const collectionKey = collection as keyof Messages['collections']['names'];
    const patternKey = pattern as keyof Messages['patterns'];

    const collectionName = tCollections(collectionKey);
    const patternName = tPatterns(patternKey);

    return {
        title: `${collectionName} - ${patternName} | Eco Vibe Floors`,
        description: tCollectionDetails('description' as keyof Messages['collections'][typeof collection], {
            defaultValue: `Browse our ${collectionName} collection in ${patternName} pattern.`
        }),
    };
}

export default async function PatternPage({ params }: PatternPageProps) {
    const { collection, pattern, locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    if (!isValidCollection(collection) || !isValidPattern(pattern)) {
        notFound();
    }

    const tCollections = await getTranslations('collections.names');
    const tPatterns = await getTranslations('patterns');
    const tProducts = await getTranslations('products');

    const products = getProductsByCollectionAndPattern(
        collection as CollectionType,
        pattern as ProductPattern
    );

    const collectionKey = collection as keyof Messages['collections']['names'];
    const patternKey = pattern as keyof Messages['patterns'];

    const collectionName = tCollections(collectionKey);
    const patternName = tPatterns(patternKey);

    return (
        <Stack>
            {/* Hero Section */}
            <PageLayoutContainer bgcolor="primary.main" py={{ xs: 8, md: 12 }}>
                <Stack spacing={2} alignItems="center" textAlign="center">
                    <Typography variant="h1" color="primary.contrastText">
                        {collectionName} - {patternName}
                    </Typography>
                    <Typography variant="h5" color="primary.contrastText">
                        {products.length} {products.length === 1 ? 'product' : 'products'}
                    </Typography>
                </Stack>
            </PageLayoutContainer>

            {/* Products Grid */}
            <PageLayoutContainer bgcolor="background.paper" py={{ xs: 6, md: 10 }}>
                <ProductGrid
                    products={products}
                    emptyMessage={tProducts('noProductsFound')}
                />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor="info.800">
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
