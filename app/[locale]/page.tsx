import { getTranslations } from 'next-intl/server';
import { Container, Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';
import { HomeOutlined, VerifiedOutlined, SupportAgentOutlined } from '@mui/icons-material';

export default async function HomePage() {

    const t = await getTranslations('home')
    const tButtons = await getTranslations('buttons')

    return (
        <Container maxWidth="lg" >
            <Box sx={{ pt: 24, pb: 8 }}>
                <Box textAlign="center" sx={{ mb: 8 }}>
                    <Typography
                        variant="h1"
                        component="h1"
                        color="primary"
                        gutterBottom
                        sx={{ mb: 3 }}
                    >
                        {t('hero.title')}
                    </Typography>
                    <Typography
                        variant="h5"
                        component="p"
                        color="text.secondary"
                        sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}
                    >
                        {t('hero.subtitle')}
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{ px: 4, py: 2, fontSize: '1.1rem' }}
                    >
                        {tButtons('exploreCollection')}
                    </Button>
                </Box>

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
            </Box>
        </Container>
    );
}
