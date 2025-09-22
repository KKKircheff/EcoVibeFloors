import 'server-only';
import { getTranslations } from 'next-intl/server';
import { Grid, Card, CardContent, Typography, Stack } from '@mui/material';
import Image from 'next/image';

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
        <Grid container spacing={2} rowGap={{ xs: 8, md: 16 }}>
            {featuresConfig.map((feature, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Stack justifyContent={'center'} alignItems={'center'}>
                        <Image
                            src={feature.image}
                            alt={t(feature.titleKey)}
                            width={130}
                            height={60}
                            style={{ marginBottom: 16 }}
                        />
                        <Typography variant="h3" component="h3" gutterBottom textAlign={'center'}>
                            {t(`features.${feature.titleKey}.title`)}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" textAlign={'center'}>
                            {t(`features.${feature.textKey}.description`)}
                        </Typography>
                    </Stack>
                </Grid>
            ))}
        </Grid>
    );
}