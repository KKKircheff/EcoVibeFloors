import 'server-only';
import { Stack, Typography, Container, Grid } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { Ri24HoursLine } from "react-icons/ri";
import { BiLayerPlus } from "react-icons/bi";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { FeatureIconCard } from '@/components/ui/card/FeatureIconCard';

export async function HybridWoodFeatures() {
    const t = await getTranslations('hybridWood');

    const featuresConfig = [
        {
            icon: <Ri24HoursLine />,
            titleKey: 'features.waterResistance.title',
            descriptionKey: 'features.waterResistance.description',
            iconColor: 'primary' as const
        },
        {
            icon: <BiLayerPlus />,
            titleKey: 'features.scratchResistance.title',
            descriptionKey: 'features.scratchResistance.description',
            iconColor: 'primary' as const
        },
        {
            icon: <AiOutlineSafetyCertificate />,
            titleKey: 'features.warranty.title',
            descriptionKey: 'features.warranty.description',
            iconColor: 'primary' as const
        }
    ];

    return (
        <Stack spacing={6}>
            <Typography variant="h3" color="primary.main" fontWeight={600} textAlign="center">
                {t('features.title')}
            </Typography>

            <Grid container spacing={4}>
                {featuresConfig.map((feature, index) => (
                    <Grid key={index} size={{ xs: 12, md: 4 }}>
                        <FeatureIconCard
                            icon={feature.icon}
                            title={t(feature.titleKey)}
                            description={t(feature.descriptionKey)}
                            iconColor={feature.iconColor}
                        />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}