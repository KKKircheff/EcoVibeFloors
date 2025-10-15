import 'server-only';
import { Stack, Container, Grid } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function Features() {
    const t = await getTranslations('whatIsClickVinyl.features');

    const features = [
        { key: 'waterproof' },
        { key: 'clickInstallation' },
        { key: 'warranty' },
        { key: 'ecoFriendly' },
        { key: 'durability' },
        { key: 'soundInsulation' }
    ];

    return (
        <Container maxWidth="xl">
            <Stack spacing={4}>
                <BlogTitle color={'primary.50'}>
                    {t('title')}
                </BlogTitle>

                <Grid container spacing={3}>
                    {features.map((feature) => (
                        <Grid key={feature.key} size={{ xs: 12, md: 6 }}>
                            <Stack spacing={1}>
                                <BlogSubtitle color={'primary.50'}>
                                    {t(`${feature.key}.title` as keyof IntlMessages['whatIsClickVinyl']['features'])}
                                </BlogSubtitle>
                                <BlogContent color={'primary.100'}>
                                    {t(`${feature.key}.description` as keyof IntlMessages['whatIsClickVinyl']['features'])}
                                </BlogContent>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Container>
    );
}
