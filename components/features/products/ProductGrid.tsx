import React from 'react';
import { Grid, Typography, Stack } from '@mui/material';
import { Product } from '@/types/products';
import { ProductCard } from './ProductCard';

export interface ProductGridProps {
    products: Product[];
    emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <Stack alignItems="center" justifyContent="center" py={8}>
                <Typography variant="h5" color="text.secondary">
                    {emptyMessage}
                </Typography>
            </Stack>
        );
    }

    return (
        <Grid container spacing={{ xs: 2, md: 3, lg: 4 }}>
            {products.map((product) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.sku}>
                    <ProductCard product={product} />
                </Grid>
            ))}
        </Grid>
    );
}
