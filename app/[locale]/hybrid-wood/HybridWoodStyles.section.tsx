import 'server-only';
import { Stack, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export async function HybridWoodStyles() {
    const t = await getTranslations('hybridWood');

    const stylesConfig = [
        {
            titleKey: 'styles.xlPlanks.title',
            dimensionsKey: 'styles.xlPlanks.dimensions',
            descriptionKey: 'styles.xlPlanks.description',
            imageCaptionKey: 'styles.xlPlanks.imageCaption'
        },
        {
            titleKey: 'styles.herringbone.title',
            dimensionsKey: 'styles.herringbone.dimensions',
            descriptionKey: 'styles.herringbone.description',
            imageCaptionKey: 'styles.herringbone.imageCaption'
        }
    ];

    return (
        <Container maxWidth="lg">
            <Stack spacing={6}>
                <Typography variant="h3" color="primary.main" fontWeight={600} textAlign="center">
                    {t('styles.title')}
                </Typography>

                <Grid container spacing={4}>
                    {stylesConfig.map((style, index) => (
                        <Grid key={index} size={{ xs: 12, md: 6 }}>
                            <Card sx={{ height: '100%' }}>
                                <Stack
                                    sx={{
                                        bgcolor: 'grey.200',
                                        height: 200
                                    }}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                        {t(style.imageCaptionKey)}
                                    </Typography>
                                </Stack>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Typography variant="h6" color="primary.main" fontWeight={500}>
                                            {t(style.titleKey)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {t(style.dimensionsKey)}
                                        </Typography>
                                        <Typography variant="body2">
                                            {t(style.descriptionKey)}
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