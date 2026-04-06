'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Stack, Button, Alert, CircularProgress, Divider } from '@mui/material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ProductFormBasicSection } from './ProductFormBasicSection';
import { ProductFormLocalizedSection } from './ProductFormLocalizedSection';
import { ProductFormSpecsSection } from './ProductFormSpecsSection';
import { ProductImageManager } from './ProductImageManager';
import { Product } from '@/types/products';
import { ProductsDB } from '@/lib/firebase/db';
import { useState } from 'react';

// Flat form shape — avoids deeply nested react-hook-form issues with optional objects
export interface ProductFormValues {
    sku: string;
    slug: string;
    collection: string;
    pattern: string;
    installationSystem: 'click' | 'glue' | 'glue-down';
    price: number;
    status: 'draft' | 'published' | 'archived';

    // Localized content
    i18n: {
        bg: {
            name: string;
            description: string;
            features: string[];
            seo: { title: string; description: string; keywords: string[] };
        };
        en: {
            name: string;
            description: string;
            features: string[];
            seo: { title: string; description: string; keywords: string[] };
        };
    };

    // Specifications (all optional strings for the form)
    specifications: {
        dimensions: { length: string; width: string; thickness: string };
        appearance: {
            colorCode: string;
            gradeCode: string;
            finishCode: string;
            structureCode: string;
            materialCode: string;
        };
        installation: {
            methodCode: string;
            vGroove: string;
            clickSystem: string;
            coveragePerPack: string;
        };
        performance: {
            underfloorHeatingCode: string;
            waterResistanceCode: string;
            thermalResistance: string;
        };
        certifications: {
            qualityMark: string;
            countryCode: string;
            emissions: string;
            environmental: string;
            safety: string;
        };
    };

    images: string[];
}

function productToFormValues(product: Product): ProductFormValues {
    const specs = product.specifications ?? {};
    return {
        sku: product.sku ?? '',
        slug: product.slug ?? '',
        collection: product.collection ?? '',
        pattern: product.pattern ?? '',
        installationSystem: product.installationSystem ?? 'click',
        price: product.price ?? 0,
        status: (product.metadata?.status as ProductFormValues['status']) ?? 'published',
        i18n: {
            bg: {
                name: product.i18n?.bg?.name ?? '',
                description: product.i18n?.bg?.description ?? '',
                features: product.i18n?.bg?.features ?? [],
                seo: {
                    title: product.i18n?.bg?.seo?.title ?? '',
                    description: product.i18n?.bg?.seo?.description ?? '',
                    keywords: Array.isArray(product.i18n?.bg?.seo?.keywords)
                        ? (product.i18n.bg.seo.keywords as string[])
                        : typeof product.i18n?.bg?.seo?.keywords === 'string'
                          ? [product.i18n.bg.seo.keywords]
                          : [],
                },
            },
            en: {
                name: product.i18n?.en?.name ?? '',
                description: product.i18n?.en?.description ?? '',
                features: product.i18n?.en?.features ?? [],
                seo: {
                    title: product.i18n?.en?.seo?.title ?? '',
                    description: product.i18n?.en?.seo?.description ?? '',
                    keywords: Array.isArray(product.i18n?.en?.seo?.keywords)
                        ? (product.i18n.en.seo.keywords as string[])
                        : typeof product.i18n?.en?.seo?.keywords === 'string'
                          ? [product.i18n.en.seo.keywords]
                          : [],
                },
            },
        },
        specifications: {
            dimensions: {
                length: specs.dimensions?.length ?? '',
                width: specs.dimensions?.width ?? '',
                thickness: specs.dimensions?.thickness ?? '',
            },
            appearance: {
                colorCode: specs.appearance?.colorCode ?? '',
                gradeCode: specs.appearance?.gradeCode ?? '',
                finishCode: specs.appearance?.finishCode ?? '',
                structureCode: specs.appearance?.structureCode ?? '',
                materialCode: specs.appearance?.materialCode ?? '',
            },
            installation: {
                methodCode: specs.installation?.methodCode ?? '',
                vGroove: specs.installation?.vGroove ?? '',
                clickSystem: specs.installation?.clickSystem ?? '',
                coveragePerPack: specs.installation?.coveragePerPack ?? '',
            },
            performance: {
                underfloorHeatingCode: specs.performance?.underfloorHeatingCode ?? '',
                waterResistanceCode: specs.performance?.waterResistanceCode ?? '',
                thermalResistance: specs.performance?.thermalResistance ?? '',
            },
            certifications: {
                qualityMark: (specs.certifications?.qualityMark as string) ?? '',
                countryCode: (specs.certifications?.countryCode as string) ?? '',
                emissions: Array.isArray(specs.certifications?.emissions)
                    ? specs.certifications.emissions.join(', ')
                    : (specs.certifications?.emissions as string) ?? '',
                environmental: Array.isArray(specs.certifications?.environmental)
                    ? specs.certifications.environmental.join(', ')
                    : (specs.certifications?.environmental as string) ?? '',
                safety: Array.isArray(specs.certifications?.safety)
                    ? specs.certifications.safety.join(', ')
                    : (specs.certifications?.safety as string) ?? '',
            },
        },
        images: product.images ?? [],
    };
}

