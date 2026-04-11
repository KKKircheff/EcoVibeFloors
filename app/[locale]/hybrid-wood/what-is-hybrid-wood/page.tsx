import 'server-only';
import { Stack } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import { buildAlternates } from '@/lib/seo';
import { WhatIsHybridWoodHero } from './WhatIsHybridWoodHero.section';
import { Introduction } from '../(sections)/Introduction.section';
import { KeyInnovation } from '../(sections)/KeyInnovation.section';
import { Features } from '../(sections)/Features.section';
import { Sustainability } from '../(sections)/Sustainability.section';
import { Installation } from '../(sections)/Installation.section';
import { Maintenance } from '../(sections)/Maintenance.section';
import Footer from '@/components/organisms/footer/Footer';
import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import { HybridWoodCTA } from '../(sections)/HybridWoodCTA.section';

// Force static generation
export const dynamic = 'error';

interface WhatIsHybridWoodPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: WhatIsHybridWoodPageProps): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: buildAlternates(locale, '/hybrid-wood/what-is-hybrid-wood') };
}

export default async function WhatIsHybridWoodPage({ params }: WhatIsHybridWoodPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <Stack width={'100%'}>
            <WhatIsHybridWoodHero />

            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <Introduction />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <KeyInnovation />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='info.600' py={{ xs: 6, md: 10 }}>
                <Features />
            </PageLayoutContainer>

            <PageLayoutContainer
                bgcolor='grey.50'
                py={{ xs: 6, md: 10 }}
                sx={{
                    backgroundImage: 'url(/images/tree-bg-1.webp)',
                    backgroundSize: 'auto',
                    backgroundPosition: 'left center',
                    backgroundRepeat: 'repeat-y',
                }}
            >
                <Sustainability />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <Installation />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <Maintenance />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 6, md: 10 }}>
                <HybridWoodCTA />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
