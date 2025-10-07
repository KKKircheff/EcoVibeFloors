import 'server-only';
import { Stack, Typography, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function KeyInnovation() {
    const t = await getTranslations('whatIsHybridWood.innovation');

    return (
        <Container maxWidth="xl">
            <Stack spacing={4}>
                <BlogTitle>
                    {t('title')}
                </BlogTitle>
                <BlogContent>
                    {t('content')}
                </BlogContent>
                <Stack spacing={2}>
                    <BlogSubtitle>
                        {t('benefits.title')}
                    </BlogSubtitle>
                    <Stack spacing={1.5} sx={{ ml: 2 }}>
                        <BlogContent>• {t('benefits.woodPowder')}</BlogContent>
                        <BlogContent>• {t('benefits.ultraThin')}</BlogContent>
                        <BlogContent>• {t('benefits.hdfCore')}</BlogContent>
                        <BlogContent>• {t('benefits.engineering')}</BlogContent>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
}
