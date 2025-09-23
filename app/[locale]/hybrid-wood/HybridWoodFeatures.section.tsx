import 'server-only';
import { Stack, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export async function HybridWoodFeatures() {
    const t = await getTranslations('hybridWood');

    const featuresConfig = [
        {
            icon: '24h',
            titleKey: 'features.waterResistance.title',
            descriptionKey: 'features.waterResistance.description',
            iconColor: 'primary'
        },
        {
            icon: 'AC5',
            titleKey: 'features.scratchResistance.title',
            descriptionKey: 'features.scratchResistance.description',
            iconColor: 'secondary'
        },
        {
            icon: '35Y',
            titleKey: 'features.warranty.title',
            descriptionKey: 'features.warranty.description',
            iconColor: 'primary'
        }
    ];

    return (
        <Container maxWidth="lg">
            <Stack spacing={6}>
                <Typography variant="h3" color="primary.main" fontWeight={600} textAlign="center">
                    {t('features.title')}
                </Typography>

                <Grid container spacing={4}>
                    {featuresConfig.map((feature, index) => (
                        <Grid key={index} size={{ xs: 12, md: 4 }}>
                            <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                                <CardContent>
                                    <Stack spacing={3} alignItems="center">
                                        <Stack
                                            sx={{
                                                bgcolor: `${feature.iconColor}.main`,
                                                color: `${feature.iconColor}.contrastText`,
                                                borderRadius: 2,
                                                p: 2,
                                                width: 60,
                                                height: 60
                                            }}
                                            justifyContent="center"
                                            alignItems="center"
                                        >
                                            <Typography variant="h6" fontWeight={600}>
                                                {feature.icon}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h6" color="primary.main" fontWeight={500}>
                                            {t(feature.titleKey)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
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