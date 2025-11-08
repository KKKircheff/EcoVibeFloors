import 'server-only';
import dynamicImport from 'next/dynamic';
import { Suspense } from 'react';
import { alpha, Stack, Box, Skeleton } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';

import { HomeHero } from './home/HomeHero.section';
import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import { palette } from '@/lib/styles/pallete';

const HomeFeatures = dynamicImport(() => import('./home/HomeFeatures.section').then(mod => ({ default: mod.HomeFeatures })));
const QuotesSection = dynamicImport(() => import('./home/Quotes.section'));
const HomecardsSection = dynamicImport(() => import('./home/Homecards.section'));
const HomeFAQ = dynamicImport(() => import('./home/HomeFAQ.section').then(mod => ({ default: mod.HomeFAQ })));
const Footer = dynamicImport(() => import('@/components/layout/footer/Footer.component'));

// Force static generation
export const dynamic = 'error';

interface HomePageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    const bgcolor = alpha(palette.info[50], .4)
    return (
        <Stack width={'100%'}>
            <HomeHero />

            <Suspense fallback={
                <PageLayoutContainer pb={{ xs: 8, md: 20 }} pt={{ xs: 6, md: 20 }} width='100%' bgcolor={bgcolor}>
                    <Box sx={{ py: 4 }}>
                        <Skeleton variant="rectangular" height={200} sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" height={200} />
                    </Box>
                </PageLayoutContainer>
            }>
                <PageLayoutContainer pb={{ xs: 8, md: 20 }} pt={{ xs: 6, md: 20 }} width='100%' bgcolor={bgcolor} >
                    <HomeFeatures />
                </PageLayoutContainer>
            </Suspense>

            <Suspense fallback={
                <PageLayoutContainer py={{ xs: 4, md: 6 }}>
                    <Box sx={{ py: 4 }}>
                        <Skeleton variant="rectangular" height={300} sx={{ mb: 2 }} />
                        <Skeleton variant="rectangular" height={400} />
                    </Box>
                </PageLayoutContainer>
            }>
                <PageLayoutContainer
                    py={{ xs: 4, md: 6 }}
                    sx={{
                        backgroundImage: 'url(/images/tree-bg-1.webp)',
                        backgroundSize: 'auto',
                        backgroundPosition: 'left center',
                        backgroundRepeat: 'repeat-y',
                    }}
                >
                    <QuotesSection />
                    <HomecardsSection />
                </PageLayoutContainer>
            </Suspense>

            <Suspense fallback={
                <PageLayoutContainer py={{ xs: 8, md: 12 }}>
                    <Box sx={{ py: 4 }}>
                        <Skeleton variant="rectangular" height={60} sx={{ mb: 4 }} />
                        <Skeleton variant="rectangular" height={400} />
                    </Box>
                </PageLayoutContainer>
            }>
                <PageLayoutContainer py={{ xs: 8, md: 12 }}>
                    <HomeFAQ />
                </PageLayoutContainer>
            </Suspense>

            <Suspense fallback={
                <PageLayoutContainer pt={10} bgcolor='info.800'>
                    <Box sx={{ py: 8 }}>
                        <Skeleton variant="rectangular" height={200} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    </Box>
                </PageLayoutContainer>
            }>
                <PageLayoutContainer pt={10} bgcolor='info.800'>
                    <Footer />
                </PageLayoutContainer>
            </Suspense>

        </Stack>
    );
}
