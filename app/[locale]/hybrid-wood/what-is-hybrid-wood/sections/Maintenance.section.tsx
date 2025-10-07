import 'server-only';
import { Stack, Typography, Box, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';

export async function Maintenance() {
    const t = await getTranslations('whatIsHybridWood.maintenance');

    return (
        <Container maxWidth="xl">
            <Stack spacing={4}>
                <BlogTitle>
                    {t('title')}
                </BlogTitle>
                <BlogContent>
                    {t('intro')}
                </BlogContent>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                    {/* Do's */}
                    <Box flex={1}>
                        <BlogContent sx={{ color: '#43A047' }} gutterBottom>
                            <strong>✔ {t('dos.title')}</strong>
                        </BlogContent>
                        <Stack spacing={1}>
                            <BlogContent>• {t('dos.vacuum')}</BlogContent>
                            <BlogContent>• {t('dos.dampMop')}</BlogContent>
                            <BlogContent>• {t('dos.spills')}</BlogContent>
                            <BlogContent>• {t('dos.furniture')}</BlogContent>
                        </Stack>
                    </Box>

                    {/* Don'ts */}
                    <Box flex={1}>
                        <BlogContent color="#C70000" gutterBottom>
                            <strong>✖ {t('donts.title')}</strong>
                        </BlogContent>
                        <Stack spacing={1}>
                            <BlogContent>• {t('donts.excessWater')}</BlogContent>
                            <BlogContent>• {t('donts.wax')}</BlogContent>
                            <BlogContent>• {t('donts.steam')}</BlogContent>
                            <BlogContent>• {t('donts.harsh')}</BlogContent>
                        </Stack>
                    </Box>
                </Stack>
            </Stack>
        </Container>
    );
}
