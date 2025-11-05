import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, Locale } from '@/i18n/routing';
import ClientThemeProvider from '@/components/providers/theme-provider';
import Navbar from '@/components/layout/navbar/Navbar.component';
import '../globals.css';
import UnderNavBar from "@/components/layout/navbar/UnderNavBar.component";
import { SampleBasketProvider } from '@/lib/contexts/SampleBasketContext';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: 'home' });

    const ogImageUrl = 'https://ecovibefloors.com/images/OG.webp';
    const homeUrl = `https://ecovibefloors.com/${locale}`;

    return {
        title: t('metadata.title'),
        description: t('metadata.description'),
        openGraph: {
            title: t('metadata.title'),
            description: t('metadata.description'),
            type: 'website',
            url: homeUrl,
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

export default async function LocaleLayout(props: Props) {
    const params = await props.params;
    const { locale: localeParam } = params;

    // Type-safe locale with runtime validation
    const locale = localeParam as Locale;

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Providing all messages to the client
    const messages = await getMessages();

    const { children } = props;

    return (
        <html lang={locale}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
                <style dangerouslySetInnerHTML={{
                    __html: `
                        body { margin: 0; font-family: 'Zen Kaku Gothic New', 'Montserrat', system-ui, sans-serif; }
                        * { box-sizing: border-box; }
                        /* Prevent layout shift */
                        img { max-width: 100%; height: auto; }
                    `
                }} />
            </head>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ClientThemeProvider>
                        <ToastProvider>
                            <AuthProvider>
                                <SampleBasketProvider>
                                    <Navbar locale={locale} />
                                    <UnderNavBar />
                                    {children}
                                </SampleBasketProvider>
                            </AuthProvider>
                        </ToastProvider>
                    </ClientThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}