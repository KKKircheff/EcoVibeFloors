import 'server-only';
import { Stack, Typography, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function Installation() {
    const t = await getTranslations('whatIsHybridWood.installation');

    return (
        <Container maxWidth="xl">
            <Stack spacing={4}>
                <BlogTitle>
                    {t('title')}
                </BlogTitle>
                <BlogContent>
                    {t('intro')}
                </BlogContent>

                <Stack spacing={3}>
                    <BlogSubtitle>
                        {t('methods.title')}
                    </BlogSubtitle>
                    <Stack spacing={2} sx={{ ml: 2 }}>
                        <BlogContent>
                            <strong>{t('methods.floating.title')}:</strong> {t('methods.floating.description')}
                        </BlogContent>
                        <BlogContent>
                            <strong>{t('methods.glued.title')}:</strong> {t('methods.glued.description')}
                        </BlogContent>
                        <BlogContent>
                            <strong>{t('methods.professional.title')}:</strong> {t('methods.professional.description')}
                        </BlogContent>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
}
