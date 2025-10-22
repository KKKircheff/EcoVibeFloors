'use client';
import React, { useState } from 'react';
import { Box, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { OakTreatment } from '@/types/treatments';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

export interface TreatmentSwatchGalleryProps {
    treatments: OakTreatment[];
    availableSlugs?: string[]; // Filter to only show these treatment slugs
}

export function TreatmentSwatchGallery({ treatments, availableSlugs }: TreatmentSwatchGalleryProps) {
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('oak');

    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Filter treatments if availableSlugs is provided
    const filteredTreatments = availableSlugs
        ? treatments.filter(treatment => availableSlugs.includes(treatment.slug))
        : treatments;

    const handleTreatmentClick = (slug: string) => {
        router.push(`/oak/treatments/${slug}`);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!containerRef.current) return;

        const scrollAmount = 300;
        const newPosition = direction === 'left'
            ? scrollPosition - scrollAmount
            : scrollPosition + scrollAmount;

        containerRef.current.scrollTo({
            left: newPosition,
            behavior: 'smooth'
        });

        setScrollPosition(newPosition);
    };

    if (filteredTreatments.length === 0) {
        return null;
    }

    return (
        <Stack spacing={3}>
            {/* Scrollable swatches container */}
            <Box sx={{ position: 'relative' }}>
                {/* Left scroll button */}
                <IconButton
                    onClick={() => scroll('left')}
                    disabled={scrollPosition <= 0}
                    sx={{
                        position: 'absolute',
                        left: -20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': {
                            bgcolor: 'grey.100',
                        },
                        '&:disabled': {
                            display: 'none',
                        }
                    }}
                >
                    <ChevronLeft />
                </IconButton>

                {/* Swatches container */}
                <Box
                    ref={containerRef}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                        pb: 2,
                    }}
                >
                    {filteredTreatments.map((treatment) => {
                        const localizedContent = treatment.i18n[locale as keyof typeof treatment.i18n];

                        return (
                            <Tooltip key={treatment.slug} title={localizedContent.name} placement="top">
                                <Box
                                    onClick={() => handleTreatmentClick(treatment.slug)}
                                    sx={{
                                        minWidth: { xs: 100, md: 120 },
                                        width: { xs: 100, md: 120 },
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
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
                                            boxShadow: 2,
                                            border: 2,
                                            borderColor: 'divider',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                boxShadow: 4,
                                            }
                                        }}
                                    >
                                        <Image
                                            src={treatment.images[0]}
                                            alt={treatment.imageAlt[locale as keyof typeof treatment.imageAlt]}
                                            fill
                                            sizes="120px"
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

                {/* Right scroll button */}
                <IconButton
                    onClick={() => scroll('right')}
                    sx={{
                        position: 'absolute',
                        right: -20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 2,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': {
                            bgcolor: 'grey.100',
                        }
                    }}
                >
                    <ChevronRight />
                </IconButton>
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
