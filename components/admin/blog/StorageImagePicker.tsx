'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Stack,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import { CloseOutlined as CloseIcon, ContentCopyOutlined as CopyIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { ProductsDB } from '@/lib/firebase/db';
import { Product } from '@/types';
import { getStorageUrl } from '@/lib/utils/getStorageUrl';

interface StorageImagePickerProps {
    open: boolean;
    onClose: () => void;
}

const COLLECTIONS = [
    { id: 'oak', label: 'Natural Oak' },
    { id: 'hybrid-wood', label: 'Hybrid Wood' },
    { id: 'click-vinyl', label: 'Click Vinyl' },
    { id: 'glue-down-vinyl', label: 'Glue-Down Vinyl' },
] as const;

// Mirror the mapping from getStorageUrl.ts
const STORAGE_COLLECTION_MAP: Record<string, string> = {
    'hybrid-wood': 'hy-wood',
};

function getStoragePath(collection: string, pattern: string, sku: string, imageName: string): string {
    const storageCollection = STORAGE_COLLECTION_MAP[collection] || collection;
    return `products/${storageCollection}/${pattern}/${sku}/full/${imageName}`;
}

interface SelectedImage {
    path: string;
    fullUrl: string;
    thumbnailUrl: string;
    fileName: string;
}

