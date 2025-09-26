import 'server-only';
import { Stack, Typography, Grid } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export interface ProductSustainabilityProps {
    translationKey: string;
    textColor?: string;
    benefits?: string[];
    showImagePlaceholder?: boolean;
}

export async function ProductSustainability({
    translationKey,
    textColor = 'secondary.contrastText',
    benefits,
    showImagePlaceholder = true
}: ProductSustainabilityProps) {
    const t = await getTranslations(translationKey);

    const defaultBenefits = benefits || ['benefit1', 'benefit2', 'benefit3'];

    return (
        <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={4}>
                    <Typography variant="h3" color={textColor} fontWeight={600}>
                        {t('sustainability.title')}
                    </Typography>
                    <Typography variant="body1" color={textColor} fontSize="1.1rem" lineHeight={1.8}>
                        {t('sustainability.description')}
                    </Typography>
                    <Stack spacing={2}>
                        {defaultBenefits.map((benefit, index) => (
                            <Typography key={index} variant="body1" color={textColor}>
                                • {t(`sustainability.${benefit}`)}
                            </Typography>
                        ))}
                    </Stack>
                </Stack>
            </Grid>
            {showImagePlaceholder && (
                <Grid size={{ xs: 12, md: 6 }}>
                    <Stack
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.1)',
                            p: 4,
                            borderRadius: 2,
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                        alignItems="center"
                        justifyContent="center"
                    >
                        <Typography variant="body2" color={textColor} fontStyle="italic" textAlign="center">
                            {t('sustainability.imageCaption')}
                        </Typography>
                    </Stack>
                </Grid>
            )}
        </Grid>
    );
}