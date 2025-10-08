'use client';
import { Stack, Typography, Grid } from '@mui/material';
import { ProductStyleCard, ProductStyleCardProps } from '../card/ProductStyleCard';

export interface ProductStylesProps {
    title: string;
    styles: ProductStyleCardProps[];
}

export function ProductStylesGrid({ title, styles }: ProductStylesProps) {
    return (
        <Stack spacing={6}>
            {/* <Typography variant="h3" color="primary.main" fontWeight={600} textAlign="center">
                {title}
            </Typography> */}

            <Grid container spacing={8}>
                {styles.map((style, index) => (
                    <Grid key={index} size={{ xs: 12, md: 6 }}>
                        <ProductStyleCard {...style} />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}