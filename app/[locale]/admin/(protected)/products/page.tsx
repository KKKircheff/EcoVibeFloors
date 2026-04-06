'use client';

import { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { ProductsDB } from '@/lib/firebase/db';
import { Product } from '@/types/products';
import { ProductsTable } from '@/components/admin/products/ProductsTable';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        ProductsDB.getAll().then((result) => {
            if (result.success && result.data) {
                setProducts(result.data as unknown as Product[]);
            } else {
                setError(result.error ?? 'Failed to load products'); // TODO: translate when error keys are added
            }
            setLoading(false);
        });
    }, []);

    const handleProductDeleted = (sku: string) => {
        setProducts((prev) => prev.filter((p) => p.sku !== sku));
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" pt={6}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return <ProductsTable products={products} onProductDeleted={handleProductDeleted} />;
}
