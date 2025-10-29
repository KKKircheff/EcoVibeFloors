import 'server-only';
import { getTranslations } from 'next-intl/server';
import { ProductSpecs } from '@/components/ui/sections/product';

export async function OakSpecs() {
    const t = await getTranslations('oakFlooring.specifications');

    const specCategories = [
        {
            titleKey: 'technical.title',
            specs: [
                {
                    label: t('technical.thickness'),
                    value: t('technical.values.thickness')
                },
                {
                    label: t('technical.topLayer'),
                    value: t('technical.values.topLayer')
                },
                {
                    label: t('technical.dimensions'),
                    value: t('technical.values.dimensions')
                },
                {
                    label: t('technical.usageClass'),
                    value: t('technical.values.usageClass')
                }
            ]
        },
        {
            titleKey: 'installation.title',
            specs: [
                {
                    label: t('installation.method'),
                    value: t('installation.values.method')
                },
                {
                    label: t('installation.vGroove'),
                    value: t('installation.values.vGroove')
                },
                {
                    label: t('installation.coverage'),
                    value: t('installation.values.coverage')
                }
            ]
        },
        {
            titleKey: 'performance.title',
            specs: [
                {
                    label: t('performance.underfloorHeating'),
                    value: t('performance.values.underfloorHeating')
                },
                {
                    label: t('performance.warranty'),
                    value: t('performance.values.warranty')
                },
                {
                    label: t('performance.origin'),
                    value: t('performance.values.origin')
                }
            ]
        }
    ];

    return (
        <ProductSpecs
            translationKey="oakFlooring.specifications"
            specCategories={specCategories}
            title={t('title')}
        />
    );
}
