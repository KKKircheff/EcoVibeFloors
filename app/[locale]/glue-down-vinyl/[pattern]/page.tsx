import 'server-only';
import { notFound } from 'next/navigation';
import { Stack, Typography } from '@mui/material';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';
import Breadcrumb from '@/components/ui/navigation/Breadcrumb.component';
import { isValidPattern, ProductPattern } from '@/types/products';
import { getGlueDownVinylProductsByPattern } from '@/utils/products/glue-down-vinyl';
import { routing } from '@/i18n/routing';
import { Messages } from '@/global';
import { ProductGrid } from '@/components/ui/product/ProductGrid';
import { toCamelCase } from '@/lib/utils/toCamelCase';

// Force static generation
export const dynamic = 'error';

interface PatternPageProps {
    params: Promise<{
        locale: string;
        pattern: string;
    }>;
}

export async function generateStaticParams() {
    const patterns: ProductPattern[] = ['dorpen', 'hongaarse-punt', 'landhuis'];

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

    const tGlueDownVinyl = await getTranslations({ locale, namespace: 'glueDownVinyl.hero' });
    const tPatterns = await getTranslations({ locale, namespace: 'patterns' });

    const patternKey = pattern as keyof Messages['patterns'];
    const patternName = tPatterns(patternKey);
    const patternDescKey = `${toCamelCase(pattern)}Description` as keyof Messages['patterns'];

    return {
        title: `${tGlueDownVinyl('title')} - ${patternName} | Eco Vibe Floors`,
        description: tPatterns(patternDescKey, {
            defaultValue: `Browse our Glue-Down Vinyl collection in ${patternName} pattern.`
        }),
    };
}

export default async function GlueDownVinylPatternPage({ params }: PatternPageProps) {
    const { pattern, locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    // Validate pattern
    if (!isValidPattern(pattern)) {
        notFound();
    }

    const tGlueDownVinyl = await getTranslations('glueDownVinyl.hero');
    const tPatterns = await getTranslations('patterns');
    const tProducts = await getTranslations('products');
    const tBreadcrumb = await getTranslations('breadcrumb');
    const tNavigation = await getTranslations('navigation');

    const products = getGlueDownVinylProductsByPattern(pattern as ProductPattern);

    const patternKey = pattern as keyof Messages['patterns'];
    const patternDescKey = `${toCamelCase(pattern)}Description` as keyof Messages['patterns'];

    const breadcrumbItems = [
        { label: tBreadcrumb('home'), href: '/' },
        { label: tBreadcrumb('collections'), href: '/collections' },
        { label: tNavigation('Glue-Down_Vinyl'), href: '/glue-down-vinyl' },
        { label: tPatterns(patternKey) },
    ];

    return (
        <Stack>
            <PageLayoutContainer bgcolor="white" pt={{ xs: 3, md: 8 }} pb={0}>
                <Breadcrumb items={breadcrumbItems} />
                <Stack spacing={3} alignItems="center" textAlign="center">
                    <Typography variant="h1" fontWeight={600}>
                        {tGlueDownVinyl('title')} - {tPatterns(patternKey)}
                    </Typography>
                    <Typography variant="h5" maxWidth="800px">
                        {tPatterns(patternDescKey, {
                            defaultValue: tPatterns(patternKey)
                        })}
                    </Typography>
                </Stack>
            </PageLayoutContainer>

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
