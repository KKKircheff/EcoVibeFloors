'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/organisms/navbar/Navbar';
import UnderNavBar from '@/components/organisms/navbar/UnderNavBar';
import { FloatingChatButton } from '@/components/organisms/chat/FloatingChatButton';
import { SampleBasketProvider } from '@/lib/contexts/SampleBasketContext';
import type { Locale } from '@/i18n/routing';

interface PublicChromeProps {
    locale: Locale;
    children: React.ReactNode;
}

// Renders shared chrome around pages. Admin pages get Navbar only; public pages get full chrome.
export function PublicChrome({ locale, children }: PublicChromeProps) {
    const pathname = usePathname();
    const isAdmin = pathname.includes('/admin');

    if (isAdmin) {
        return (
            <SampleBasketProvider>
                <Navbar locale={locale} />
                {children}
            </SampleBasketProvider>
        );
    }

    return (
        <SampleBasketProvider>
            <Navbar locale={locale} />
            <UnderNavBar />
            {children}
            <FloatingChatButton />
        </SampleBasketProvider>
    );
}
