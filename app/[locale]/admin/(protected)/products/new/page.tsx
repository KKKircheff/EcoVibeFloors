'use client';

import { Box, Typography, Button } from '@mui/material';
import { ArrowBackOutlined as BackIcon } from '@mui/icons-material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ProductForm } from '@/components/admin/products/ProductForm';

export default function NewProductPage() {
    const router = useRouter();
    const t = useTranslations('admin.products');

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
                {t('newProduct')}
            </Typography>
            <ProductForm />
        </Box>
    );
}
