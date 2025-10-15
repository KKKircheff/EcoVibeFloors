import 'server-only';
import { Stack, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function DrybackTechnology() {
    const t = await getTranslations('whatIsGlueDownVinyl.technology');

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
                        <BlogContent>• {t('benefits.permanent')}</BlogContent>
                        <BlogContent>• {t('benefits.commercial')}</BlogContent>
                        <BlogContent>• {t('benefits.thin')}</BlogContent>
                        <BlogContent>• {t('benefits.stability')}</BlogContent>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
}
