import 'server-only';
import { Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export interface ProductOverviewProps {
    translationKey: string;
}

export async function ProductOverview({ translationKey }: ProductOverviewProps) {
    const t = await getTranslations(translationKey);

    return (
        <Stack spacing={4} textAlign="center">
            <Typography variant="h2" color="primary.main" fontWeight={600}>
                {t('overview.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth="800px" mx="auto" lineHeight={1.6}>
                {t('overview.subtitle')}
            </Typography>
            <Typography variant="body1" fontSize="1.1rem" maxWidth="900px" mx="auto" lineHeight={1.8}>
                {t('overview.description')}
            </Typography>
        </Stack>
    );
}