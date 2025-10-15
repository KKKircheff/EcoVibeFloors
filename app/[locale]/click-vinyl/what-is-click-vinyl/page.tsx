import 'server-only';
import { Stack } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';

import { WhatIsClickVinylHero } from './WhatIsClickVinylHero.section';
import { Introduction } from '../(sections)/Introduction.section';
import { ClickTechnology } from '../(sections)/ClickTechnology.section';
import { Features } from '../(sections)/Features.section';
import { Collections } from '../(sections)/Collections.section';
import { Installation } from '../(sections)/Installation.section';
import { ClickVinylCTA } from '../(sections)/ClickVinylCTA.section';
import Footer from '@/components/layout/footer/Footer.component';
import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';

// Force static generation
export const dynamic = 'error';

interface WhatIsClickVinylPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function WhatIsClickVinylPage({ params }: WhatIsClickVinylPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <Stack width={'100%'}>
            <WhatIsClickVinylHero />

            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <Introduction />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <ClickTechnology />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='info.600' py={{ xs: 6, md: 10 }}>
                <Features />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <Collections />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <Installation />
            </PageLayoutContainer>

            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 6, md: 10 }}>
                <ClickVinylCTA />
            </PageLayoutContainer>

            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}