function formValuesToProduct(values: ProductFormValues): Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
    const { specifications: s } = values;

    // Strip empty strings from spec objects so Firestore stays clean
    const trimObj = (obj: Record<string, string>) =>
        Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== ''));

    return {
        sku: values.sku,
        slug: values.slug,
        collection: values.collection,
        pattern: values.pattern as Product['pattern'],
        installationSystem: values.installationSystem,
        price: Number(values.price),
        imageAlt: { en: '', bg: '' },
        i18n: {
            bg: {
                name: values.i18n.bg.name,
                description: values.i18n.bg.description,
                features: values.i18n.bg.features.filter(Boolean),
                seo: {
                    title: values.i18n.bg.seo.title,
                    description: values.i18n.bg.seo.description,
                    keywords: values.i18n.bg.seo.keywords.filter(Boolean),
                },
            },
            en: {
                name: values.i18n.en.name,
                description: values.i18n.en.description,
                features: values.i18n.en.features.filter(Boolean),
                seo: {
                    title: values.i18n.en.seo.title,
                    description: values.i18n.en.seo.description,
                    keywords: values.i18n.en.seo.keywords.filter(Boolean),
                },
            },
        },
        specifications: {
            dimensions: trimObj(s.dimensions) as Product['specifications'] extends infer T
                ? T extends object
                    ? never
                    : never
                : never,
            appearance: trimObj(s.appearance),
            installation: trimObj(s.installation),
            performance: trimObj(s.performance),
            certifications: trimObj(s.certifications),
        },
        images: values.images,
        metadata: {
            totalImages: values.images.length,
            imageSizes: ['thumbnail', 'full'],
            createdAt: new Date().toISOString(),
            status: values.status,
        },
    };
}

const defaultValues: ProductFormValues = {
    sku: '',
    slug: '',
    collection: 'oak',
    pattern: 'plank',
    installationSystem: 'glue',
    price: 0,
    status: 'draft',
    i18n: {
        bg: { name: '', description: '', features: [], seo: { title: '', description: '', keywords: [] } },
        en: { name: '', description: '', features: [], seo: { title: '', description: '', keywords: [] } },
    },
    specifications: {
        dimensions: { length: '', width: '', thickness: '' },
        appearance: { colorCode: '', gradeCode: '', finishCode: '', structureCode: '', materialCode: '' },
        installation: { methodCode: '', vGroove: '', clickSystem: '', coveragePerPack: '' },
        performance: { underfloorHeatingCode: '', waterResistanceCode: '', thermalResistance: '' },
        certifications: { qualityMark: '', countryCode: '', emissions: '', environmental: '', safety: '' },
    },
    images: [],
};

interface ProductFormProps {
    // Pass existing product to edit; omit for create
    initialProduct?: Product;
}

export function ProductForm({ initialProduct }: ProductFormProps) {
    const router = useRouter();
    const t = useTranslations('admin.products');
    const isEdit = !!initialProduct;

    const { control, handleSubmit, watch, setValue, reset } = useForm<ProductFormValues>({
        defaultValues: initialProduct ? productToFormValues(initialProduct) : defaultValues,
    });

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Keep form in sync if initialProduct changes (e.g. after data loads)
    useEffect(() => {
        if (initialProduct) reset(productToFormValues(initialProduct));
    }, [initialProduct, reset]);

    const watchedSku = watch('sku');
    const watchedCollection = watch('collection');
    const watchedPattern = watch('pattern');
    const watchedImages = watch('images');

    const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        const productData = formValuesToProduct(values);

        let result;
        if (isEdit) {
            result = await ProductsDB.update(values.sku, productData);
        } else {
            result = await ProductsDB.createWithId(values.sku, productData);
        }

        setSaving(false);

        if (!result.success) {
            setSaveError(result.error ?? 'Failed to save product');
        } else {
            setSaveSuccess(true);
            if (!isEdit) {
                router.push(`/admin/products/${values.sku}/edit`);
            }
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

            <ProductFormBasicSection control={control} />

            <Divider />

            <ProductFormLocalizedSection control={control} />

            <Divider />

            <ProductFormSpecsSection control={control} />

            <Divider />

            <ProductImageManager
                collection={watchedCollection}
                pattern={watchedPattern}
                sku={watchedSku}
                images={watchedImages}
                onChange={(imgs) => setValue('images', imgs)}
            />

            <Stack direction="row" spacing={2} pt={1}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={18} /> : undefined}
                >
                    {saving ? t('saving') : isEdit ? t('saveChanges') : t('createProduct')}
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => router.push('/admin/products')}
                    disabled={saving}
                >
                    {t('cancel')}
                </Button>
            </Stack>
        </Stack>
    );
}
