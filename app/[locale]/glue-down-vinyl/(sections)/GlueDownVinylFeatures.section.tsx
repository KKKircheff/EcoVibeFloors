import 'server-only';
import { Grid } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { MdWaterDrop, MdShield, MdEco, MdConstruction, MdBuild, MdVolumeDown } from 'react-icons/md';
import { FeatureIconCard } from '@/components/ui/card/FeatureIconCard';

export async function GlueDownVinylFeatures() {
    const t = await getTranslations('glueDownVinyl');

    const featuresConfig = [
        {
            icon: <MdWaterDrop size={60} />,
            titleKey: 'features.waterproof.title',
            descriptionKey: 'features.waterproof.description',
            iconColor: 'primary' as const
        },
        {
            icon: <MdShield size={60} />,
            titleKey: 'features.warranty.title',
            descriptionKey: 'features.warranty.description',
            iconColor: 'primary' as const
        },
        {
            icon: <MdEco size={60} />,
            titleKey: 'features.ecoFriendly.title',
            descriptionKey: 'features.ecoFriendly.description',
            iconColor: 'primary' as const
        },
        {
            icon: <MdConstruction size={60} />,
            titleKey: 'features.durability.title',
            descriptionKey: 'features.durability.description',
            iconColor: 'primary' as const
        },
        {
            icon: <MdBuild size={60} />,
            titleKey: 'features.installation.title',
            descriptionKey: 'features.installation.description',
            iconColor: 'primary' as const
        },
        {
            icon: <MdVolumeDown size={60} />,
            titleKey: 'features.soundInsulation.title',
            descriptionKey: 'features.soundInsulation.description',
            iconColor: 'primary' as const
        }
    ];

    return (
        <Grid container spacing={{ xs: 6, md: 4 }}>
            {featuresConfig.map((feature, index) => (
                <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
                    <FeatureIconCard
                        icon={feature.icon}
                        title={t(feature.titleKey)}
                        description={t(feature.descriptionKey)}
                        iconColor={feature.iconColor}
                    />
                </Grid>
            ))}
        </Grid>
    );
}