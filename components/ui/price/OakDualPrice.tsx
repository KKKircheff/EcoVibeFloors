'use client';

import React from 'react';
import { Typography, Skeleton, Stack } from '@mui/material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/hooks';

export interface OakDualPriceProps {
    basePrice: number;
    isFinished: boolean;
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
    color?: string;
    fontWeight?: string | number;
}

const FINISHING_COST = 5; // €5 finishing service cost

export function OakDualPrice({
    basePrice,
    isFinished,
    variant = 'h6',
    color = 'primary.900',
    fontWeight = 'semibold',
}: OakDualPriceProps) {
    const { isAuthenticated, loading } = useAuth();
    const t = useTranslations('auth');
    const p = useTranslations('products');
    const router = useRouter();

    const handleSignInClick = () => {
        router.push('/auth');
    };

    // Calculate prices
    const unfinishedPrice = basePrice;
    const finishedPrice = basePrice + FINISHING_COST;

    // Show skeleton during auth check
    if (loading) {
        return (
            <Skeleton
                variant="text"
                width={200}
                height={variant === 'h6' ? 32 : variant === 'h5' ? 36 : variant === 'h4' ? 42 : 28}
                sx={{ bgcolor: 'grey.200' }}
            />
        );
    }

    // Show prices if authenticated
    if (isAuthenticated) {
        return (
            <Stack spacing={0.5}>
                {/* Finished Price - Always shown */}
                <Typography
                    variant={variant}
                    color={color}
                    fontWeight={fontWeight}
                    fontFamily={'Montserrat'}
                    textAlign={'right'}
                >
                    {/* {p('priceFinished')}: €{finishedPrice.toFixed(2)}{' '} */}
                    {p('priceFinished')}: €{unfinishedPrice.toFixed(2)}{' '}
                </Typography>

                {/* Unfinished Price - Only for unfinished products */}
                {!isFinished && (
                    <Typography
                        variant={variant}
                        color={color}
                        fontWeight={fontWeight}
                        fontFamily={'Montserrat'}
                        textAlign={'right'}
                    >
                        {p('priceUnfinished')}: €{unfinishedPrice.toFixed(2)}{' '}
                    </Typography>
                )}
                <Typography
                    component="span"
                    variant='body2'
                    color={color}
                    textAlign={'right'}
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
                fontWeight={'500'}
                onClick={handleSignInClick}
            >
                {t('signInToViewPricing')}
            </Typography>
        </Stack>
    );
}
