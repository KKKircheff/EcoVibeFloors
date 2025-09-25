import 'server-only';
import { getTranslations } from 'next-intl/server';
import { Grid } from '@mui/material';
import { FeatureImageCard } from '@/components/ui/card/FeatureImageCard';

export async function HomeFeatures() {
    const t = await getTranslations('home');

    const featuresConfig = [
        {
            image: '/images/icons/home/molen.png',
            titleKey: 'dutchOrigin',
            textKey: 'dutchOrigin'
        },
        {
            image: '/images/icons/home/certificate.png',
            titleKey: 'certified',
            textKey: 'certified'
        },
        {
            image: '/images/icons/home/2-compass.png',
            titleKey: 'innovative',
            textKey: 'innovative'
        },
        {
            image: '/images/icons/home/crown.png',
            titleKey: 'luxury',
            textKey: 'luxury'
        },
        {
            image: '/images/icons/home/floor.png',
            titleKey: 'diverse',
            textKey: 'diverse'
        },
        {
            image: '/images/icons/home/leaf-2.png',
            titleKey: 'ecoFriendly',
            textKey: 'ecoFriendly'
        }
    ];

    return (
        <Grid id='features' container spacing={2} rowGap={{ xs: 8, md: 16 }}>
            {featuresConfig.map((feature, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                    <FeatureImageCard
                        image={feature.image}
                        title={t(`features.${feature.titleKey}.title`)}
                        description={t(`features.${feature.textKey}.description`)}
                    />
                </Grid>
            ))}
        </Grid>
    );
}