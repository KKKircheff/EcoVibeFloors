import 'server-only';
import { getTranslations } from 'next-intl/server';
import { ProductSpecs } from '@/components/ui/sections/product';

export async function HybridWoodSpecs() {
    const t = await getTranslations('hybridWood');

    const specCategories = [
        {
            titleKey: 'specifications.technical.title',
            specs: [
                { label: t('specifications.technical.thickness'), value: t('specifications.technical.values.thickness') },
                { label: t('specifications.technical.thermalResistance'), value: t('specifications.technical.values.thermalResistance') },
                { label: t('specifications.technical.wearLayer'), value: t('specifications.technical.realOak') },
                { label: t('specifications.technical.core'), value: t('specifications.technical.values.core') }
            ]
        },
        {
            titleKey: 'specifications.installation.title',
            specs: [
                { label: t('specifications.installation.method'), value: t('specifications.installation.clickSystem') },
                { label: t('specifications.installation.underfloorHeating'), value: t('specifications.installation.values.compatible') },
                { label: t('specifications.installation.floating'), value: t('specifications.installation.values.compatible') },
                { label: t('specifications.installation.glued'), value: t('specifications.installation.values.compatible') }
            ]
        }
    ];

    return (
        <ProductSpecs
            translationKey="hybridWood"
            specCategories={specCategories}
        />
    );
}