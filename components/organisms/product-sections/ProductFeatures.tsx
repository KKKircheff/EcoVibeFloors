import 'server-only';
import { Stack, Typography, Grid } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { ReactNode } from 'react';
import { FeatureIconCard } from '@/components/ui/card/FeatureIconCard';

export interface FeatureConfig {
    icon: ReactNode;
    titleKey: string;
    descriptionKey: string;
    iconColor?: 'primary' | 'secondary';
}

export interface ProductFeaturesProps {
    translationKey: string;
    features: FeatureConfig[];
    title?: string;
    subtitle?: string;
}

export async function ProductFeatures({
    translationKey,
    features,
    title,
    subtitle
}: ProductFeaturesProps) {
    const t = await getTranslations(translationKey);

    return (
        <Stack spacing={6}>
            <Stack spacing={2} textAlign="center">
                <Typography variant="h3" color="primary.main" fontWeight={600}>
                    {title || t('features.title')}
                </Typography>
                {subtitle && (
                    <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
                        {subtitle}
                    </Typography>
                )}
            </Stack>

            <Grid container spacing={{ xs: 6, md: 4 }}>
                {features.map((feature, index) => (
                    <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
                        <FeatureIconCard
                            icon={feature.icon}
                            title={t(feature.titleKey)}
                            description={t(feature.descriptionKey)}
                            iconColor={feature.iconColor || 'primary'}
                        />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}