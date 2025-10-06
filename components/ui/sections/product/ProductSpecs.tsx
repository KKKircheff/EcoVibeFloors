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
        <Grid container spacing={4}>
            {specCategories.map((category, categoryIndex) => (
                <Grid key={categoryIndex} size={{ xs: 12, md: 6 }}>
                    <Stack p={3} px={{ xs: 0, md: 3 }}>
                        <Typography variant="h6" color="info.500" fontWeight={500} pb={3}>
                            {t(category.titleKey)}
                        </Typography>
                        <Stack spacing={2}>
                            {category.specs.map((spec, specIndex) => {
                                const specItem = typeof spec === 'string'
                                    ? { label: t(`specifications.${spec}.label`), value: t(`specifications.${spec}.value`) }
                                    : spec;

                                return (
                                    <Stack key={specIndex} spacing={2}>
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="body1" fontWeight={400}>{specItem.label}</Typography>
                                            <Typography variant="body1" fontWeight={400}>{specItem.value}</Typography>
                                        </Stack>
                                        {specIndex < category.specs.length - 1 && <Divider />}
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </Stack>
                </Grid>
            ))}
        </Grid>
    );
}