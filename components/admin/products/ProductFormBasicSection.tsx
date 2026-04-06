'use client';

import { Stack, TextField, MenuItem, Typography, Divider } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { ProductFormValues } from './ProductForm';

const PATTERNS = [
    'plank', 'herringbone', 'chevron',
    'classic-evo', 'noblessse-evo', 'herringbone-evo',
    'classic-olio', 'noblessse-olio', 'herringbone-olio',
    'dorpen', 'hongaarse-punt', 'landhuis',
    'walvisgraat-click', 'natuur-click', 'landhuis-click', 'tegel-click', 'visgraat-click',
];

interface Props {
    control: Control<ProductFormValues>;
}

export function ProductFormBasicSection({ control }: Props) {
    const t = useTranslations('admin.form');

    const COLLECTIONS = [
        { value: 'oak', label: t('collections.oak') },
        { value: 'hy-wood', label: t('collections.hyWood') },
        { value: 'click-vinyl', label: t('collections.clickVinyl') },
        { value: 'glue-down-vinyl', label: t('collections.glueDownVinyl') },
    ];

    const INSTALLATION_SYSTEMS = [
        { value: 'click', label: t('installationSystems.click') },
        { value: 'glue', label: t('installationSystems.glue') },
        { value: 'glue-down', label: t('installationSystems.glueDown') },
    ];

    const STATUS_OPTIONS = [
        { value: 'published', label: t('statuses.published') },
        { value: 'draft', label: t('statuses.draft') },
        { value: 'archived', label: t('statuses.archived') },
    ];
    return (
        <Stack spacing={3}>
            <Typography variant="subtitle1" fontWeight={600}>{t('basicInfo')}</Typography>
            <Divider />

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                    name="sku"
                    control={control}
                    rules={{ required: t('skuRequired') }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={t('sku')}
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />
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
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                    name="collection"
                    control={control}
                    rules={{ required: t('collectionRequired') }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            select
                            label={t('collection')}
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        >
                            {COLLECTIONS.map((c) => (
                                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />
                <Controller
                    name="pattern"
                    control={control}
                    rules={{ required: t('patternRequired') }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            select
                            label={t('pattern')}
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        >
                            {PATTERNS.map((p) => (
                                <MenuItem key={p} value={p}>{p}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />
                <Controller
                    name="installationSystem"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label={t('installationSystem')}
                            size="small"
                            fullWidth
                        >
                            {INSTALLATION_SYSTEMS.map((s) => (
                                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                    name="price"
                    control={control}
                    rules={{ required: t('priceRequired'), min: { value: 0, message: t('pricePositive') } }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={t('price')}
                            type="number"
                            size="small"
                            sx={{ maxWidth: 200 }}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            slotProps={{ htmlInput: { step: '0.01', min: '0' } }}
                        />
                    )}
                />
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label={t('status')}
                            size="small"
                            sx={{ maxWidth: 180 }}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />
            </Stack>
        </Stack>
    );
}
