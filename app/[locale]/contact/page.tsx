import 'server-only';
import { Stack } from '@mui/material';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import { ContactHero } from './ContactHero.section';
import Footer from '@/components/layout/footer/Footer.component';
import ContactForm from './ContactForm.section';

interface ContactPageProps {
    params: Promise<{
        locale: string;
    }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: 'contact' });

    const ogImageUrl = `https://ecovibefloors.com/images/OG-${locale}.webp`;
    const contactUrl = `https://ecovibefloors.com/${locale}/contact`;

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        openGraph: {
            title: t('metadata.title'),
            description: t('metadata.description'),
            type: 'website',
            url: contactUrl,
            siteName: 'EcoVibeFloors',
            locale: locale === 'bg' ? 'bg_BG' : 'en_US',
            images: [{
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: t('metadata.ogImageAlt'),
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: t('metadata.title'),
            description: t('metadata.description'),
            images: [ogImageUrl],
        },
    };
}

export default async function ContactPage({ params }: ContactPageProps) {
    return (
        <Stack>
            <ContactHero />
            <PageLayoutContainer id="contact-form" bgcolor='primary.contrastText' py={{ xs: 8, md: 12 }}>
                <ContactForm />
            </PageLayoutContainer>
            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}