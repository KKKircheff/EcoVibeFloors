'use client';

import { Stack, TextField, Typography, Divider, Tabs, Tab, Box } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { ProductFormValues } from './ProductForm';

interface Props {
    control: Control<ProductFormValues>;
}

function LocalePanel({
    control,
    locale,
}: {
    control: Control<ProductFormValues>;
    locale: 'bg' | 'en';
}) {
    const t = useTranslations('admin.form');
    const prefix = `i18n.${locale}` as const;

    return (
        <Stack spacing={2} pt={2}>
            <Controller
                name={`${prefix}.name`}
                control={control}
                rules={{ required: t('nameRequired', { locale: locale.toUpperCase() }) }}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        label={t('name')}
                        size="small"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )}
            />
            <Controller
                name={`${prefix}.description`}
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={t('description')}
                        size="small"
                        fullWidth
                        multiline
                        minRows={3}
                    />
                )}
            />
            <Controller
                name={`${prefix}.features`}
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={t('features')}
                        size="small"
                        fullWidth
                        multiline
                        minRows={3}
                        value={Array.isArray(field.value) ? field.value.join('\n') : (field.value ?? '')}
                        onChange={(e) => field.onChange(e.target.value.split('\n'))}
                        helperText={t('featuresHelp')}
                    />
                )}
            />
            <Typography variant="body2" fontWeight={500} color="text.secondary">{t('seo')}</Typography>
            <Controller
                name={`${prefix}.seo.title`}
                control={control}
                render={({ field }) => (
                    <TextField {...field} label={t('seoTitle')} size="small" fullWidth />
                )}
            />
            <Controller
                name={`${prefix}.seo.description`}
                control={control}
                render={({ field }) => (
                    <TextField {...field} label={t('seoDescription')} size="small" fullWidth multiline minRows={2} />
                )}
            />
            <Controller
                name={`${prefix}.seo.keywords`}
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={t('seoKeywords')}
                        size="small"
                        fullWidth
                        value={Array.isArray(field.value) ? field.value.join(', ') : (field.value ?? '')}
                        onChange={(e) => field.onChange(e.target.value.split(',').map((k) => k.trim()))}
                    />
                )}
            />
        </Stack>
    );
}

export function ProductFormLocalizedSection({ control }: Props) {
    const t = useTranslations('admin.form');
    const locale = useLocale();
    const [tab, setTab] = useState(locale === 'en' ? 1 : 0);

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>{t('content')}</Typography>
            <Divider />
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                <Tab label={t('tabBulgarian')} />
                <Tab label={t('tabEnglish')} />
            </Tabs>
            <Box>
                {tab === 0 && <LocalePanel control={control} locale="bg" />}
                {tab === 1 && <LocalePanel control={control} locale="en" />}
            </Box>
        </Stack>
    );
}
