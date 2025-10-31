'use client';

import React from 'react';
import { Typography, Skeleton, Stack } from '@mui/material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';
import PrimaryActionButton from '../buttons/PrimaryActionButton';

export interface AuthenticatedPriceProps {
    price: number;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
    color?: string;
    fontWeight?: string | number;
}

export function AuthenticatedPrice({
    price,
    variant = 'h6',
    color = 'primary.900',
    fontWeight = 'semibold',
}: AuthenticatedPriceProps) {
    const { isAuthenticated, loading } = useAuth();
    const t = useTranslations('auth');
    const p = useTranslations('products');
    const router = useRouter();

    const handleSignInClick = () => {
        router.push('/auth');
    };

    // Show skeleton during auth check
    if (loading) {
        return (
            <Skeleton
                variant="text"
                width={120}
                height={variant === 'h6' ? 32 : variant === 'h5' ? 36 : 28}
                sx={{ bgcolor: 'grey.200' }}
            />
        );
    }

    // Show price if authenticated
    if (isAuthenticated) {
        return (
            <Typography
                variant={variant}
                color={color}
                fontWeight={fontWeight}
            >
                {p('price')}: €{price.toFixed(2)}
            </Typography>
        );
    }

    // Show sign-in CTA if not authenticated
    return (
        <Stack spacing={0.5} alignItems="flex-start">
            <Typography
                variant="body1"
                color="primary.500"
                fontWeight={'500'}
                onClick={handleSignInClick}
            >
                {t('signInToViewPricing')}
            </Typography>
        </Stack>
    );
}
