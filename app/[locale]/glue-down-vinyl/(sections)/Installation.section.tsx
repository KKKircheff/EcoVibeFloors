import 'server-only';
import { Stack, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function Installation() {
    const t = await getTranslations('whatIsGlueDownVinyl.installation');

    return (
        <Container maxWidth="xl">
            <Stack spacing={4}>
                <BlogTitle>
                    {t('title')}
                </BlogTitle>
                <BlogContent>
                    {t('intro')}
                </BlogContent>

                <Stack spacing={2}>
                    <BlogSubtitle>
                        {t('method.title')}
                    </BlogSubtitle>
                    <BlogContent>
                        {t('method.description')}
                    </BlogContent>
                </Stack>

                <Stack spacing={3}>
                    <BlogSubtitle>
                        {t('steps.title')}
                    </BlogSubtitle>
                    <Stack spacing={2} sx={{ ml: 2 }}>
                        <BlogContent>
                            <strong>1. Preparation:</strong> {t('steps.preparation')}
                        </BlogContent>
                        <BlogContent>
                            <strong>2. Adhesive Application:</strong> {t('steps.adhesive')}
                        </BlogContent>
                        <BlogContent>
                            <strong>3. Installation:</strong> {t('steps.installation')}
                        </BlogContent>
                        <BlogContent>
                            <strong>4. Finishing:</strong> {t('steps.finishing')}
                        </BlogContent>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
}
