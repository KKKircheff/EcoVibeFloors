'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { CollectionType } from '@/types/products';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from '@/i18n/navigation';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';
import { borderRadius } from '@/lib/styles/borderRadius';
import { CollectionCardSkeleton } from './CollectionCardSkeleton';

export interface CollectionCardProps {
    collectionId: CollectionType;
    nameKey: string; // Translation key for collection name (e.g., 'collections.names.hybrid-wood')
    descriptionKey: string; // Translation key for description (e.g., 'collections.hybrid-wood.description')
    mainImage?: string; // Optional main image
    hoverImage?: string; // Optional hover image
    productCount?: number; // Optional product count
}

export function CollectionCard({
    collectionId,
    nameKey,
    descriptionKey,
    mainImage,
    hoverImage,
    productCount,
}: CollectionCardProps) {
    const t = useTranslations();
    const router = useRouter();

    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hoverImageLoaded, setHoverImageLoaded] = useState(false);

    // Default placeholder image if none provided
    const mainImageSrc = mainImage || '/images/placeholder-collection.webp';
    const hoverImageSrc = hoverImage || mainImageSrc;

    const handleExploreClick = () => {
        router.push(`/${collectionId}`);
    };

    const handleMainImageLoad = () => {
        setIsLoading(false);
    };

    const handleHoverImageLoad = () => {
        setHoverImageLoaded(true);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

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
                <CollectionCardSkeleton />
            </Box>

            {/* Actual card content */}
            <Card
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleExploreClick}
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
                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: { xs: '100%', sm: '80%', md: '60%' },
                        overflow: 'hidden'
                    }}
                >
                    <Image
                        src={mainImageSrc}
                        alt={t(nameKey)}
                        fill
                        loading="lazy"
                        onLoad={handleMainImageLoad}
                        style={{
                            objectFit: 'cover',
                            opacity: isHovered && hoverImageLoaded ? 0 : 1,
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    />

                    {/* Hover image - only load when needed */}
                    {(isHovered || hoverImageLoaded) && mainImageSrc !== hoverImageSrc && (
                        <Image
                            src={hoverImageSrc}
                            alt={t(nameKey)}
                            fill
                            loading="lazy"
                            onLoad={handleHoverImageLoad}
                            style={{
                                objectFit: 'cover',
                                opacity: isHovered && hoverImageLoaded ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out',
                            }}
                        />
                    )}
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', px: 3 }} >
                    <Stack spacing={1} pt={2} pb={5}>
                        <Typography variant="h4" component="h2" sx={{ flexGrow: 1 }}>
                            {t(nameKey)}
                        </Typography>

                        <Typography
                            variant="subtitle1"
                            color="text.secondary"
                        >
                            {t(descriptionKey)}
                        </Typography>

                        {/* {productCount !== undefined && (
                            <Typography variant="subtitle2" color="primary.500" fontWeight={500}>
                                {productCount} {productCount === 1 ? 'product' : 'products'}
                            </Typography>
                        )} */}
                    </Stack>
                    <PrimaryActionButton
                        onClick={handleExploreClick}
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        fullWidth
                    >
                        {t('buttons.exploreCollection')}
                    </PrimaryActionButton>
                </CardContent>
            </Card>
        </Box>
    );
}
