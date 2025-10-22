import 'server-only';
import { Stack, Typography, Box } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export async function OakOverview() {
    const t = await getTranslations('oak.overview');

    return (
        <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h2" fontWeight={600}>
                {t('title')}
            </Typography>
            <Typography variant="h5" color="text.secondary" maxWidth="900px">
                {t('subtitle')}
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth="1000px" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                {t('description')}
            </Typography>
        </Stack>
    );
}
