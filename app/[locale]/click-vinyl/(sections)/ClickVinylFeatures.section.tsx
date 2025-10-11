import 'server-only';
import { getTranslations } from 'next-intl/server';
import { Typography } from '@mui/material';
import { MdWaterDrop, MdShield, MdEco, MdConstruction, MdBuild, MdVolumeDown } from 'react-icons/md';
import { ProductFeatures } from '@/components/ui/sections/product';

export async function ClickVinylFeatures() {
    const t = await getTranslations('clickVinyl');

    const featuresConfig = [
        {
            icon: <MdWaterDrop size={52} />,
            titleKey: 'features.waterproof.title',
            descriptionKey: 'features.waterproof.description',
            iconColor: 'primary' as const
        },
        {
            icon: <MdShield size={52} />,
            titleKey: 'features.warranty.title',
            descriptionKey: 'features.warranty.description',
            iconColor: 'secondary' as const
        },
        {
            icon: <MdEco size={52} />,
            titleKey: 'features.ecoFriendly.title',
            descriptionKey: 'features.ecoFriendly.description',
            iconColor: 'primary' as const
        },
        {
            icon: <MdConstruction size={52} />,
            titleKey: 'features.durability.title',
            descriptionKey: 'features.durability.description',
            iconColor: 'secondary' as const
        },
        {
            icon: <MdBuild size={52} />,
            titleKey: 'features.installation.title',
            descriptionKey: 'features.installation.description',
            iconColor: 'primary' as const
        },
        {
            icon: <MdVolumeDown size={52} />,
            titleKey: 'features.soundInsulation.title',
            descriptionKey: 'features.soundInsulation.description',
            iconColor: 'secondary' as const
        }
    ];

    return (
        <ProductFeatures
            translationKey="vinyl"
            features={featuresConfig}
            subtitle={t('features.subtitle')}
        />
    );
}