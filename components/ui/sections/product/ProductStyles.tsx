import 'server-only';
import { Stack, Typography, Grid, Card, CardContent } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export interface StyleConfig {
    titleKey: string;
    dimensionsKey?: string;
    descriptionKey: string;
    imageCaptionKey: string;
}

export interface ProductStylesProps {
    translationKey: string;
    styles: StyleConfig[];
    title?: string;
    imageHeight?: number;
}

export async function ProductStyles({
    translationKey,
    styles,
    title,
    imageHeight = 200
}: ProductStylesProps) {
    const t = await getTranslations(translationKey);

    return (
        <Stack spacing={6}>
            <Typography variant="h3" color="primary.main" fontWeight={600} textAlign="center">
                {title || t('styles.title')}
            </Typography>

            <Grid container spacing={4}>
                {styles.map((style, index) => (
                    <Grid key={index} size={{ xs: 12, md: 6 }}>
                        <Card sx={{ height: '100%' }}>
                            <Stack
                                sx={{
                                    bgcolor: 'grey.200',
                                    height: imageHeight
                                }}
                                alignItems="center"
                                justifyContent="center"
                            >
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                    {t(style.imageCaptionKey)}
                                </Typography>
                            </Stack>
                            <CardContent>
                                <Stack spacing={2}>
                                    <Typography variant="h6" color="primary.main" fontWeight={500}>
                                        {t(style.titleKey)}
                                    </Typography>
                                    {style.dimensionsKey && (
                                        <Typography variant="body2" color="text.secondary">
                                            {t(style.dimensionsKey)}
                                        </Typography>
                                    )}
                                    <Typography variant="body2">
                                        {t(style.descriptionKey)}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}