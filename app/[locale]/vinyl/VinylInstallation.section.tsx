import 'server-only';
import { Stack, Typography, Container, Grid, Card, CardContent, Chip, Box } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export async function VinylInstallation() {
    const t = await getTranslations('vinyl');

    const installationMethods = [
        {
            method: 'clickSystem',
            collections: ['herringboneVinyl', 'natureRigid'],
            difficulty: 'Easy',
            timeRequired: '1-2 days',
            professionalRequired: false,
            color: 'primary'
        },
        {
            method: 'glueDown',
            collections: ['tileVinyl', 'villageVinyl', 'forestVinyl'],
            difficulty: 'Moderate',
            timeRequired: '2-3 days',
            professionalRequired: true,
            color: 'secondary'
        }
    ];

    const installationSteps = [
        {
            stepKey: 'preparation',
            iconColor: 'primary'
        },
        {
            stepKey: 'measurement',
            iconColor: 'secondary'
        },
        {
            stepKey: 'installation',
            iconColor: 'primary'
        },
        {
            stepKey: 'finishing',
            iconColor: 'secondary'
        }
    ];

    return (
        <Container maxWidth="lg">
            <Stack spacing={6}>
                <Stack spacing={2} textAlign="center">
                    <Typography variant="h3" color="primary.main" fontWeight={600}>
                        {t('installation.title')}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" maxWidth="700px" mx="auto">
                        {t('installation.subtitle')}
                    </Typography>
                </Stack>

                {/* Installation Methods */}
                <Grid container spacing={4}>
                    {installationMethods.map((method, index) => (
                        <Grid key={method.method} size={{ xs: 12, md: 6 }}>
                            <Card sx={{ height: '100%', p: 2 }}>
                                <CardContent>
                                    <Stack spacing={3}>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <Typography variant="h5" color="primary.main" fontWeight={600}>
                                                {t(`installation.methods.${method.method}.title`)}
                                            </Typography>
                                            <Chip
                                                label={method.difficulty}
                                                color={method.color as "primary" | "secondary"}
                                                size="small"
                                            />
                                        </Stack>

                                        <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                                            {t(`installation.methods.${method.method}.description`)}
                                        </Typography>

                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="subtitle2" color="primary.main" fontWeight={500}>
                                                    {t('installation.timeRequired')}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {method.timeRequired}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="primary.main" fontWeight={500}>
                                                    {t('installation.suitableFor')}
                                                </Typography>
                                                <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
                                                    {method.collections.map((collection) => (
                                                        <Chip
                                                            key={collection}
                                                            label={t(`collections.${collection}.name`)}
                                                            size="small"
                                                            variant="outlined"
                                                            color={method.color as "primary" | "secondary"}
                                                        />
                                                    ))}
                                                </Stack>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="primary.main" fontWeight={500}>
                                                    {t('installation.professionalInstallation')}
                                                </Typography>
                                                <Chip
                                                    label={method.professionalRequired ? t('installation.recommended') : t('installation.optional')}
                                                    size="small"
                                                    color={method.professionalRequired ? 'warning' : 'success'}
                                                    variant="filled"
                                                />
                                            </Box>
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Installation Steps */}
                <Stack spacing={4}>
                    <Typography variant="h4" color="primary.main" fontWeight={600} textAlign="center">
                        {t('installation.steps.title')}
                    </Typography>

                    <Grid container spacing={3}>
                        {installationSteps.map((step, index) => (
                            <Grid key={step.stepKey} size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
                                    <CardContent>
                                        <Stack spacing={2} alignItems="center">
                                            <Stack
                                                sx={{
                                                    bgcolor: `${step.iconColor}.main`,
                                                    color: `${step.iconColor}.contrastText`,
                                                    borderRadius: '50%',
                                                    width: 50,
                                                    height: 50
                                                }}
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Typography variant="h6" fontWeight={600}>
                                                    {index + 1}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="h6" color="primary.main" fontWeight={500}>
                                                {t(`installation.steps.${step.stepKey}.title`)}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {t(`installation.steps.${step.stepKey}.description`)}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </Stack>
        </Container>
    );
}