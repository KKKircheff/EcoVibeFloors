import 'server-only';
import { Stack, Typography, Box, Container, Divider } from '@mui/material';
import { getTranslations } from 'next-intl/server';

import PageLayoutContainer from '@/components/layout/page-container/PageLayoutContainer.component';
import Footer from '@/components/layout/footer/Footer.component';

export default async function WhatIsHybridWoodPage() {
    const t = await getTranslations('whatIsHybridWood');

    return (
        <Stack>
            {/* Hero Section */}
            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 8, md: 12 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4} alignItems="center" textAlign="center">
                        <Typography
                            variant="h1"
                            color="primary.contrastText"
                            fontWeight={700}
                            fontSize={{ xs: '2.5rem', md: '3.5rem' }}
                        >
                            {t('hero.title')}
                        </Typography>
                        <Typography
                            variant="h5"
                            color="primary.contrastText"
                            maxWidth="800px"
                            fontWeight={300}
                        >
                            {t('hero.subtitle')}
                        </Typography>
                    </Stack>
                </Container>
            </PageLayoutContainer>

            {/* Introduction Section */}
            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Typography variant="h3" color="primary.main" fontWeight={600}>
                            {t('introduction.title')}
                        </Typography>
                        <Typography variant="body1" fontSize="1.1rem" lineHeight={1.8}>
                            {t('introduction.content')}
                        </Typography>
                        <Box sx={{
                            bgcolor: 'grey.100',
                            p: 3,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'grey.300'
                        }}>
                            <Typography variant="body2" fontStyle="italic" textAlign="center">
                                {t('introduction.imageCaption')}
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </PageLayoutContainer>

            {/* Key Innovation Section */}
            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Typography variant="h3" color="primary.main" fontWeight={600}>
                            {t('innovation.title')}
                        </Typography>
                        <Typography variant="body1" fontSize="1.1rem" lineHeight={1.8}>
                            {t('innovation.content')}
                        </Typography>
                        <Stack spacing={2}>
                            <Typography variant="h5" color="secondary.main" fontWeight={500}>
                                {t('innovation.benefits.title')}
                            </Typography>
                            <Stack spacing={1.5} sx={{ ml: 2 }}>
                                <Typography variant="body1">• {t('innovation.benefits.woodPowder')}</Typography>
                                <Typography variant="body1">• {t('innovation.benefits.ultraThin')}</Typography>
                                <Typography variant="body1">• {t('innovation.benefits.hdfCore')}</Typography>
                                <Typography variant="body1">• {t('innovation.benefits.engineering')}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
            </PageLayoutContainer>

            {/* Features Section */}
            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Typography variant="h3" color="primary.main" fontWeight={600}>
                            {t('features.title')}
                        </Typography>

                        {/* Durability Features */}
                        <Stack spacing={3}>
                            <Typography variant="h5" color="secondary.main" fontWeight={500}>
                                {t('features.durability.title')}
                            </Typography>
                            <Stack spacing={2} sx={{ ml: 2 }}>
                                <Typography variant="body1">
                                    <strong>{t('features.durability.waterResistant.title')}:</strong> {t('features.durability.waterResistant.description')}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>{t('features.durability.scratchResistant.title')}:</strong> {t('features.durability.scratchResistant.description')}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>{t('features.durability.warranty.title')}:</strong> {t('features.durability.warranty.description')}
                                </Typography>
                            </Stack>
                        </Stack>

                        <Divider sx={{ my: 3 }} />

                        {/* Compatibility Features */}
                        <Stack spacing={3}>
                            <Typography variant="h5" color="secondary.main" fontWeight={500}>
                                {t('features.compatibility.title')}
                            </Typography>
                            <Stack spacing={2} sx={{ ml: 2 }}>
                                <Typography variant="body1">
                                    <strong>{t('features.compatibility.underfloorHeating.title')}:</strong> {t('features.compatibility.underfloorHeating.description')}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>{t('features.compatibility.subfloors.title')}:</strong> {t('features.compatibility.subfloors.description')}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
            </PageLayoutContainer>

            {/* Sustainability Section */}
            <PageLayoutContainer bgcolor='secondary.main' py={{ xs: 6, md: 10 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Typography variant="h3" color="secondary.contrastText" fontWeight={600}>
                            {t('sustainability.title')}
                        </Typography>
                        <Typography variant="body1" color="secondary.contrastText" fontSize="1.1rem" lineHeight={1.8}>
                            {t('sustainability.intro')}
                        </Typography>
                        <Stack spacing={2}>
                            <Typography variant="body1" color="secondary.contrastText">
                                • {t('sustainability.lessWood')}
                            </Typography>
                            <Typography variant="body1" color="secondary.contrastText">
                                • {t('sustainability.recycled')}
                            </Typography>
                            <Typography variant="body1" color="secondary.contrastText">
                                • {t('sustainability.chemicalFree')}
                            </Typography>
                            <Typography variant="body1" color="secondary.contrastText">
                                • {t('sustainability.responsibleSourcing')}
                            </Typography>
                        </Stack>
                        <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            p: 3,
                            borderRadius: 2,
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                            <Typography variant="body2" color="secondary.contrastText" fontStyle="italic" textAlign="center">
                                {t('sustainability.imageCaption')}
                            </Typography>
                        </Box>
                    </Stack>
                </Container>
            </PageLayoutContainer>

            {/* Installation Section */}
            <PageLayoutContainer bgcolor='background.paper' py={{ xs: 6, md: 10 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Typography variant="h3" color="primary.main" fontWeight={600}>
                            {t('installation.title')}
                        </Typography>
                        <Typography variant="body1" fontSize="1.1rem" lineHeight={1.8}>
                            {t('installation.intro')}
                        </Typography>

                        <Stack spacing={3}>
                            <Typography variant="h5" color="secondary.main" fontWeight={500}>
                                {t('installation.methods.title')}
                            </Typography>
                            <Stack spacing={2} sx={{ ml: 2 }}>
                                <Typography variant="body1">
                                    <strong>{t('installation.methods.floating.title')}:</strong> {t('installation.methods.floating.description')}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>{t('installation.methods.glued.title')}:</strong> {t('installation.methods.glued.description')}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>{t('installation.methods.professional.title')}:</strong> {t('installation.methods.professional.description')}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Container>
            </PageLayoutContainer>

            {/* Maintenance Section */}
            <PageLayoutContainer bgcolor='grey.50' py={{ xs: 6, md: 10 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4}>
                        <Typography variant="h3" color="primary.main" fontWeight={600}>
                            {t('maintenance.title')}
                        </Typography>
                        <Typography variant="body1" fontSize="1.1rem" lineHeight={1.8}>
                            {t('maintenance.intro')}
                        </Typography>

                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                            {/* Do's */}
                            <Box flex={1}>
                                <Typography variant="h6" color="secondary.main" fontWeight={500} gutterBottom>
                                    ✅ {t('maintenance.dos.title')}
                                </Typography>
                                <Stack spacing={1}>
                                    <Typography variant="body2">• {t('maintenance.dos.vacuum')}</Typography>
                                    <Typography variant="body2">• {t('maintenance.dos.dampMop')}</Typography>
                                    <Typography variant="body2">• {t('maintenance.dos.spills')}</Typography>
                                    <Typography variant="body2">• {t('maintenance.dos.furniture')}</Typography>
                                </Stack>
                            </Box>

                            {/* Don'ts */}
                            <Box flex={1}>
                                <Typography variant="h6" color="error.main" fontWeight={500} gutterBottom>
                                    ❌ {t('maintenance.donts.title')}
                                </Typography>
                                <Stack spacing={1}>
                                    <Typography variant="body2">• {t('maintenance.donts.excessWater')}</Typography>
                                    <Typography variant="body2">• {t('maintenance.donts.harsh')}</Typography>
                                    <Typography variant="body2">• {t('maintenance.donts.steam')}</Typography>
                                    <Typography variant="body2">• {t('maintenance.donts.wax')}</Typography>
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                </Container>
            </PageLayoutContainer>

            {/* Conclusion Section */}
            <PageLayoutContainer bgcolor='primary.main' py={{ xs: 6, md: 10 }}>
                <Container maxWidth="lg">
                    <Stack spacing={4} textAlign="center">
                        <Typography variant="h3" color="primary.contrastText" fontWeight={600}>
                            {t('conclusion.title')}
                        </Typography>
                        <Typography variant="body1" color="primary.contrastText" fontSize="1.1rem" lineHeight={1.8}>
                            {t('conclusion.content')}
                        </Typography>
                        <Typography variant="h6" color="primary.contrastText" fontWeight={400}>
                            {t('conclusion.cta')}
                        </Typography>
                    </Stack>
                </Container>
            </PageLayoutContainer>

            {/* Footer */}
            <PageLayoutContainer pt={10} bgcolor='info.800'>
                <Footer />
            </PageLayoutContainer>
        </Stack>
    );
}