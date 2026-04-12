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
    TableSortLabel,
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
    CloseOutlined as CloseIcon,
} from '@mui/icons-material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Product } from '@/types/products';
import { ProductsDB } from '@/lib/firebase/db';
import { getStorageUrl } from '@/lib/utils/getStorageUrl';
import { ProductForm } from './ProductForm';
import Image from 'next/image';

interface ProductsTableProps {
    products: Product[];
    onProductDeleted: (slug: string) => void;
    onProductUpdated: () => void;
}

function productImageUrl(product: Product): string | null {
    if (!product.images?.length) return null;
    const cardIndex = product.displayImages?.[0] ?? 0;
    const filename = product.images[cardIndex] ?? product.images[0];
    return getStorageUrl(product.collection, product.pattern, product.sku, filename).full;
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

type SortField = 'sku' | 'name' | 'collection' | 'pattern' | 'price';
type SortDir = 'asc' | 'desc';

function sortProducts(products: Product[], field: SortField, dir: SortDir, locale: 'en' | 'bg'): Product[] {
    return [...products].sort((a, b) => {
        let aVal: string | number = '';
        let bVal: string | number = '';
        if (field === 'sku') { aVal = a.sku; bVal = b.sku; }
        else if (field === 'name') {
            aVal = a.i18n?.[locale]?.name ?? a.i18n?.bg?.name ?? '';
            bVal = b.i18n?.[locale]?.name ?? b.i18n?.bg?.name ?? '';
        }
        else if (field === 'collection') { aVal = a.collection; bVal = b.collection; }
        else if (field === 'pattern') { aVal = a.pattern; bVal = b.pattern; }
        else if (field === 'price') { aVal = a.price ?? 0; bVal = b.price ?? 0; }

        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        return 0;
    });
}

export function ProductsTable({ products, onProductDeleted, onProductUpdated }: ProductsTableProps) {
    const router = useRouter();
    const t = useTranslations('admin.products');
    const locale = useLocale() as 'en' | 'bg';

    const [search, setSearch] = useState('');
    const [collectionFilter, setCollectionFilter] = useState('all');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDir, setSortDir] = useState<SortDir>('asc');

    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const handleSortClick = (field: SortField) => {
        if (sortField === field) {
            setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

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

    const sorted = sortProducts(filtered, sortField, sortDir, locale);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        await ProductsDB.delete(deleteTarget.slug);
        onProductDeleted(deleteTarget.slug);
        setDeleting(false);
        setDeleteTarget(null);
    };

    const SortableHeader = ({ field, label }: { field: SortField; label: string }) => (
        <TableSortLabel
            active={sortField === field}
            direction={sortField === field ? sortDir : 'asc'}
            onClick={() => handleSortClick(field)}
        >
            <Typography variant="caption" fontWeight={600}>{label}</Typography>
        </TableSortLabel>
    );

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
                            <TableCell><SortableHeader field="sku" label={t('tableHeaders.sku')} /></TableCell>
                            <TableCell><SortableHeader field="name" label={t('tableHeaders.name')} /></TableCell>
                            <TableCell><SortableHeader field="collection" label={t('tableHeaders.collection')} /></TableCell>
                            <TableCell><SortableHeader field="pattern" label={t('tableHeaders.pattern')} /></TableCell>
                            <TableCell><SortableHeader field="price" label={t('tableHeaders.price')} /></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.status')}</Typography></TableCell>
                            <TableCell><Typography variant="caption" fontWeight={600}>{t('tableHeaders.images')}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="caption" fontWeight={600}>{t('tableHeaders.actions')}</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sorted.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {t('noProducts')}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sorted.map((product) => {
                                const thumb = productImageUrl(product);
                                return (
                                    <TableRow
                                        key={product.sku}
                                        hover
                                        onClick={() => setEditProduct(product)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell sx={{ p: 0.5 }}>
                                            <Box sx={{ width: 56, height: 42, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                                                {thumb && (
                                                    <Image
                                                        src={thumb}
                                                        alt={product.i18n?.[locale]?.name ?? product.i18n?.bg?.name ?? product.sku}
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
                                                {product.i18n?.[locale]?.name ?? product.i18n?.bg?.name ?? '—'}
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
                                                {product.price ? `€${product.price}` : '—'}
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
                                                    onClick={(e) => { e.stopPropagation(); setEditProduct(product); }}
                                                    title={t('edit')}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(product); }}
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

            {/* Edit dialog — keeps table filter/sort state intact */}
            <Dialog
                open={!!editProduct}
                onClose={() => setEditProduct(null)}
                maxWidth="lg"
                fullWidth
                scroll="paper"
            >
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={600}>
                            {t('editProduct', { name: editProduct?.i18n?.[locale]?.name ?? editProduct?.i18n?.bg?.name ?? editProduct?.sku ?? '' })}
                        </Typography>
                        <IconButton size="small" onClick={() => setEditProduct(null)}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {editProduct && (
                        <ProductForm
                            key={editProduct.slug}
                            initialProduct={editProduct}
                            onSaveSuccess={() => {
                                setEditProduct(null);
                                onProductUpdated();
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete confirmation dialog */}
            <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
                <DialogTitle>{t('deleteConfirmTitle')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('deleteConfirmText', { sku: deleteTarget?.sku ?? '', name: deleteTarget?.i18n?.[locale]?.name ?? deleteTarget?.i18n?.bg?.name ?? '' })}
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
