'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Stack, Typography, Box } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { Product } from '@/types/products';
import { useRouter } from '@/i18n/navigation';
import { borderRadius } from '@/lib/styles/borderRadius';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import { getStorageUrl } from '@/lib/utils/getStorageUrl';

export interface ProductCardProps {
    product: Product;
}
export function ProductCard({ product }: ProductCardProps) {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();

    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hoverImageLoaded, setHoverImageLoaded] = useState(false);

    const localizedContent = product.i18n[locale as keyof typeof product.i18n];

    const mainImage = product.images[0];
    const hoverImage = product.images[product.images.length - 1] || mainImage;

    const mainImageUrls = getStorageUrl(
        product.collection,
        product.pattern,
        product.sku,
        mainImage
    );

    const hoverImageUrls = getStorageUrl(
        product.collection,
        product.pattern,
        product.sku,
        hoverImage
    );

    const mainImageUrl = mainImageUrls.full;
    const hoverImageUrl = hoverImageUrls.full;

    const handleClick = () => {
        router.push(`/${product.collection}/${product.pattern}/${product.slug}`);
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
                <ProductCardSkeleton />
            </Box>

            {/* Actual card content */}
            <Stack
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsHovered(false)}
                spacing={1}
                sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    height: '100%',
                    opacity: isLoading ? 0 : 1,
                }}
            >
                <Box
                    borderRadius={borderRadius.sm}
                    sx={{ position: 'relative', width: '100%', paddingBottom: '150%' }}>
                    <Image
                        src={mainImageUrl}
                        alt={product.imageAlt[locale as keyof typeof product.imageAlt]}
                        fill
                        loading="lazy"
                        // sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onLoad={handleMainImageLoad}
                        style={{
                            borderRadius: borderRadius.md,
                            objectFit: 'cover',
                            opacity: isHovered && hoverImageLoaded ? 0 : 1,
                            transition: 'opacity 0.3s ease-in-out',
                        }}
                    />

                    {/* Hover image - only load when needed */}
                    {(isHovered || hoverImageLoaded) && mainImage !== hoverImage && (
                        <Image
                            src={hoverImageUrl}
                            alt={product.imageAlt[locale as keyof typeof product.imageAlt]}
                            fill
                            loading="lazy"
                            sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw"
                            onLoad={handleHoverImageLoad}
                            style={{
                                borderRadius: borderRadius.md,
                                objectFit: 'cover',
                                opacity: isHovered && hoverImageLoaded ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out',
                            }}
                        />
                    )}
                </Box>

                <Stack spacing={1} sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="h4" component="h3" gutterBottom sx={{ flexGrow: 1 }}>
                        {localizedContent.name}
                    </Typography>

                    <Stack direction="column" spacing={1}>
                        <Stack direction='row'>
                            <Typography variant="h5" gutterBottom sx={{ flexGrow: 1 }}>
                                {t('collections.names.hybridWood')}

                            </Typography>
                            <Typography>
                                {localizedContent.specifications?.dimensions && (
                                    <>
                                        {localizedContent.specifications.dimensions.length?.replace(' cm', '')} × {localizedContent.specifications.dimensions.width?.replace(' cm', '')} × {localizedContent.specifications.dimensions.thickness?.replace(' cm', '')} cm
                                    </>
                                )}
                            </Typography>
                        </Stack>
                        <Typography variant="h6" color="primary.900" fontWeight="bold" >
                            {t('products.priceFrom')} €{product.price.toFixed(2)}
                        </Typography>
                    </Stack>
                </Stack>
            </Stack>
        </Box>
    );
}
