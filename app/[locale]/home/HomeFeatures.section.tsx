import 'server-only';
import { getTranslations } from 'next-intl/server';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { HomeOutlined, VerifiedOutlined, SupportAgentOutlined } from '@mui/icons-material';

export async function HomeFeatures() {
    const t = await getTranslations('home');

    return (
        <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                    <CardContent>
                        <VerifiedOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h5" component="h3" gutterBottom>
                            {t('features.quality.title')}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {t('features.quality.description')}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                    <CardContent>
                        <HomeOutlined sx={{ fontSize: 48, color: 'secondary.main', mb: 2 }} />
                        <Typography variant="h5" component="h3" gutterBottom>
                            {t('features.guarantee.title')}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {t('features.guarantee.description')}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                    <CardContent>
                        <SupportAgentOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h5" component="h3" gutterBottom>
                            {t('features.local.title')}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {t('features.local.description')}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}