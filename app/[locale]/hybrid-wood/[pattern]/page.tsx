import 'server-only';
import { notFound } from 'next/navigation';
import { Stack, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import { isValidPattern, ProductPattern } from '@/types/products';
import { getProductsByCollectionAndPattern } from '@/utils/products';
import { routing } from '@/i18n/routing';
import { Messages } from '@/global';
import { ProductGrid } from '@/components/features/products/ProductGrid';

// Force static generation
export const dynamic = 'error';

interface PatternPageProps {
    params: Promise<{
        locale: string;
        pattern: string;
    }>;
}

export async function generateStaticParams() {
    const patterns: ProductPattern[] = ['plank', 'fishbone'];

    const params = [];
    for (const pattern of patterns) {
        for (const locale of routing.locales) {
            params.push({
                locale,
                pattern,
            });
        }
    }

    return params;
}

export async function generateMetadata({ params }: PatternPageProps): Promise<Metadata> {
    const { locale, pattern } = await params;

    if (!isValidPattern(pattern)) {
        return {};
    }

    const tHybrid = await getTranslations({ locale, namespace: 'hybridWood.hero' });
    const tPatterns = await getTranslations({ locale, namespace: 'patterns' });

    const patternKey = pattern as keyof Messages['patterns'];
    const patternName = tPatterns(patternKey);
    const patternDescKey = `${pattern}Description` as keyof Messages['patterns'];

    return {
        title: `${tHybrid('title')} - ${patternName} | Eco Vibe Floors`,
        description: tPatterns(patternDescKey, {
            defaultValue: `Browse our Hybrid Wood collection in ${patternName} pattern.`
        }),
    };
}

export default async function HybridWoodPatternPage({ params }: PatternPageProps) {
    const { pattern, locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    // Validate pattern
    if (!isValidPattern(pattern)) {
        notFound();
    }

    const tHybrid = await getTranslations('hybridWood.hero');
    const tPatterns = await getTranslations('patterns');
    const tProducts = await getTranslations('products');

    const products = getProductsByCollectionAndPattern('hybrid-wood', pattern as ProductPattern);

    // Firebase Storage base URL from environment
    const baseImageUrl = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_URL || '';

    const patternKey = pattern as keyof Messages['patterns'];
    const patternDescKey = `${pattern}Description` as keyof Messages['patterns'];

    return (
        <Stack>
            <PageLayoutContainer bgcolor="white" pt={{ xs: 3, md: 8 }} pb={0}>
                <Stack spacing={3} alignItems="center" textAlign="center">
                    <Typography variant="h1" fontWeight={600}>
                        {tHybrid('title')} - {tPatterns(patternKey)}
                    </Typography>
                    <Typography variant="h5" maxWidth="800px">
                        {tPatterns(patternDescKey, {
                            defaultValue: tPatterns(patternKey)
                        })}
                    </Typography>
                </Stack>
            </PageLayoutContainer>

            {/* Products Grid */}
            <PageLayoutContainer bgcolor="primary.contrastText" py={{ xs: 6, md: 10 }}>
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
