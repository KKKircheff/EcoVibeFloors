import 'server-only';
import { Stack, Typography, Grid, Card, Divider } from '@mui/material';
import { getTranslations } from 'next-intl/server';

export interface SpecItem {
    label: string;
    value: string;
}

export interface SpecCategory {
    titleKey: string;
    specs: SpecItem[] | string[]; // Can be pre-translated or translation keys
}

export interface ProductSpecsProps {
    translationKey: string;
    specCategories: SpecCategory[];
    title?: string;
}

export async function ProductSpecs({
    translationKey,
    specCategories,
    title
}: ProductSpecsProps) {
    const t = await getTranslations(translationKey);

    return (
        <Stack spacing={6}>
            <Typography variant="h3" color="primary.main" fontWeight={600} textAlign="center">
                {title || t('specifications.title')}
            </Typography>

            <Grid container spacing={4}>
                {specCategories.map((category, categoryIndex) => (
                    <Grid key={categoryIndex} size={{ xs: 12, md: 6 }}>
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" color="secondary.main" fontWeight={500} gutterBottom>
                                {t(category.titleKey)}
                            </Typography>
                            <Stack spacing={2}>
                                {category.specs.map((spec, specIndex) => {
                                    // Handle both pre-translated specs and translation key specs
                                    const specItem = typeof spec === 'string'
                                        ? { label: t(`specifications.${spec}.label`), value: t(`specifications.${spec}.value`) }
                                        : spec;

                                    return (
                                        <Stack key={specIndex} spacing={2}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="body2">{specItem.label}</Typography>
                                                <Typography variant="body2" fontWeight={500}>{specItem.value}</Typography>
                                            </Stack>
                                            {specIndex < category.specs.length - 1 && <Divider />}
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
}