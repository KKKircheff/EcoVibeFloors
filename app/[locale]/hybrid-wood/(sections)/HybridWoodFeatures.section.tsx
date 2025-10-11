import 'server-only';
import { Grid } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { FeatureIconCard } from '@/components/ui/card/FeatureIconCard';
import { TreeIcon } from '@/components/icons/TreeIcon';
import { WaterResistantIcon } from '@/components/icons/WaterResistantIcon';
import { ScratchIcon } from '@/components/icons/ScratchIcon';
import { HeatingIcon } from '@/components/icons/HeatingIcon';
import { GoShieldCheck } from "react-icons/go";
import { SlLayers } from "react-icons/sl";
import { TbHours24 } from "react-icons/tb";

export async function HybridWoodFeatures() {
    const t = await getTranslations('hybridWood');

    const featuresConfig = [
        {
            icon: <SlLayers size={52} />,
            titleKey: 'features.revolutionaryTech.title',
            descriptionKey: 'features.revolutionaryTech.description',
            iconColor: 'primary' as const
        },
        {
            icon: <TbHours24 size={56} />,
            titleKey: 'features.waterResistance.title',
            descriptionKey: 'features.waterResistance.description',
            iconColor: 'primary' as const
        },
        {
            icon: <ScratchIcon size={68} />,
            titleKey: 'features.scratchResistance.title',
            descriptionKey: 'features.scratchResistance.description',
            iconColor: 'primary' as const
        },
        {
            icon: <GoShieldCheck size={52} />,
            titleKey: 'features.warranty.title',
            descriptionKey: 'features.warranty.description',
            iconColor: 'primary' as const
        },
        {
            icon: <HeatingIcon size={50} />,
            titleKey: 'features.underfloorHeating.title',
            descriptionKey: 'features.underfloorHeating.description',
            iconColor: 'primary' as const
        },
        {
            icon: <TreeIcon size={56} />,
            titleKey: 'features.ecoFriendly.title',
            descriptionKey: 'features.ecoFriendly.description',
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