'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { Stack, Button, Alert, CircularProgress, Divider } from '@mui/material';
import { useTranslations } from 'next-intl';
import { BlogPostFormBasicSection } from './BlogPostFormBasicSection';
import { BlogPostFormLocalizedSection } from './BlogPostFormLocalizedSection';
import { BlogPost, BlogFeaturedProduct, BlogMention } from '@/lib/types/blog';
import { BlogPostsDB } from '@/lib/firebase/db';
import { revalidateBlogPost } from '@/app/[locale]/admin/(protected)/actions';

export interface BlogPostFormValues {
    slug: string;
    strategyId: string;
    postType: 'pillar' | 'cluster' | 'cross-pillar' | 'brand';
    category: BlogPost['category'];
    schemaType: 'Article' | 'HowTo' | 'FAQPage';
    heroImage: string;

    // Relationships — stored as comma-separated strings in the form
    isPartOf: string;
    hasPart: string;
    linksTo: string;
    relatedPostSlugs: string;

    featuredProducts: BlogFeaturedProduct[];
    mentions: BlogMention[];

    translations: {
        bg: BlogTranslationFormValues;
        en: BlogTranslationFormValues;
    };
}

export interface BlogTranslationFormValues {
    title: string;
    metaDescription: string;
    primaryKeyword: string;
    tags: string; // comma-separated in form
    contentMarkdown: string;
    wordCount: number;
    readingTimeMinutes: number;
    status: 'draft' | 'published' | 'archived';
    datePublished: string; // ISO datetime string
}

/** Safely convert Firestore Timestamp / Date / null to ISO string for the form */
function toISOStr(v: unknown): string {
    if (!v) return '';
    if (v instanceof Date) return v.toISOString().slice(0, 16);
    if (typeof v === 'object' && v !== null && 'toDate' in v) {
        return (v as { toDate: () => Date }).toDate().toISOString().slice(0, 16);
    }
    return '';
}

function blogPostToFormValues(post: BlogPost): BlogPostFormValues {
    return {
        slug: post.slug ?? '',
        strategyId: post.strategyId ?? '',
        postType: post.postType ?? 'pillar',
        category: post.category ?? 'engineered-parquet',
        schemaType: post.schemaType ?? 'Article',
        heroImage: post.heroImage ?? '',
        isPartOf: post.isPartOf ?? '',
        hasPart: post.hasPart?.join(', ') ?? '',
        linksTo: post.linksTo?.join(', ') ?? '',
        relatedPostSlugs: post.relatedPostSlugs?.join(', ') ?? '',
        featuredProducts: post.featuredProducts ?? [],
        mentions: post.mentions ?? [],
        translations: {
            bg: {
                title: post.translations?.bg?.title ?? '',
                metaDescription: post.translations?.bg?.metaDescription ?? '',
                primaryKeyword: post.translations?.bg?.primaryKeyword ?? '',
                tags: post.translations?.bg?.tags?.join(', ') ?? '',
                contentMarkdown: post.translations?.bg?.contentMarkdown ?? '',
                wordCount: post.translations?.bg?.wordCount ?? 0,
                readingTimeMinutes: post.translations?.bg?.readingTimeMinutes ?? 0,
                status: post.translations?.bg?.status ?? 'draft',
                datePublished: toISOStr(post.translations?.bg?.datePublished),
            },
            en: {
                title: post.translations?.en?.title ?? '',
                metaDescription: post.translations?.en?.metaDescription ?? '',
                primaryKeyword: post.translations?.en?.primaryKeyword ?? '',
                tags: post.translations?.en?.tags?.join(', ') ?? '',
                contentMarkdown: post.translations?.en?.contentMarkdown ?? '',
                wordCount: post.translations?.en?.wordCount ?? 0,
                readingTimeMinutes: post.translations?.en?.readingTimeMinutes ?? 0,
                status: post.translations?.en?.status ?? 'draft',
                datePublished: toISOStr(post.translations?.en?.datePublished),
            },
        },
    };
}

