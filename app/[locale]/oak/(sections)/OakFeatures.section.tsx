import 'server-only';
import { Stack, Typography, Grid, Box, Paper } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export async function OakFeatures() {
    const t = await getTranslations('oak.features');

    const features = [
        {
            key: 'naturalBeauty',
            icon: '🌳'
        },
        {
            key: 'customizable',
            icon: '🎨'
        },
        {
            key: 'durable',
            icon: '💪'
        },
        {
            key: 'underfloorHeating',
            icon: '♨️'
        },
        {
            key: 'warranty',
            icon: '✅'
        },
        {
            key: 'dutchQuality',
            icon: '🇳🇱'
        }
    ];

    return (
        <Stack spacing={6}>
            <Stack spacing={2} alignItems="center" textAlign="center">
                <Typography variant="h2" fontWeight={600}>
                    {t('title')}
                </Typography>
            </Stack>

            <Grid container spacing={4}>
                {features.map((feature) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.key}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 3,
                                border: 1,
                                borderColor: 'divider',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: 4,
                                    borderColor: 'primary.main',
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <Stack spacing={2} alignItems="center" textAlign="center">
                                <Box
                                    sx={{
                                        fontSize: '3rem',
                                        mb: 1
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Typography variant="h5" fontWeight={600}>
                                    {t(`${feature.key}.title`)}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {t(`${feature.key}.description`)}
                                </Typography>
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}
