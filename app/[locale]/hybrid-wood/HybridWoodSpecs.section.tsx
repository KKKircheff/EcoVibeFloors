import 'server-only';
import { getTranslations } from 'next-intl/server';
import { ProductSpecs } from '@/components/ui/sections/product';

export async function HybridWoodSpecs() {
    const t = await getTranslations('hybridWood');

    const specCategories = [
        {
            titleKey: 'specifications.technical.title',
            specs: [
                { label: t('specifications.technical.thickness'), value: '1.1mm' },
                { label: t('specifications.technical.thermalResistance'), value: '0.07m² K/W' },
                { label: t('specifications.technical.wearLayer'), value: t('specifications.technical.realOak') },
                { label: t('specifications.technical.core'), value: 'HDF' }
            ]
        },
        {
            titleKey: 'specifications.installation.title',
            specs: [
                { label: t('specifications.installation.method'), value: t('specifications.installation.clickSystem') },
                { label: t('specifications.installation.underfloorHeating'), value: '✓' },
                { label: t('specifications.installation.floating'), value: '✓' },
                { label: t('specifications.installation.glued'), value: '✓' }
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