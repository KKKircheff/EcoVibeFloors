'use client';

import React from 'react';
import { Typography, Skeleton, Stack } from '@mui/material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';

export interface AuthenticatedPriceProps {
    price: number;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
    color?: string;
    fontWeight?: string | number;
    direction?: 'row' | 'column'
}

export function AuthenticatedPrice({
    price,
    variant = 'h6',
    color = 'primary.900',
    fontWeight = 'semibold',
    direction = 'column'
}: AuthenticatedPriceProps) {
    const { isAuthenticated, loading } = useAuth();
    const t = useTranslations('auth');
    const p = useTranslations('products');
    const router = useRouter();

    const handleSignInClick = () => {
        router.push('/auth');
    };

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

    if (isAuthenticated) {
        return (
            <Stack direction={direction} spacing={direction === 'column' ? 0 : 1} alignItems={direction === 'column' ? 'flex-end' : 'baseline'}>
                <Typography
                    variant={variant}
                    color={color}
                    fontWeight={fontWeight}
                    fontFamily={'Montserrat'}
                >
                    {p('price')}: €{price.toFixed(2)}{' '}
                </Typography>
                <Typography
                    component="span"
                    variant='body2'
                    color={color}
                    sx={{ fontWeight: 500 }}
                >
                    {p('vatIncluded')}
                </Typography>
            </Stack>
        );
    }

    // Show sign-in CTA if not authenticated
    return (
        <Stack spacing={0.5} alignItems="flex-start">
            <Typography
                variant="body1"
                color="primary.500"
                fontWeight={'600'}
                onClick={handleSignInClick}
            >
                {t('signInToViewPricing')}
            </Typography>
        </Stack>
    );
}
