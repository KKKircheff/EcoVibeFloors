import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, Locale } from '@/i18n/routing';
import ClientThemeProvider from '@/components/providers/theme-provider';
import Navbar from '@/components/layout/navbar/Navbar.component';
import '../globals.css';
import UnderNavBar from "@/components/layout/navbar/UnderNavBar.component";
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
    weight: ['400', '500', '600'],
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
    preload: true,
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    const t = await getTranslations({ locale, namespace: 'metadata' });

    return {
        title: t('title'),
        description: t('description'),
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
                <style dangerouslySetInnerHTML={{
                    __html: `
                        body { margin: 0; font-family: 'Zen Kaku Gothic New', 'Montserrat', system-ui, sans-serif; }
                        * { box-sizing: border-box; }
                        /* Prevent layout shift */
                        img { max-width: 100%; height: auto; }
                    `
                }} />
            </head>
            <body className={montserrat.className}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ClientThemeProvider>
                        <Navbar locale={locale} />
                        <UnderNavBar />
                        {children}
                    </ClientThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}