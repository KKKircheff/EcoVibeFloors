import 'server-only';
import { Stack, Typography, Container, Grid } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export async function HybridWoodSustainability() {
    const t = await getTranslations('hybridWood');

    return (
        <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={4}>
                    <Typography variant="h3" color="secondary.contrastText" fontWeight={600}>
                        {t('sustainability.title')}
                    </Typography>
                    <Typography variant="body1" color="secondary.contrastText" fontSize="1.1rem" lineHeight={1.8}>
                        {t('sustainability.description')}
                    </Typography>
                    <Stack spacing={2}>
                        <Typography variant="body1" color="secondary.contrastText">
                            • {t('sustainability.benefit1')}
                        </Typography>
                        <Typography variant="body1" color="secondary.contrastText">
                            • {t('sustainability.benefit2')}
                        </Typography>
                        <Typography variant="body1" color="secondary.contrastText">
                            • {t('sustainability.benefit3')}
                        </Typography>
                    </Stack>
                </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
                <Stack
                    sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        p: 4,
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Typography variant="body2" color="secondary.contrastText" fontStyle="italic" textAlign="center">
                        {t('sustainability.imageCaption')}
                    </Typography>
                </Stack>
            </Grid>
        </Grid>
    );
}