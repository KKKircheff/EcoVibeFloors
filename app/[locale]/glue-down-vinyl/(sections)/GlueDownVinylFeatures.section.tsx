import 'server-only';
import { Grid } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { FeatureIconCard } from '@/components/ui/card/FeatureIconCard';
import { TbDropletCheck } from "react-icons/tb";
import { GoShieldCheck } from 'react-icons/go';
import { TreeIcon } from '@/components/icons/TreeIcon';
import { BsSoundwave } from "react-icons/bs";
import { PiGpsFix } from "react-icons/pi";
import { ScratchIcon } from '@/components/icons/ScratchIcon';

export async function GlueDownVinylFeatures() {
    const t = await getTranslations('glueDownVinyl');

    const featuresConfig = [
        {
            icon: <TbDropletCheck size={60} />,
            titleKey: 'features.waterproof.title',
            descriptionKey: 'features.waterproof.description',
            iconColor: 'primary' as const
        },
        {
            icon: <GoShieldCheck size={60} />,
            titleKey: 'features.warranty.title',
            descriptionKey: 'features.warranty.description',
            iconColor: 'primary' as const
        },
        {
            icon: <TreeIcon size={60} />,
            titleKey: 'features.ecoFriendly.title',
            descriptionKey: 'features.ecoFriendly.description',
            iconColor: 'primary' as const
        },
        {
            icon: <ScratchIcon size={60} />,
            titleKey: 'features.durability.title',
            descriptionKey: 'features.durability.description',
            iconColor: 'primary' as const
        },
        {
            icon: <PiGpsFix size={60} />,
            titleKey: 'features.installation.title',
            descriptionKey: 'features.installation.description',
            iconColor: 'primary' as const
        },
        {
            icon: <BsSoundwave size={60} />,
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