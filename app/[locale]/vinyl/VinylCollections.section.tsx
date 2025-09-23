import 'server-only';
import { Stack, Typography, Container, Grid, Card, CardContent, Chip } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export async function VinylCollections() {
    const t = await getTranslations('vinyl');

    const collectionsConfig = [
        {
            name: 'tileVinyl',
            iconColor: 'primary',
            features: ['waterproof', 'underfloorHeating', 'dampAreas']
        },
        {
            name: 'herringboneVinyl',
            iconColor: 'secondary',
            features: ['elegantPattern', 'commercialGrade', 'clickSystem']
        },
        {
            name: 'natureRigid',
            iconColor: 'primary',
            features: ['rigidCore', 'commercialUse', 'scratchResistant']
        },
        {
            name: 'villageVinyl',
            iconColor: 'secondary',
            features: ['realisticOak', 'versatile', 'durable']
        },
        {
            name: 'forestVinyl',
            iconColor: 'primary',
            features: ['extraWide', 'uniqueEffect', 'premiumLook']
        }
    ];

    return (
        <Container maxWidth="lg">
            <Stack spacing={6}>
                <Stack spacing={2} textAlign="center">
                    <Typography variant="h3" color="primary.main" fontWeight={600}>
                        {t('collections.title')}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
                        {t('collections.subtitle')}
                    </Typography>
                </Stack>

                <Grid container spacing={4}>
                    {collectionsConfig.map((collection, index) => (
                        <Grid key={collection.name} size={{ xs: 12, md: 6, lg: 4 }}>
                            <Card
                                sx={{
                                    height: '100%',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Stack spacing={3}>
                                        <Stack spacing={1}>
                                            <Typography variant="h5" color="primary.main" fontWeight={600}>
                                                {t(`collections.${collection.name}.name`)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                                                {t(`collections.${collection.name}.description`)}
                                            </Typography>
                                        </Stack>

                                        <Stack spacing={1}>
                                            <Typography variant="subtitle2" color="primary.main" fontWeight={500}>
                                                {t('collections.keyFeatures')}
                                            </Typography>
                                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                                {collection.features.map((feature) => (
                                                    <Chip
                                                        key={feature}
                                                        label={t(`collections.features.${feature}`)}
                                                        size="small"
                                                        color={collection.iconColor as "primary" | "secondary"}
                                                        variant="outlined"
                                                    />
                                                ))}
                                            </Stack>
                                        </Stack>

                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Typography variant="body2" color="text.secondary">
                                                {t(`collections.${collection.name}.thickness`)}
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500} color="primary.main">
                                                {t(`collections.${collection.name}.warranty`)}
                                            </Typography>
                                        </Stack>
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