'use client';

import React from 'react';
import { Card, CardContent, CardMedia, Stack, Typography, Chip } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Product } from '@/types/products';
import { useRouter } from '@/i18n/navigation';
import { Messages } from '@/global';

export interface ProductCardProps {
    product: Product;
    locale: string;
    baseImageUrl: string; // Firebase Storage base URL from env
}

/**
 * ProductCard component for displaying product in grid/list view
 * Shows thumbnail, name, pattern, price with hover effect
 */
export function ProductCard({ product, locale, baseImageUrl }: ProductCardProps) {
    const t = useTranslations();
    const router = useRouter();
    const [isHovered, setIsHovered] = React.useState(false);

    // Get localized content
    const localizedContent = product.i18n[locale as keyof typeof product.i18n];

    // Build Firebase Storage URLs
    const mainImage = product.images[0];
    const hoverImage = product.images[1] || mainImage;
    const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

    // Construct Firebase Storage URL with proper encoding
    const getStorageUrl = (imageName: string) => {
        const path = `products/${product.collection}/${product.pattern}/${product.sku}/thumbnail/${imageName}`;
        const encodedPath = encodeURIComponent(path);
        return `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodedPath}?alt=media`;
    };

    const mainImageUrl = getStorageUrl(mainImage);
    const hoverImageUrl = getStorageUrl(hoverImage);

    // Get pattern translation
    const patternKey = product.pattern as keyof Messages['patterns'];
    const patternLabel = t(`patterns.${patternKey}`);

    const handleClick = () => {
        router.push(`/${product.collection}/${product.pattern}/${product.slug}`);
    };

    return (
        <Card
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CardMedia
                component="img"
                height="280"
                image={isHovered ? hoverImageUrl : mainImageUrl}
                alt={product.imageAlt[locale as keyof typeof product.imageAlt]}
                sx={{
                    objectFit: 'cover',
                    transition: 'opacity 0.3s',
                }}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" spacing={1} mb={1}>
                    <Chip label={patternLabel} size="small" color="primary" variant="outlined" />
                </Stack>

                <Typography variant="h6" component="h3" gutterBottom sx={{ flexGrow: 1 }}>
                    {localizedContent.name}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {t('products.priceFrom')} €{product.price.toFixed(2)}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}
