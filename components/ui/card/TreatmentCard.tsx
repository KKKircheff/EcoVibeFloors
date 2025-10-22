'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, Stack, Typography, Box, Chip } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { OakTreatment } from '@/types/treatments';
import { useRouter } from '@/i18n/navigation';
import { borderRadius } from '@/lib/styles/borderRadius';
import { Messages } from '@/global';
import { TreatmentCardSkeleton } from './TreatmentCardSkeleton';

export interface TreatmentCardProps {
    treatment: OakTreatment;
}

export function TreatmentCard({ treatment }: TreatmentCardProps) {
    const t = useTranslations('oakTreatments');
    const locale = useLocale();
    const router = useRouter();

    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const localizedContent = treatment.i18n[locale as keyof typeof treatment.i18n];

    const imageUrl = treatment.images[0]; // Use first image from public folder

    const handleClick = () => {
        router.push(`/oak/treatments/${treatment.slug}`);
    };

    const handleMainImageLoad = () => {
        setIsLoading(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    // Map category to translated label
    const categoryKey = `categories.${treatment.category}` as keyof Messages['oakTreatments'];

    return (
        <Box sx={{ position: 'relative', height: '100%' }}>
            {/* Skeleton overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: isLoading ? 2 : -1,
                    opacity: isLoading ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                    pointerEvents: isLoading ? 'auto' : 'none',
                }}
            >
                <TreatmentCardSkeleton />
            </Box>

            {/* Actual card content */}
            <Card
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: isLoading ? 0 : 1,
                    borderRadius: borderRadius.md,
                    '&:hover': {
                        transform: 'scale(102%)',
                    },
                }}
            >
                {/* Image container with 1:1 aspect ratio */}
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: '100%', // 1:1 aspect ratio (square)
                        overflow: 'hidden',
                    }}
                >
                    <Image
                        src={imageUrl}
                        alt={treatment.imageAlt[locale as keyof typeof treatment.imageAlt]}
                        fill
                        loading="lazy"
                        sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        onLoad={handleMainImageLoad}
                        style={{
                            objectFit: 'cover',
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    />

                    {/* Category badge overlay */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            zIndex: 1,
                        }}
                    >
                        <Chip
                            label={t(categoryKey)}
                            size="small"
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(8px)',
                                fontWeight: 500,
                            }}
                        />
                    </Box>
                </Box>

                {/* Treatment info */}
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', px: 3 }}>
                    <Stack spacing={1} pt={2} pb={2}>
                        <Typography variant="h5" component="h3" sx={{ flexGrow: 1 }}>
                            {localizedContent.name}
                        </Typography>
                        {/* <Typography variant="subtitle1" color="text.secondary">
                            {treatment.characteristics.finishType}
                        </Typography> */}
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
