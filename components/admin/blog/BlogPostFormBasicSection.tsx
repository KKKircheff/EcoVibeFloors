'use client';

import { useState } from 'react';
import { Stack, TextField, MenuItem, Typography, Divider, IconButton, Button, Box } from '@mui/material';
import { Control, Controller, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { DeleteOutlined as DeleteIcon, AddOutlined as AddIcon } from '@mui/icons-material';
import { getFirebaseStorageUrl } from '@/lib/utils/getStorageUrl';
import Image from 'next/image';
import { BlogPostFormValues } from './BlogPostForm';
import { getAllAuthorSlugs } from '@/lib/authors/authors';

interface Props {
    control: Control<BlogPostFormValues>;
}

/** Hero image preview with broken-image fallback */
function HeroImagePreview({ path }: { path: string }) {
    const [error, setError] = useState(false);
    const url = path ? getFirebaseStorageUrl(path) : null;

    if (!url || error) {
        if (error) {
            return (
                <Box sx={{ width: '50%', borderRadius: 1, p: 1.5, bgcolor: 'grey.100', border: '1px dashed', borderColor: 'error.main' }}>
                    <Typography variant="caption" color="error">
                        Image not found — check the path
                    </Typography>
                </Box>
            );
        }
        return null;
    }

    return (
        <Box sx={{ width: '50%', position: 'relative', borderRadius: 1, overflow: 'hidden', bgcolor: 'grey.100' }}>
            <Image
                src={url}
                alt="Hero preview"
                width={400}
                height={200}
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onError={() => setError(true)}
            />
        </Box>
    );
}

export function BlogPostFormBasicSection({ control }: Props) {
    const t = useTranslations('admin.blog.form');

    const CATEGORY_OPTIONS = [
        { value: 'engineered-parquet', label: t('categories.engineered-parquet') },
        { value: 'hybrid', label: t('categories.hybrid') },
        { value: 'spc-lvt', label: t('categories.spc-lvt') },
        { value: 'comparison', label: t('categories.comparison') },
        { value: 'brand', label: t('categories.brand') },
    ];

    const POST_TYPE_OPTIONS = [
        { value: 'pillar', label: t('postTypes.pillar') },
        { value: 'cluster', label: t('postTypes.cluster') },
        { value: 'cross-pillar', label: t('postTypes.cross-pillar') },
        { value: 'brand', label: t('postTypes.brand') },
    ];

    const SCHEMA_TYPE_OPTIONS = [
        { value: 'Article', label: t('schemaTypes.Article') },
        { value: 'HowTo', label: t('schemaTypes.HowTo') },
        { value: 'FAQPage', label: t('schemaTypes.FAQPage') },
    ];

    const MENTION_TYPE_OPTIONS = [
        { value: 'Brand', label: t('mentionTypes.Brand') },
        { value: 'Product', label: t('mentionTypes.Product') },
    ];

    const AUTHOR_OPTIONS = getAllAuthorSlugs().map((slug) => ({ value: slug, label: slug }));

    const { fields: fpFields, append: fpAppend, remove: fpRemove } = useFieldArray({ control, name: 'featuredProducts' });
    const { fields: mFields, append: mAppend, remove: mRemove } = useFieldArray({ control, name: 'mentions' });

    return (
        <Stack spacing={3}>
            <Typography variant="subtitle1" fontWeight={600}>{t('basicInfo')}</Typography>
            <Divider />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                    name="slug"
                    control={control}
                    rules={{ required: t('slugRequired') }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={t('slug')}
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />
                <Controller
                    name="strategyId"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('strategyId')}
                            size="small"
                            fullWidth
                        />
                    )}
                />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                    name="postType"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label={t('postType')}
                            size="small"
                            fullWidth
                        >
                            {POST_TYPE_OPTIONS.map((o) => (
                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />
                <Controller
                    name="category"
                    control={control}
                    rules={{ required: t('categoryRequired') }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            select
                            label={t('category')}
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        >
                            {CATEGORY_OPTIONS.map((c) => (
                                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />
                <Controller
                    name="schemaType"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label={t('schemaType')}
                            size="small"
                            fullWidth
                        >
                            {SCHEMA_TYPE_OPTIONS.map((s) => (
                                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />
            </Stack>

            <Controller
                name="heroImage"
                control={control}
                render={({ field }) => (
                    <Stack spacing={1}>
                        <TextField
                            {...field}
                            label={t('heroImage')}
                            size="small"
                            fullWidth
                        />
                        <HeroImagePreview path={field.value} />
                    </Stack>
                )}
            />

            <Controller
                name="author"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label={t('author')}
                        size="small"
                        sx={{ maxWidth: 300 }}
                    >
                        <MenuItem value="">{t('authorNone')}</MenuItem>
                        {AUTHOR_OPTIONS.map((o) => (
                            <MenuItem key={o.value} value={o.value}>{o.value}</MenuItem>
                        ))}
                    </TextField>
                )}
            />

            {/* Internal Linking */}
            <Typography variant="subtitle1" fontWeight={600} sx={{ mt: 2 }}>{t('relationships')}</Typography>
            <Divider />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                    name="isPartOf"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('isPartOf')}
                            size="small"
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name="hasPart"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('hasPart')}
                            size="small"
                            fullWidth
                        />
                    )}
                />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                    name="linksTo"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('linksTo')}
                            size="small"
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name="relatedPostSlugs"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('relatedPostSlugs')}
                            size="small"
                            fullWidth
                        />
                    )}
                />
            </Stack>

            {/* Featured Products */}
            <Typography variant="subtitle2" fontWeight={600}>{t('featuredProducts')}</Typography>
            {fpFields.map((item, index) => (
                <Stack key={item.id} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
                    <Controller
                        name={`featuredProducts.${index}.name`}
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label={t('featuredProductName')} size="small" fullWidth />
                        )}
                    />
                    <Controller
                        name={`featuredProducts.${index}.brand`}
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label={t('featuredProductBrand')} size="small" fullWidth />
                        )}
                    />
                    <Controller
                        name={`featuredProducts.${index}.slug`}
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label={t('featuredProductSlug')} size="small" fullWidth />
                        )}
                    />
                    <IconButton size="small" onClick={() => fpRemove(index)} color="error">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            ))}
            <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => fpAppend({ name: '', brand: '', slug: '' })}
            >
                {t('addFeaturedProduct')}
            </Button>

            {/* Mentions */}
            <Typography variant="subtitle2" fontWeight={600}>{t('mentions')}</Typography>
            {mFields.map((item, index) => (
                <Stack key={item.id} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
                    <Controller
                        name={`mentions.${index}.type`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label={t('mentionType')}
                                size="small"
                                sx={{ minWidth: 140 }}
                            >
                                {MENTION_TYPE_OPTIONS.map((o) => (
                                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                    <Controller
                        name={`mentions.${index}.name`}
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label={t('mentionName')} size="small" fullWidth />
                        )}
                    />
                    <IconButton size="small" onClick={() => mRemove(index)} color="error">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            ))}
            <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => mAppend({ type: 'Brand', name: '' })}
            >
                {t('addMention')}
            </Button>
        </Stack>
    );
}