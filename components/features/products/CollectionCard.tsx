'use client';
import React from 'react';
import { Card, CardContent, CardMedia, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { CollectionType } from '@/types/products';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useRouter } from '@/i18n/navigation';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';

export interface CollectionCardProps {
    collectionId: CollectionType;
    nameKey: string; // Translation key for collection name (e.g., 'collections.names.hybrid-wood')
    descriptionKey: string; // Translation key for description (e.g., 'collections.hybrid-wood.description')
    heroImage?: string; // Optional hero image
    productCount?: number; // Optional product count
}

export function CollectionCard({
    collectionId,
    nameKey,
    descriptionKey,
    heroImage,
    productCount,
}: CollectionCardProps) {
    const t = useTranslations();
    const router = useRouter();
    const [isHovered, setIsHovered] = React.useState(false);

    // Default placeholder image if none provided
    const imageSrc = heroImage || '/images/placeholder-collection.webp';

    const handleExploreClick = () => {
        router.push(`/${collectionId}`);
    };

    return (
        <Card
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                },
            }}
        >
            <CardMedia
                component="img"
                height="240"
                image={imageSrc}
                alt={t(nameKey as any)}
                sx={{
                    objectFit: 'cover',
                }}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" component="h2" gutterBottom color="primary.main">
                    {t(nameKey as any)}
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    paragraph
                    sx={{ flexGrow: 1 }}
                >
                    {t(descriptionKey as any)}
                </Typography>

                {productCount !== undefined && (
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        {productCount} {productCount === 1 ? 'product' : 'products'}
                    </Typography>
                )}

                <Stack direction="row" spacing={2}>
                    <PrimaryActionButton
                        onClick={handleExploreClick}
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        fullWidth
                        sx={{
                            transition: 'all 0.2s',
                            ...(isHovered && {
                                transform: 'translateX(4px)',
                            }),
                        }}
                    >
                        {t('buttons.exploreCollection')}
                    </PrimaryActionButton>
                </Stack>
            </CardContent>
        </Card>
    );
}
