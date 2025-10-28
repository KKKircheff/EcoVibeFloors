'use client';
import React from 'react';
import { Box, Stack, Typography, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { OakTreatment } from '@/types/treatments';

export interface TreatmentSwatchGalleryProps {
    treatments: OakTreatment[];
    availableSlugs?: string[]; // Filter to only show these treatment slugs
}

export function TreatmentSwatchGallery({ treatments, availableSlugs }: TreatmentSwatchGalleryProps) {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('oak');

    // Filter treatments if availableSlugs is provided
    const filteredTreatments = availableSlugs
        ? treatments.filter(treatment => availableSlugs.includes(treatment.slug))
        : treatments;

    const handleTreatmentClick = (slug: string) => {
        router.push(`/oak/treatments/${slug}`);
    };

    if (filteredTreatments.length === 0) {
        return null;
    }

    return (
        <Stack spacing={0}>
            {/* Swatches container */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    // Desktop: wrap to multiple rows
                    flexWrap: { xs: 'nowrap', md: 'wrap' },
                    // Mobile: horizontal scroll
                    overflowX: { xs: 'auto', md: 'visible' },
                    overflowY: 'visible',
                    pb: { xs: 1, md: 2 },
                    pt: 0.5,
                    // Scrollbar styling (mobile only)
                    '&::-webkit-scrollbar': {
                        height: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'grey.200',
                        borderRadius: 1,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'primary.main',
                        borderRadius: 1,
                    },
                }}
            >
                {filteredTreatments.map((treatment) => {
                    const localizedContent = treatment.i18n[locale as keyof typeof treatment.i18n];

                    return (
                        <Tooltip key={treatment.slug} title={localizedContent.name} placement="top">
                            <Box
                                onClick={() => handleTreatmentClick(treatment.slug)}
                                sx={{
                                    minWidth: { xs: 80, md: 120 },
                                    width: { xs: 80, md: 120 },
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        zIndex: '10 !important',
                                    }
                                }}
                            >
                                {/* Square image container */}
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: '100%',
                                        paddingBottom: '100%',
                                        borderRadius: 2,
                                        overflow: 'hidden',
                                        border: 1,
                                        borderColor: 'divider',
                                        '&:hover': {
                                            // boxShadow: 4,
                                        }
                                    }}
                                >
                                    <Image
                                        src={treatment.images[0]}
                                        alt={treatment.imageAlt[locale as keyof typeof treatment.imageAlt]}
                                        fill
                                        sizes="(max-width: 768px) 80px, 120px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </Box>

                                {/* Treatment name */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: 'block',
                                        textAlign: 'center',
                                        mt: 1,
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {localizedContent.name}
                                </Typography>
                            </Box>
                        </Tooltip>
                    );
                })}
            </Box>

            {/* View all treatments link */}
            <Box textAlign="center">
                <Typography
                    variant="body2"
                    color="primary"
                    sx={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        '&:hover': {
                            color: 'primary.dark',
                        }
                    }}
                    onClick={() => router.push('/oak/treatments')}
                >
                    {t('viewAllTreatments')}
                </Typography>
            </Box>
        </Stack>
    );
}
