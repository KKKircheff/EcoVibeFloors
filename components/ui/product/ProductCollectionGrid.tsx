'use client';
import { Stack, Typography, Grid } from '@mui/material';
import { ProductCollectionCard, ProductCollectionCardProps } from '../card/ProductCollectionCard';

export interface ProductCollectionProps {
    title: string;
    styles: ProductCollectionCardProps[];
}

export function ProductCollectionGrid({ title, styles }: ProductCollectionProps) {
    return (
        <Stack spacing={6}>
            {/* <Typography variant="h3" color="primary.main" fontWeight={600} textAlign="center">
                {title}
            </Typography> */}

            <Grid container spacing={8}>
                {styles.map((style, index) => (
                    <Grid key={index} size={{ xs: 12, md: 6 }}>
                        <ProductCollectionCard {...style} />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}