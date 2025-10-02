import 'server-only';
import { Stack, Typography, Grid } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import PatternNavigationButton from '@/components/features/products/PatternNavigationButton';
import { Messages } from '@/global';

export async function HybridWoodPatterns() {
    const t = await getTranslations('hybridWood');
    const tPatterns = await getTranslations('patterns');

    const patterns = [
        { id: 'plank', labelKey: 'plank' as keyof Messages['patterns'] },
        { id: 'fishbone', labelKey: 'fishbone' as keyof Messages['patterns'] }
    ];

    return (
        <Stack spacing={6}>
            <Stack spacing={2} textAlign="center">
                <Typography variant="h3" color="primary.main" fontWeight={600}>
                    {t('patterns.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary" maxWidth="800px" mx="auto">
                    {t('patterns.description')}
                </Typography>
            </Stack>

            <Grid container spacing={4} justifyContent="center">
                {patterns.map((pattern) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={pattern.id}>
                        <PatternNavigationButton
                            href={`/hybrid-wood/${pattern.id}`}
                            label={tPatterns(pattern.labelKey)}
                            variant="contained"
                        />
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}
