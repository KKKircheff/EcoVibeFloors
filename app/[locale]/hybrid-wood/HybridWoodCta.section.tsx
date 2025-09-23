import 'server-only';
import { Stack, Typography, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export async function HybridWoodCta() {
    const t = await getTranslations('hybridWood');

    return (
        <Container maxWidth="md">
            <Stack spacing={4} textAlign="center">
                <Typography variant="h3" color="primary.contrastText" fontWeight={600}>
                    {t('cta.title')}
                </Typography>
                <Typography variant="body1" color="primary.contrastText" fontSize="1.1rem" lineHeight={1.8}>
                    {t('cta.description')}
                </Typography>
                <Typography variant="h6" color="primary.contrastText" fontWeight={400}>
                    {t('cta.contact')}
                </Typography>
            </Stack>
        </Container>
    );
}