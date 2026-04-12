'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, CircularProgress, Alert, Typography, Button } from '@mui/material';
import { ArrowBackOutlined as BackIcon } from '@mui/icons-material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ProductsDB } from '@/lib/firebase/db';
import { Product } from '@/types/products';
import { ProductForm } from '@/components/admin/products/ProductForm';

export default function EditProductPage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();
    const t = useTranslations('admin.products');
    const locale = useLocale() as 'en' | 'bg';
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        // Firestore doc ID = slug (not SKU)
        ProductsDB.getById(slug).then((result) => {
            if (result.success && result.data) {
                setProduct(result.data as unknown as Product);
            } else {
                setError(t('productNotFoundError', { sku: slug }));
            }
            setLoading(false);
        });
    }, [slug]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" pt={6}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !product) {
        return (
            <Box>
                <Alert severity="error">{error ?? t('productNotFound')}</Alert>
                <Button startIcon={<BackIcon />} onClick={() => router.push('/admin/products')} sx={{ mt: 2 }}>
                    {t('backToProducts')}
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            <Button
                startIcon={<BackIcon />}
                onClick={() => router.push('/admin/products')}
                sx={{ mb: 3 }}
            >
                {t('backToProducts')}
            </Button>
            <Typography variant="h5" fontWeight={600} mb={3}>
                {t('editProduct', { name: product.i18n?.[locale]?.name ?? product.i18n?.bg?.name ?? product.sku })}
            </Typography>
            <ProductForm initialProduct={product} />
        </Box>
    );
}
