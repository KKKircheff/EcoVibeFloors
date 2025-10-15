import 'server-only';
import { Stack, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function ClickTechnology() {
    const t = await getTranslations('whatIsClickVinyl.technology');

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
                        <BlogContent>• {t('benefits.i4fSystem')}</BlogContent>
                        <BlogContent>• {t('benefits.rigidCore')}</BlogContent>
                        <BlogContent>• {t('benefits.waterproof')}</BlogContent>
                        <BlogContent>• {t('benefits.noAcklimation')}</BlogContent>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
}
