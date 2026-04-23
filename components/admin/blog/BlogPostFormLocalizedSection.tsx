'use client';

import { Stack, TextField, MenuItem, Typography, Divider, Box, Tabs, Tab, IconButton, Button } from '@mui/material';
import { Control, Controller, UseFormWatch, useFieldArray } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DeleteOutlined as DeleteIcon, AddOutlined as AddIcon } from '@mui/icons-material';
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

    const { fields: srcFields, append: srcAppend, remove: srcRemove } = useFieldArray({ control, name: `${prefix}.sources` as 'translations.bg.sources' });
    const { fields: faqFields, append: faqAppend, remove: faqRemove } = useFieldArray({ control, name: `${prefix}.faq` as 'translations.bg.faq' });

    const SOURCE_TYPE_OPTIONS = [
        { value: '', label: t('sourceTypeNone') },
        { value: 'product-doc', label: t('sourceTypes.product-doc') },
        { value: 'standard', label: t('sourceTypes.standard') },
        { value: 'article', label: t('sourceTypes.article') },
        { value: 'research', label: t('sourceTypes.research') },
    ];

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

            {/* Hero image alt text */}
            <Controller
                name={`${prefix}.heroImageAlt`}
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label={t('heroImageAlt')}
                        size="small"
                        fullWidth
                    />
                )}
            />

            {/* Sources */}
            <Typography variant="subtitle2" fontWeight={600}>{t('sources')}</Typography>
            {srcFields.map((item, index) => (
                <Stack key={item.id} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
                    <Controller
                        name={`${prefix}.sources.${index}.label` as 'translations.bg.sources.0.label'}
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label={t('sourceLabel')} size="small" fullWidth />
                        )}
                    />
                    <Controller
                        name={`${prefix}.sources.${index}.url` as 'translations.bg.sources.0.url'}
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label={t('sourceUrl')} size="small" fullWidth />
                        )}
                    />
                    <Controller
                        name={`${prefix}.sources.${index}.type` as 'translations.bg.sources.0.type'}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label={t('sourceType')}
                                size="small"
                                sx={{ minWidth: 150 }}
                            >
                                {SOURCE_TYPE_OPTIONS.map((o) => (
                                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                    <IconButton size="small" onClick={() => srcRemove(index)} color="error">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Stack>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={() => srcAppend({ label: '', url: '', type: undefined })}>
                {t('addSource')}
            </Button>

            {/* FAQ items */}
            <Typography variant="subtitle2" fontWeight={600}>{t('faq')}</Typography>
            {faqFields.map((item, index) => (
                <Stack key={item.id} spacing={1}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="flex-start">
                        <Controller
                            name={`${prefix}.faq.${index}.question` as 'translations.bg.faq.0.question'}
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label={t('faqQuestion')} size="small" fullWidth />
                            )}
                        />
                        <Controller
                            name={`${prefix}.faq.${index}.anchor` as 'translations.bg.faq.0.anchor'}
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label={t('faqAnchor')} size="small" sx={{ minWidth: 160 }} />
                            )}
                        />
                        <IconButton size="small" onClick={() => faqRemove(index)} color="error">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                    <Controller
                        name={`${prefix}.faq.${index}.answer` as 'translations.bg.faq.0.answer'}
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label={t('faqAnswer')} size="small" fullWidth multiline minRows={2} />
                        )}
                    />
                </Stack>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={() => faqAppend({ question: '', answer: '', anchor: '' })}>
                {t('addFaqItem')}
            </Button>

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