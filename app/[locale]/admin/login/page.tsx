'use client';

import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Typography, Alert } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAdminAuth } from '@/components/admin/layout/AdminAuthProvider';
import { isAdmin } from '@/lib/firebase/auth';
import { useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
    const { user, loading, signInWithGooglePopup } = useAdminAuth();
    const router = useRouter();
    const t = useTranslations('admin.login');
    const [signingIn, setSigningIn] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    const isUnauthorized = searchParams.get('error') === 'unauthorized';

    // If already signed in, check role and redirect
    useEffect(() => {
        if (loading || !user) return;

        isAdmin().then((adminStatus) => {
            if (adminStatus) {
                router.push('/admin');
            } else {
                setError(t('unauthorizedError'));
            }
        });
    }, [user, loading]);

    const handleGoogleSignIn = async () => {
        setSigningIn(true);
        setError(null);
        try {
            const result = await signInWithGooglePopup();
            if (!result.success) {
                setError(result.error ?? t('signInFailed'));
            }
            // On success, AdminAuthProvider redirects to /admin
        } catch {
            setError(t('signInFailed'));
        } finally {
            setSigningIn(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            bgcolor="background.default"
        >
            <Stack
                spacing={3}
                alignItems="center"
                sx={{
                    p: 5,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                    width: 360,
                }}
            >
                <Stack spacing={0.5} alignItems="center">
                    <Typography variant="h5" fontWeight={600}>
                        {t('title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('subtitle')}
                    </Typography>
                </Stack>

                {(isUnauthorized || error) && (
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {error ?? t('unauthorizedError')}
                    </Alert>
                )}

                <Button
                    variant="outlined"
                    size="large"
                    startIcon={signingIn ? <CircularProgress size={18} /> : <GoogleIcon />}
                    onClick={handleGoogleSignIn}
                    disabled={signingIn}
                    fullWidth
                    sx={{ textTransform: 'none' }}
                >
                    {signingIn ? t('signingIn') : t('continueWithGoogle')}
                </Button>
            </Stack>
        </Box>
    );
}
