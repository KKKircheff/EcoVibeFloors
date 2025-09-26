import 'server-only';
import { Stack, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export interface CollectionConfig {
    name: string;
    iconColor: 'primary' | 'secondary';
    features: string[];
}

export interface ProductCollectionsProps {
    translationKey: string;
    collections: CollectionConfig[];
    title?: string;
    subtitle?: string;
}

export async function ProductCollections({
    translationKey,
    collections,
    title,
    subtitle
}: ProductCollectionsProps) {
    const t = await getTranslations(translationKey);

    return (
        <Stack spacing={6}>
            <Stack spacing={2} textAlign="center">
                <Typography variant="h3" color="primary.main" fontWeight={600}>
                    {title || t('collections.title')}
                </Typography>
                {(subtitle || t('collections.subtitle')) && (
                    <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
                        {subtitle || t('collections.subtitle')}
                    </Typography>
                )}
            </Stack>

            <Grid container spacing={4}>
                {collections.map((collection, index) => (
                    <Grid key={collection.name} size={{ xs: 12, md: 6, lg: 4 }}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Stack spacing={3}>
                                    <Stack spacing={1}>
                                        <Typography variant="h5" color="primary.main" fontWeight={600}>
                                            {t(`collections.${collection.name}.name`)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                                            {t(`collections.${collection.name}.description`)}
                                        </Typography>
                                    </Stack>

                                    <Stack spacing={1}>
                                        <Typography variant="subtitle2" color="primary.main" fontWeight={500}>
                                            {t('collections.keyFeatures')}
                                        </Typography>
                                        <Stack direction="row" flexWrap="wrap" gap={1}>
                                            {collection.features.map((feature) => (
                                                <Chip
                                                    key={feature}
                                                    label={t(`collections.features.${feature}`)}
                                                    size="small"
                                                    color={collection.iconColor}
                                                    variant="outlined"
                                                />
                                            ))}
                                        </Stack>
                                    </Stack>

                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography variant="body2" color="text.secondary">
                                            {t(`collections.${collection.name}.thickness`)}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={500} color="primary.main">
                                            {t(`collections.${collection.name}.warranty`)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}