'use client';

import { useState } from 'react';
import {
    Box,
    Stack,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import {
    EditOutlined as EditIcon,
    DeleteOutlined as DeleteIcon,
    AddOutlined as AddIcon,
} from '@mui/icons-material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Product } from '@/types/products';
import { ProductsDB } from '@/lib/firebase/db';
import { getStorageUrl } from '@/lib/utils/getStorageUrl';
import Image from 'next/image';

interface ProductsTableProps {
    products: Product[];
    onProductDeleted: (sku: string) => void;
}

function productImageUrl(product: Product): string | null {
    if (!product.images?.length) return null;
    // Use full-size image — thumbnails may not exist for all products
    return getStorageUrl(product.collection, product.pattern, product.sku, product.images[0]).full;
}

const COLLECTION_LABELS: Record<string, string> = {
    oak: 'Oak',
    'hybrid-wood': 'Hy-Wood',
    'click-vinyl': 'Click Vinyl',
    'glue-down-vinyl': 'Glue-Down Vinyl',
};

const STATUS_COLORS: Record<string, 'success' | 'warning' | 'default'> = {
    published: 'success',
    draft: 'warning',
    archived: 'default',
};

export function ProductsTable({ products, onProductDeleted }: ProductsTableProps) {
    const router = useRouter();
    const t = useTranslations('admin.products');
    const [search, setSearch] = useState('');
    const [collectionFilter, setCollectionFilter] = useState('all');
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);

    const filtered = products.filter((p) => {
        const matchesSearch =
            !search ||
            p.sku.toLowerCase().includes(search.toLowerCase()) ||
            p.i18n?.bg?.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.i18n?.en?.name?.toLowerCase().includes(search.toLowerCase());
        const matchesCollection =
            collectionFilter === 'all' || p.collection === collectionFilter;
        return matchesSearch && matchesCollection;
    });

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        await ProductsDB.delete(deleteTarget.sku);
        onProductDeleted(deleteTarget.sku);
        setDeleting(false);
        setDeleteTarget(null);
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight={600}>{t('title')}</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/admin/products/new')}
                >
                    {t('addProduct')}
                </Button>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
                <TextField
                    placeholder={t('searchPlaceholder')}
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 260 }}
                />
                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel>{t('collection')}</InputLabel>
                    <Select
                        value={collectionFilter}
                        label={t('collection')}
                        onChange={(e) => setCollectionFilter(e.target.value)}
                    >
                        <MenuItem value="all">{t('allCollections')}</MenuItem>
                        {Object.entries(COLLECTION_LABELS).map(([val, label]) => (
                            <MenuItem key={val} value={val}>{label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography variant="body2" color="text.secondary" alignSelf="center">
                    {t('productCount', { filtered: filtered.length, total: products.length })}
                </Typography>
            </Stack>

            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            <TableCell sx={{ width: 64 }} />
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.sku')}</Typography></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.name')}</Typography></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.collection')}</Typography></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.pattern')}</Typography></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.price')}</Typography></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.status')}</Typography></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.images')}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="caption" fontWeight={600}>{t('tableHeaders.actions')}</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('noProducts')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((product) => {
                                const thumb = productImageUrl(product);
                                return (
                                <TableRow key={product.sku} hover>
                                    <TableCell sx={{ p: 0.5 }}>
                                        <Box sx={{ width: 56, height: 42, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                                            {thumb && (
                                                <Image
                                                    src={thumb}
                                                    alt={product.i18n?.bg?.name ?? product.sku}
                                                    fill
                                                    sizes="56px"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontFamily="monospace">
                                            {product.sku}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                                            {product.i18n?.bg?.name ?? '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {COLLECTION_LABELS[product.collection] ?? product.collection}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{product.pattern}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {product.price ? `${product.price} лв` : '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={product.metadata?.status ?? 'published'}
                                            color={STATUS_COLORS[product.metadata?.status ?? 'published'] ?? 'default'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {product.images?.length ?? 0}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                                            <IconButton
                                                size="small"
                                                onClick={() => router.push(`/admin/products/${product.sku}/edit`)}
                                                title={t('edit')}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => setDeleteTarget(product)}
                                                title={t('delete')}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete confirmation dialog */}
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle>{t('deleteConfirmTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('deleteConfirmText', { sku: deleteTarget?.sku ?? '', name: deleteTarget?.i18n?.bg?.name ?? '' })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>{t('cancel')}</Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleDelete}
                        disabled={deleting}
                        startIcon={deleting ? <CircularProgress size={16} /> : undefined}
                    >
                        {deleting ? t('deleting') : t('delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
