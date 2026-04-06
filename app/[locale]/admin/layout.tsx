import type { Metadata } from 'next';
import { AdminAuthProvider } from '@/components/admin/layout/AdminAuthProvider';

export const metadata: Metadata = {
    title: 'Admin — EcoVibe Floors',
    robots: { index: false, follow: false },
};

// Nested under [locale] layout — inherits html/body, i18n provider, and theme.
// Wraps admin pages with AdminAuthProvider for auth context.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthProvider>
            {children}
        </AdminAuthProvider>
    );
}
