'use client';

import { useState, useRef } from 'react';
import {
    Stack,
    Typography,
    Divider,
    Box,
    Button,
    IconButton,
    LinearProgress,
    Chip,
    Alert,
    Paper,
} from '@mui/material';
import {
    CloudUploadOutlined as UploadIcon,
    DeleteOutlined as DeleteIcon,
    ArrowUpwardOutlined as MoveUpIcon,
    ArrowDownwardOutlined as MoveDownIcon,
    CropOriginalOutlined as GalleryCardIcon,
    VisibilityOutlined as HoverIcon,
} from '@mui/icons-material';
import Tooltip from '@mui/material/Tooltip';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { useTranslations } from 'next-intl';
import { storage } from '@/lib/firebase';
import { getStorageUrl } from '@/lib/utils/getStorageUrl';

// Mirrors the mapping in getStorageUrl — keeps upload/delete paths consistent with public site
const storageCollectionMap: Record<string, string> = {
    'hybrid-wood': 'hy-wood',
};
function toStoragePath(collection: string) {
    return storageCollectionMap[collection] ?? collection;
}

interface ProductImageManagerProps {
    collection: string;
    pattern: string;
    sku: string;
    images: string[];
    onChange: (images: string[]) => void;
    // Which indices in images[] are used as gallery card [0] and hover [1] on the website
    displayImages: [number, number];
    onDisplayImagesChange: (di: [number, number]) => void;
}

export function ProductImageManager({
    collection,
    pattern,
    sku,
    images,
    onChange,
    displayImages,
    onDisplayImagesChange,
}: ProductImageManagerProps) {
    const t = useTranslations('admin.images');

    function imageRole(index: number): 'gallery' | 'hover' | null {
        if (index === displayImages[0]) return 'gallery';
        if (index === displayImages[1]) return 'hover';
        return null;
    }

    function imageLabel(index: number, total: number): string {
        const role = imageRole(index);
        if (role === 'gallery') return t('galleryCard');
        if (role === 'hover') return t('hoverImage');
        return t('imageOf', { index: index + 1, total });
    }

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length || !sku) return;

        setUploading(true);
        setUploadError(null);
        const newFilenames: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filename = file.name;
            const storagePath = `products/${toStoragePath(collection)}/${pattern}/${sku}/full/${filename}`;
            const storageRef = ref(storage, storagePath);

            await new Promise<void>((resolve, reject) => {
                const task = uploadBytesResumable(storageRef, file);
                task.on(
                    'state_changed',
                    (snap) => {
                        const overall = ((i + snap.bytesTransferred / snap.totalBytes) / files.length) * 100;
                        setUploadProgress(Math.round(overall));
                    },
                    (err) => {
                        setUploadError(err.message);
                        reject(err);
                    },
                    async () => {
                        await getDownloadURL(task.snapshot.ref);
                        newFilenames.push(filename);
                        resolve();
                    }
                );
            });
        }

        onChange([...images, ...newFilenames]);
        setUploading(false);
        setUploadProgress(0);
        // Reset input so the same file can be re-selected if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (index: number) => {
        const filename = images[index];
        const storagePath = `products/${toStoragePath(collection)}/${pattern}/${sku}/full/${filename}`;
        try {
            await deleteObject(ref(storage, storagePath));
        } catch {
            // File may not exist in Storage yet — continue removing from list
        }
        onChange(images.filter((_, i) => i !== index));
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const next = [...images];
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
        onChange(next);
    };

    const moveDown = (index: number) => {
        if (index === images.length - 1) return;
        const next = [...images];
        [next[index + 1], next[index]] = [next[index], next[index + 1]];
        onChange(next);
    };

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>{t('title')}</Typography>
            <Divider />

            <Typography variant="body2" color="text.secondary">
                {t('indexHint')}
            </Typography>

            {images.length === 0 ? (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                    {t('noImages')}
                </Typography>
            ) : (
                <Stack spacing={1}>
                    {images.map((filename, index) => (
                        <Paper key={filename} variant="outlined" sx={{ p: 1.5 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                {/* Thumbnail preview */}
                                <Box
                                    component="img"
                                    src={getStorageUrl(collection, pattern, sku, filename).full}
                                    alt={filename}
                                    sx={{
                                        width: 64,
                                        height: 48,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        bgcolor: 'grey.100',
                                        flexShrink: 0,
                                    }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />

                                <Stack flexGrow={1} spacing={0.5}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Chip
                                            label={imageLabel(index, images.length)}
                                            size="small"
                                            color={imageRole(index) === 'gallery' ? 'primary' : imageRole(index) === 'hover' ? 'secondary' : 'default'}
                                            variant={imageRole(index) !== null ? 'filled' : 'outlined'}
                                        />
                                        <Typography variant="caption" color="text.secondary" noWrap>
                                            {filename}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {/* Set-role + reorder + delete controls */}
                                <Stack direction="row" spacing={0}>
                                    {imageRole(index) !== 'gallery' && (
                                        <Tooltip title={t('setAsGalleryCard')}>
                                            <IconButton
                                                size="small"
                                                onClick={() => onDisplayImagesChange([index, displayImages[1]])}
                                            >
                                                <GalleryCardIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {imageRole(index) !== 'hover' && (
                                        <Tooltip title={t('setAsHoverImage')}>
                                            <IconButton
                                                size="small"
                                                onClick={() => onDisplayImagesChange([displayImages[0], index])}
                                            >
                                                <HoverIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Stack>

                                {/* Reorder + delete controls */}
                                <Stack direction="row" spacing={0}>
                                    <IconButton
                                        size="small"
                                        onClick={() => moveUp(index)}
                                        disabled={index === 0}
                                        title={t('moveUp')}
                                    >
                                        <MoveUpIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => moveDown(index)}
                                        disabled={index === images.length - 1}
                                        title={t('moveDown')}
                                    >
                                        <MoveDownIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleDelete(index)}
                                        title={t('removeImage')}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>
            )}

            {uploading && (
                <Stack spacing={0.5}>
                    <Typography variant="caption">{t('uploading', { progress: uploadProgress })}</Typography>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                </Stack>
            )}

            {uploadError && <Alert severity="error">{uploadError}</Alert>}

            {!sku && (
                <Alert severity="warning">{t('skuRequired')}</Alert>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />
            <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !sku}
                sx={{ alignSelf: 'flex-start' }}
            >
                {t('uploadImages')}
            </Button>
        </Stack>
    );
}
