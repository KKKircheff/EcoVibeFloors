import 'server-only';
import { Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export interface ProductCtaProps {
    translationKey: string;
    textColor?: string;
}

export async function ProductCta({
    translationKey,
    textColor = 'primary.contrastText'
}: ProductCtaProps) {
    const t = await getTranslations(translationKey);

    return (
        <Stack spacing={4} textAlign="center" maxWidth="md" mx="auto">
            <Typography variant="h3" color={textColor} fontWeight={600}>
                {t('cta.title')}
            </Typography>
            <Typography variant="body1" color={textColor} fontSize="1.1rem" lineHeight={1.8}>
                {t('cta.description')}
            </Typography>
            <Typography variant="h6" color={textColor} fontWeight={400}>
                {t('cta.contact')}
            </Typography>
        </Stack>
    );
}