function formValuesToBlogPost(values: BlogPostFormValues): Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: unknown; updatedAt?: unknown } {
    const commaToArr = (s: string) => s.split(',').map((v) => v.trim()).filter(Boolean);

    const buildTranslation = (locale: 'bg' | 'en') => {
        const t = values.translations[locale];
        const words = t.contentMarkdown.trim().split(/\s+/).filter(Boolean).length;
        return {
            title: t.title,
            metaDescription: t.metaDescription,
            primaryKeyword: t.primaryKeyword,
            tags: commaToArr(t.tags),
            contentMarkdown: t.contentMarkdown,
            wordCount: words,
            readingTimeMinutes: Math.max(1, Math.ceil(words / 200)),
            inLanguage: locale,
            status: t.status,
            datePublished: t.datePublished ? new Date(t.datePublished) : null,
        };
    };

    const translations: BlogPost['translations'] = {};
    if (values.translations.bg.title) translations.bg = buildTranslation('bg') as BlogPost['translations']['bg'];
    if (values.translations.en.title) translations.en = buildTranslation('en') as BlogPost['translations']['en'];

    return {
        slug: values.slug,
        strategyId: values.strategyId,
        postType: values.postType,
        category: values.category,
        schemaType: values.schemaType,
        heroImage: values.heroImage,
        isPartOf: values.isPartOf || null,
        hasPart: commaToArr(values.hasPart),
        linksTo: commaToArr(values.linksTo),
        relatedPostSlugs: commaToArr(values.relatedPostSlugs),
        featuredProducts: values.featuredProducts,
        mentions: values.mentions,
        translations,
    };
}

const defaultValues: BlogPostFormValues = {
    slug: '',
    strategyId: '',
    postType: 'pillar',
    category: 'engineered-parquet',
    schemaType: 'Article',
    heroImage: '',
    isPartOf: '',
    hasPart: '',
    linksTo: '',
    relatedPostSlugs: '',
    featuredProducts: [],
    mentions: [],
    translations: {
        bg: { title: '', metaDescription: '', primaryKeyword: '', tags: '', contentMarkdown: '', wordCount: 0, readingTimeMinutes: 0, status: 'draft', datePublished: '' },
        en: { title: '', metaDescription: '', primaryKeyword: '', tags: '', contentMarkdown: '', wordCount: 0, readingTimeMinutes: 0, status: 'draft', datePublished: '' },
    },
};

interface BlogPostFormProps {
    initialBlogPost?: BlogPost;
    onSaveSuccess?: () => void;
}

export function BlogPostForm({ initialBlogPost, onSaveSuccess }: BlogPostFormProps) {
    const t = useTranslations('admin.blog');
    const isEdit = !!initialBlogPost;

    const { control, handleSubmit, watch, setValue, reset } = useForm<BlogPostFormValues>({
        defaultValues: initialBlogPost ? blogPostToFormValues(initialBlogPost) : defaultValues,
    });

    // Field arrays for featured products and mentions
    useFieldArray({ control, name: 'featuredProducts' });
    useFieldArray({ control, name: 'mentions' });

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Keep form in sync if initialBlogPost changes
    useEffect(() => {
        if (initialBlogPost) reset(blogPostToFormValues(initialBlogPost));
    }, [initialBlogPost, reset]);

    // Auto-compute word count and reading time for BG
    const bgMarkdown = watch('translations.bg.contentMarkdown');
    const enMarkdown = watch('translations.en.contentMarkdown');

    useEffect(() => {
        const words = bgMarkdown?.trim().split(/\s+/).filter(Boolean).length ?? 0;
        setValue('translations.bg.wordCount', words);
        setValue('translations.bg.readingTimeMinutes', Math.max(1, Math.ceil(words / 200)));
    }, [bgMarkdown, setValue]);

    useEffect(() => {
        const words = enMarkdown?.trim().split(/\s+/).filter(Boolean).length ?? 0;
        setValue('translations.en.wordCount', words);
        setValue('translations.en.readingTimeMinutes', Math.max(1, Math.ceil(words / 200)));
    }, [enMarkdown, setValue]);

    const onSubmit: SubmitHandler<BlogPostFormValues> = async (values) => {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        const postData = formValuesToBlogPost(values);
        let result;
        if (isEdit) {
            result = await BlogPostsDB.update(values.slug, postData as Partial<BlogPost>);
        } else {
            result = await BlogPostsDB.createWithId(values.slug, postData as Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>);
        }

        setSaving(false);

        if (!result.success) {
            setSaveError(result.error ?? 'Failed to save blog post');
        } else {
            setSaveSuccess(true);
            await revalidateBlogPost(values.slug);
            onSaveSuccess?.();
        }
    };

    return (
        <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={4}
            sx={{ maxWidth: 900 }}
        >
            {saveSuccess && <Alert severity="success">{t('savedSuccess')}</Alert>}
            {saveError && <Alert severity="error">{saveError}</Alert>}

            <BlogPostFormBasicSection control={control} />

            <Divider />

            <BlogPostFormLocalizedSection control={control} watch={watch} />

            <Stack direction="row" spacing={2} pt={1}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={18} /> : undefined}
                >
                    {saving ? t('saving') : isEdit ? t('saveChanges') : t('createPost')}
                </Button>
            </Stack>
        </Stack>
    );
}