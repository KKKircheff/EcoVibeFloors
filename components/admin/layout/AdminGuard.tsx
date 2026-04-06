'use client';

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAdminAuth } from './AdminAuthProvider';
import { isAdmin } from '@/lib/firebase/auth';

interface AdminGuardProps {
    children: React.ReactNode;
}

// Protects admin routes: checks Firebase auth + Firestore role === 'admin'.
// Redirects to /admin/login if not authenticated or not an admin.
export function AdminGuard({ children }: AdminGuardProps) {
    const { user, loading } = useAdminAuth();
    const router = useRouter();
    const t = useTranslations('admin');
    const [adminChecked, setAdminChecked] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.push('/admin/login');
            return;
        }

        // Verify Firestore role — this is the actual access gate
        isAdmin().then((adminStatus) => {
            if (!adminStatus) {
                router.push('/admin/login?error=unauthorized');
            } else {
                setIsAuthorized(true);
            }
            setAdminChecked(true);
        });
    }, [user, loading]);

    if (loading || !adminChecked) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthorized) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
                <Typography>{t('guard.redirecting')}</Typography>
            </Box>
        );
    }

    return <>{children}</>;
}
