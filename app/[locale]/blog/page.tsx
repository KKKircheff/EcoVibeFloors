import 'server-only';
import { Stack, Typography } from '@mui/material';
import { setRequestLocale } from 'next-intl/server';

import { BlogHero } from './BlogHero.section';
import Footer from '@/components/layout/footer/Footer.component';
import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';

// Force static generation
export const dynamic = 'error';

interface BlogPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);
    return (
        <Stack>
            <BlogHero />
            <PageLayoutContainer bgcolor='primary.contrastText' pb={{ xs: 8, md: 12 }} pt={{ xs: 6, md: 12 }}>
                <Typography>BLOG</Typography>
            </PageLayoutContainer>
            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}