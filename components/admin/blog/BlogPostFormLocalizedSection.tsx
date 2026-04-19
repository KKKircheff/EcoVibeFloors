'use client';

import { Stack, TextField, MenuItem, Typography, Divider, Box, Tabs, Tab } from '@mui/material';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { BlogPostFormValues } from './BlogPostForm';
import { BlogMarkdownEditor } from './BlogMarkdownEditor';

interface Props {
    control: Control<BlogPostFormValues>;
    watch: UseFormWatch<BlogPostFormValues>;
}

function LocalePanel({
    locale,
    control,
    watch,
}: {
    locale: 'bg' | 'en';
    control: Control<BlogPostFormValues>;
    watch: UseFormWatch<BlogPostFormValues>;
}) {
    const t = useTranslations('admin.blog.form');
    const prefix = `translations.${locale}` as const;

    const STATUS_OPTIONS = [
        { value: 'draft', label: t('statuses.draft') },
        { value: 'published', label: t('statuses.published') },
        { value: 'archived', label: t('statuses.archived') },
    ];

    const wordCount = watch(`${prefix}.wordCount`);
    const readingTime = watch(`${prefix}.readingTimeMinutes`);

    return (
        <Stack spacing={3} pt={2}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                    name={`${prefix}.title`}
                    control={control}
                    rules={{ required: t('titleRequired', { locale: locale.toUpperCase() }) }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label={t('title')}
                            size="small"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />
                <Controller
                    name={`${prefix}.status`}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            select
                            label={t('status')}
                            size="small"
                            sx={{ minWidth: 150 }}
                        >
                            {STATUS_OPTIONS.map((s) => (
                                <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                    name={`${prefix}.metaDescription`}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('metaDescription')}
                            size="small"
                            multiline
                            minRows={2}
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name={`${prefix}.primaryKeyword`}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('primaryKeyword')}
                            size="small"
                            fullWidth
                        />
                    )}
                />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <Controller
                    name={`${prefix}.tags`}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('tags')}
                            size="small"
                            fullWidth
                        />
                    )}
                />
                <Controller
                    name={`${prefix}.datePublished`}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={t('datePublished')}
                            type="datetime-local"
                            size="small"
                            sx={{ minWidth: 220 }}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    )}
                />
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                    label={t('wordCount')}
                    value={wordCount}
                    size="small"
                    slotProps={{ input: { readOnly: true } }}
                    helperText={t('autoCalculated')}
                    sx={{ maxWidth: 150 }}
                />
                <TextField
                    label={t('readingTime')}
                    value={readingTime}
                    size="small"
                    slotProps={{ input: { readOnly: true } }}
                    helperText={t('autoCalculated')}
                    sx={{ maxWidth: 150 }}
                />
            </Stack>

            <Divider />

            {/* Markdown editor */}
            <Controller
                name={`${prefix}.contentMarkdown`}
                control={control}
                render={({ field }) => (
                    <BlogMarkdownEditor
                        value={field.value}
                        onChange={field.onChange}
                    />
                )}
            />
        </Stack>
    );
}

export function BlogPostFormLocalizedSection({ control, watch }: Props) {
    const t = useTranslations('admin.blog.form');
    const [tab, setTab] = useState(0);

    return (
        <Stack spacing={2}>
            <Typography variant="subtitle1" fontWeight={600}>{t('content')}</Typography>
            <Divider />

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label={t('tabBulgarian')} />
                    <Tab label={t('tabEnglish')} />
                </Tabs>
            </Box>

            {tab === 0 && (
                <LocalePanel locale="bg" control={control} watch={watch} />
            )}
            {tab === 1 && (
                <LocalePanel locale="en" control={control} watch={watch} />
            )}
        </Stack>
    );
}