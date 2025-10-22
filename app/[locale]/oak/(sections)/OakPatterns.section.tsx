import 'server-only';
import { Stack, Typography, Grid, Box, Card, CardContent } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';

export async function OakPatterns() {
    const t = await getTranslations('oak.patterns');
    const tPatterns = await getTranslations('patterns');

    const patterns = [
        {
            key: 'plank',
            href: '/oak/plank',
            image: '/images/oak-plank-pattern.jpg' // Placeholder
        },
        {
            key: 'herringbone',
            href: '/oak/herringbone',
            image: '/images/oak-herringbone-pattern.jpg' // Placeholder
        }
    ];

    return (
        <Stack spacing={6}>
            <Stack spacing={2} alignItems="center" textAlign="center">
                <Typography variant="h2" fontWeight={600}>
                    {t('title')}
                </Typography>
                <Typography variant="h6" color="text.secondary" maxWidth="800px">
                    {t('description')}
                </Typography>
            </Stack>

            <Grid container spacing={4}>
                {patterns.map((pattern) => (
                    <Grid size={{ xs: 12, md: 6 }} key={pattern.key}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: 6
                                }
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Stack spacing={3}>
                                    <Typography variant="h4" fontWeight={600}>
                                        {tPatterns(pattern.key)}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {t(`${pattern.key}.description`)}
                                    </Typography>
                                    <Box>
                                        <PrimaryActionButton
                                            href={pattern.href}
                                            variant="contained"
                                            sx={{ mt: 2 }}
                                        >
                                            {tPatterns('viewProducts')}
                                        </PrimaryActionButton>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}
