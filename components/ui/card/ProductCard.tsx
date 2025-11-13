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
import { AuthenticatedPrice } from '@/components/ui/price/AuthenticatedPrice';

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

    const mainImageIndex = product.displayImages?.[0] ?? 0;
    const hoverImageIndex = product.displayImages?.[1] ?? product.images.length - 1;

    const mainImage = product.images[mainImageIndex];
    const hoverImage = product.images[hoverImageIndex] || mainImage;

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

    const formatDimensions = (dimensions: { length?: string; width?: string; thickness?: string }): string => {
        if (!dimensions.length || !dimensions.width || !dimensions.thickness) {
            return '';
        }
        const unit = t('products.units.mm');
        return `${dimensions.length} × ${dimensions.width} × ${dimensions.thickness} ${unit}`;
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
                    '&:hover': {
                        transform: 'scale(102%)',
                    },
                }}
            >
                <Box
                    borderRadius={borderRadius.sm}
                    sx={{ position: 'relative', width: '100%', paddingBottom: '120%' }}>
                    <Image
                        src={mainImageUrl}
                        alt={product.imageAlt[locale as keyof typeof product.imageAlt]}
                        fill
                        loading="lazy"
                        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                    <Stack direction="column" spacing={0.5}>
                        <Stack direction={{ xs: 'column', md: 'row' }} alignItems={'çenter'} justifyContent={'space-between'}>
                            {product.specifications?.appearance?.gradeCode ? <Typography variant="subtitle1">
                                {t(`collections.names.${product.specifications?.appearance?.gradeCode}`)}
                            </Typography> : null}
                            {product.constructionType ? <Typography variant="subtitle1">
                                {t(`collections.names.${product.constructionType}`)}
                            </Typography> : null}
                        </Stack>
                        <Typography variant="subtitle2">
                            {t(`collections.names.${product.collection}`)}
                        </Typography>
                        <Typography variant='subtitle2'>
                            {product.specifications?.dimensions && formatDimensions(product.specifications.dimensions)}
                        </Typography>
                        <AuthenticatedPrice
                            price={product.price}
                            variant="subtitle2"
                            color="primary.600"
                            fontWeight='500'
                            direction='row'
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Box >
    );
}
