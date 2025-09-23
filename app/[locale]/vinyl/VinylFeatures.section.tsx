import 'server-only';
import { Stack, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export async function VinylFeatures() {
    const t = await getTranslations('vinyl');

    const featuresConfig = [
        {
            icon: '100%',
            titleKey: 'features.waterproof.title',
            descriptionKey: 'features.waterproof.description',
            iconColor: 'primary'
        },
        {
            icon: '20Y',
            titleKey: 'features.warranty.title',
            descriptionKey: 'features.warranty.description',
            iconColor: 'secondary'
        },
        {
            icon: 'ECO',
            titleKey: 'features.ecoFriendly.title',
            descriptionKey: 'features.ecoFriendly.description',
            iconColor: 'primary'
        },
        {
            icon: 'AC5',
            titleKey: 'features.durability.title',
            descriptionKey: 'features.durability.description',
            iconColor: 'secondary'
        },
        {
            icon: 'DIY',
            titleKey: 'features.installation.title',
            descriptionKey: 'features.installation.description',
            iconColor: 'primary'
        },
        {
            icon: '10dB',
            titleKey: 'features.soundInsulation.title',
            descriptionKey: 'features.soundInsulation.description',
            iconColor: 'secondary'
        }
    ];

    return (
        <Container maxWidth="lg">
            <Stack spacing={6}>
                <Stack spacing={2} textAlign="center">
                    <Typography variant="h3" color="primary.main" fontWeight={600}>
                        {t('features.title')}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
                        {t('features.subtitle')}
                    </Typography>
                </Stack>

                <Grid container spacing={4}>
                    {featuresConfig.map((feature, index) => (
                        <Grid key={index} size={{ xs: 12, md: 6, lg: 4 }}>
                            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                                <CardContent>
                                    <Stack spacing={3} alignItems="center">
                                        <Stack
                                            sx={{
                                                bgcolor: `${feature.iconColor}.main`,
                                                color: `${feature.iconColor}.contrastText`,
                                                borderRadius: 2,
                                                p: 2,
                                                width: 80,
                                                height: 80
                                            }}
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Typography variant="h5" fontWeight={600}>
                                                {feature.icon}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h6" color="primary.main" fontWeight={500}>
                                            {t(feature.titleKey)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                                            {t(feature.descriptionKey)}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Container>
    );
}