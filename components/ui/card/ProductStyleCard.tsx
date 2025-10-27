'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Stack, Typography, Box, CardContent, Card } from '@mui/material';
import { useRouter } from '@/i18n/navigation';
import { borderRadius } from '@/lib/styles/borderRadius';
import { ProductStyleCardSkeleton } from './ProductStyleCardSkeleton';

export interface ProductStyleCardProps {
    title: string;
    dimensions?: string;
    description: string;
    mainImage: string;
    hoverImage: string;
    imageAlt: string;
    navigationUrl: string;
}

export function ProductStyleCard({
    title,
    dimensions,
    description,
    mainImage,
    hoverImage,
    imageAlt,
    navigationUrl
}: ProductStyleCardProps) {
    const router = useRouter();

    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hoverImageLoaded, setHoverImageLoaded] = useState(false);

    const handleClick = () => {
        router.push(navigationUrl);
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
                <ProductStyleCardSkeleton />
            </Box>

            {/* Actual card content */}
            <Card
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    height: '100%',
                    opacity: isLoading ? 0 : 1,
                    borderRadius: borderRadius.md,
                    '&:hover': {
                        transform: 'scale(102%)',
                    },
                }}
            >
                <Box
                    borderRadius={0}
                    sx={{
                        position: 'relative',
                        width: '100%',
                        paddingBottom: '66.67%', // 3:2 aspect ratio
                        overflow: 'hidden'
                    }}
                >
                    <Image
                        src={mainImage}
                        alt={imageAlt}
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
                    {(isHovered || hoverImageLoaded) && mainImage !== hoverImage && (
                        <Image
                            src={hoverImage}
                            alt={imageAlt}
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

                <CardContent>
                    <Stack spacing={1} sx={{ p: 2 }}>
                        <Typography variant="h4" component="h3" gutterBottom sx={{ flexGrow: 1 }}>
                            {title}
                        </Typography>

                        <Stack spacing={1}>
                            {dimensions && (
                                <Typography>
                                    {dimensions}
                                </Typography>
                            )}
                            <Typography variant="body1">
                                {description}
                            </Typography>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}
