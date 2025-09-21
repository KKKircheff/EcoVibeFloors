import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, Locale } from '@/i18n/routing';
import ClientThemeProvider from '@/components/providers/theme-provider';
import Navbar from '@/components/layout/navbar/Navbar.component';
import '@fontsource/zen-kaku-gothic-new/300.css';
import '@fontsource/zen-kaku-gothic-new/400.css';
import '@fontsource/zen-kaku-gothic-new/500.css';
import '@fontsource/zen-kaku-gothic-new/700.css';
import '@fontsource/poiret-one/400.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '../globals.css';
import UnderNavBar from "@/components/layout/navbar/UnderNavBar.component";


export const metadata: Metadata = {
    title: "EcoVibeFloors - Premium Dutch Flooring",
    description: "Luxury natural wood and laminate floors from the Netherlands for Bulgarian homes. Extended guarantees and exceptional quality.",
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

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
            <body>
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