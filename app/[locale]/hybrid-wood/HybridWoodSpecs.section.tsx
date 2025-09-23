import 'server-only';
import { Stack, Typography, Container, Grid, Card, Divider } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export async function HybridWoodSpecs() {
    const t = await getTranslations('hybridWood');

    const technicalSpecs = [
        { label: t('specifications.technical.thickness'), value: '9.5mm' },
        { label: t('specifications.technical.thermalResistance'), value: '0.07 m²K/W' },
        { label: t('specifications.technical.wearLayer'), value: t('specifications.technical.realOak') },
        { label: t('specifications.technical.core'), value: 'HDF' }
    ];

    const installationSpecs = [
        { label: t('specifications.installation.method'), value: t('specifications.installation.clickSystem') },
        { label: t('specifications.installation.underfloorHeating'), value: '✓' },
        { label: t('specifications.installation.floating'), value: '✓' },
        { label: t('specifications.installation.glued'), value: '✓' }
    ];

    return (
        <Container maxWidth="lg">
            <Stack spacing={6}>
                <Typography variant="h3" color="primary.main" fontWeight={600} textAlign="center">
                    {t('specifications.title')}
                </Typography>

                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" color="secondary.main" fontWeight={500} gutterBottom>
                                {t('specifications.technical.title')}
                            </Typography>
                            <Stack spacing={2}>
                                {technicalSpecs.map((spec, index) => (
                                    <Stack key={index} spacing={2}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2">{spec.label}</Typography>
                                            <Typography variant="body2" fontWeight={500}>{spec.value}</Typography>
                                        </Stack>
                                        {index < technicalSpecs.length - 1 && <Divider />}
                                    </Stack>
                                ))}
                            </Stack>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" color="secondary.main" fontWeight={500} gutterBottom>
                                {t('specifications.installation.title')}
                            </Typography>
                            <Stack spacing={2}>
                                {installationSpecs.map((spec, index) => (
                                    <Stack key={index} spacing={2}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body2">{spec.label}</Typography>
                                            <Typography variant="body2" fontWeight={500}>{spec.value}</Typography>
                                        </Stack>
                                        {index < installationSpecs.length - 1 && <Divider />}
                                    </Stack>
                                ))}
                            </Stack>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    );
}