export function StorageImagePicker({ open, onClose }: StorageImagePickerProps) {
    const t = useTranslations('admin.blog');

    const [selectedCollection, setSelectedCollection] = useState<string>('');
    const [patterns, setPatterns] = useState<string[]>([]);
    const [patternsLoading, setPatternsLoading] = useState(false);
    const [selectedPattern, setSelectedPattern] = useState<string>('');
    const [selectedSku, setSelectedSku] = useState<string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

    // Fetch patterns from Firestore when collection is selected
    useEffect(() => {
        if (!selectedCollection) {
            setPatterns([]);
            return;
        }

        let cancelled = false;
        setPatternsLoading(true);
        setPatterns([]);
        setSelectedPattern('');
        setSelectedSku('');
        setProducts([]);
        setSelectedImage(null);

        ProductsDB.getByCollection(selectedCollection).then((result) => {
            if (cancelled) return;
            setPatternsLoading(false);
            if (result.success && result.data) {
                const prods = result.data as unknown as Product[];
                // Extract distinct patterns sorted
                const uniquePatterns = [...new Set(prods.map((p) => p.pattern))].sort();
                setPatterns(uniquePatterns);
            } else {
                setPatterns([]);
            }
        });

        return () => { cancelled = true; };
    }, [selectedCollection]);

    // Fetch products when pattern is selected
    useEffect(() => {
        if (!selectedCollection || !selectedPattern) {
            setProducts([]);
            return;
        }

        let cancelled = false;
        setProductsLoading(true);
        setProducts([]);
        setSelectedSku('');
        setSelectedImage(null);

        ProductsDB.getByCollectionAndPattern(selectedCollection, selectedPattern).then((result) => {
            if (cancelled) return;
            setProductsLoading(false);
            if (result.success && result.data) {
                setProducts(result.data as unknown as Product[]);
            } else {
                setProducts([]);
            }
        });

        return () => { cancelled = true; };
    }, [selectedCollection, selectedPattern]);

    const selectedProduct = selectedSku ? products.find((p) => p.sku === selectedSku) : null;
    const images = selectedProduct?.images ?? [];

    const handleCopy = useCallback(async (text: string) => {
        await navigator.clipboard.writeText(text);
        setSnackbar({ open: true, message: t('imagePicker.copied') });
    }, [t]);

    const handleClose = useCallback(() => {
        setSelectedCollection('');
        setPatterns([]);
        setSelectedPattern('');
        setSelectedSku('');
        setProducts([]);
        setSelectedImage(null);
        onClose();
    }, [onClose]);

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth scroll="paper">
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight={600}>
                            {t('imagePicker.title')}
                        </Typography>
                        <IconButton size="small" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {/* Cascading dropdowns */}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                            <FormControl size="small" sx={{ minWidth: 180 }} fullWidth>
                                <InputLabel>{t('imagePicker.collection')}</InputLabel>
                                <Select
                                    value={selectedCollection}
                                    label={t('imagePicker.collection')}
                                    onChange={(e) => setSelectedCollection(e.target.value)}
                                >
                                    {COLLECTIONS.map((col) => (
                                        <MenuItem key={col.id} value={col.id}>{col.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {selectedCollection && (
                                <FormControl size="small" sx={{ minWidth: 180 }} fullWidth>
                                    <InputLabel>{t('imagePicker.pattern')}</InputLabel>
                                    <Select
                                        value={selectedPattern}
                                        label={t('imagePicker.pattern')}
                                        onChange={(e) => setSelectedPattern(e.target.value)}
                                    >
                                        {patternsLoading ? (
                                            <MenuItem disabled>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <CircularProgress size={16} />
                                                    <Typography variant="body2">{t('imagePicker.loadingProducts')}</Typography>
                                                </Stack>
                                            </MenuItem>
                                        ) : patterns.length === 0 ? (
                                            <MenuItem disabled>{t('imagePicker.noProducts')}</MenuItem>
                                        ) : (
                                            patterns.map((pat) => (
                                                <MenuItem key={pat} value={pat}>{pat}</MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            )}

                            {selectedPattern && (
                                <FormControl size="small" sx={{ minWidth: 220 }} fullWidth>
                                    <InputLabel>{t('imagePicker.sku')}</InputLabel>
                                    <Select
                                        value={selectedSku}
                                        label={t('imagePicker.sku')}
                                        onChange={(e) => {
                                            setSelectedSku(e.target.value);
                                            setSelectedImage(null);
                                        }}
                                    >
                                        {productsLoading ? (
                                            <MenuItem disabled>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <CircularProgress size={16} />
                                                    <Typography variant="body2">{t('imagePicker.loadingProducts')}</Typography>
                                                </Stack>
                                            </MenuItem>
                                        ) : products.length === 0 ? (
                                            <MenuItem disabled>{t('imagePicker.noProducts')}</MenuItem>
                                        ) : (
                                            products.map((p) => (
                                                <MenuItem key={p.sku} value={p.sku}>
                                                    {p.sku} — {p.i18n?.bg?.name ?? p.i18n?.en?.name ?? p.slug}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            )}
                        </Stack>

                        {/* Image gallery */}
                        {selectedProduct && images.length > 0 && (
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                    gap: 1.5,
                                }}
                            >
                                {images.map((imageName) => {
                                    const urls = getStorageUrl(selectedCollection, selectedProduct.pattern, selectedProduct.sku, imageName);
                                    const isSelected = selectedImage?.fileName === imageName;
                                    return (
                                        <Box
                                            key={imageName}
                                            onClick={() => setSelectedImage({
                                                path: getStoragePath(selectedCollection, selectedProduct.pattern, selectedProduct.sku, imageName),
                                                fullUrl: urls.full,
                                                thumbnailUrl: urls.thumbnail,
                                                fileName: imageName,
                                            })}
                                            sx={{
                                                position: 'relative',
                                                width: '100%',
                                                paddingTop: '100%',
                                                borderRadius: 1,
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: isSelected ? '3px solid' : '3px solid transparent',
                                                borderColor: isSelected ? 'primary.main' : 'transparent',
                                                bgcolor: 'grey.100',
                                                transition: 'border-color 0.15s',
                                                '&:hover': { borderColor: 'primary.light' },
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src={urls.full}
                                                alt={imageName}
                                                loading="lazy"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}

                        {selectedProduct && images.length === 0 && (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                No images found for this product.
                            </Typography>
                        )}

                        {/* URL panel */}
                        {selectedImage && (
                            <Stack spacing={1.5} sx={{ mt: 1 }}>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    {selectedImage.fileName}
                                </Typography>

                                {/* Storage Path (for hero image field) */}
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label={t('imagePicker.storagePath')}
                                        value={selectedImage.path}
                                        slotProps={{ input: { readOnly: true } }}
                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                    />
                                    <IconButton
                                        size="small"
                                        title={t('imagePicker.storagePath')}
                                        onClick={() => handleCopy(selectedImage.path)}
                                    >
                                        <CopyIcon fontSize="small" />
                                    </IconButton>
                                </Stack>

                                {/* Full URL (for markdown embeds) */}
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label={t('imagePicker.fullUrl')}
                                        value={selectedImage.fullUrl}
                                        slotProps={{ input: { readOnly: true } }}
                                        onClick={(e) => (e.target as HTMLInputElement).select()}
                                    />
                                    <IconButton
                                        size="small"
                                        title={t('imagePicker.fullUrl')}
                                        onClick={() => handleCopy(selectedImage.fullUrl)}
                                    >
                                        <CopyIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        )}
                    </Stack>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={2000}
                onClose={() => setSnackbar({ open: false, message: '' })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled" onClose={() => setSnackbar({ open: false, message: '' })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}