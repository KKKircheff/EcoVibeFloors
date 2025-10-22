import 'server-only';
import { Grid } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { FeatureIconCard } from '@/components/ui/card/FeatureIconCard';
import { TreeIcon } from '@/components/icons/TreeIcon';
import { ScratchIcon } from '@/components/icons/ScratchIcon';
import { HeatingIcon } from '@/components/icons/HeatingIcon';
import { GoShieldCheck } from "react-icons/go";
import { IoDiamondOutline } from "react-icons/io5";
import { LuPaintbrush } from "react-icons/lu";

export async function OakFeatures() {
    const t = await getTranslations('oak.features');

    const featuresConfig = [
        {
            icon: <TreeIcon size={56} />,
            titleKey: 'naturalBeauty.title',
            descriptionKey: 'naturalBeauty.description',
            iconColor: 'primary' as const
        },
        {
            icon: <LuPaintbrush size={52} />,
            titleKey: 'customizable.title',
            descriptionKey: 'customizable.description',
            iconColor: 'primary' as const
        },
        {
            icon: <ScratchIcon size={68} />,
            titleKey: 'durable.title',
            descriptionKey: 'durable.description',
            iconColor: 'primary' as const
        },
        {
            icon: <HeatingIcon size={50} />,
            titleKey: 'underfloorHeating.title',
            descriptionKey: 'underfloorHeating.description',
            iconColor: 'primary' as const
        },
        {
            icon: <GoShieldCheck size={52} />,
            titleKey: 'warranty.title',
            descriptionKey: 'warranty.description',
            iconColor: 'primary' as const
        },
        {
            icon: <IoDiamondOutline size={52} />,
            titleKey: 'dutchQuality.title',
            descriptionKey: 'dutchQuality.description',
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
