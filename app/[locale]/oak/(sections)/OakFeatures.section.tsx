import 'server-only';
import { Stack, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function OakFeatures() {
    const t = await getTranslations('oakFlooring.features');

    return (
        <Container maxWidth="xl">
            <Stack spacing={4}>
                <BlogTitle>{t('title')}</BlogTitle>

                <Stack ml={2} spacing={1.5}>
                    <BlogContent>
                        • <strong>{t('naturalOak.title')}:</strong> {t('naturalOak.description')}
                    </BlogContent>
                    <BlogContent>
                        • <strong>{t('engineered.title')}:</strong> {t('engineered.description')}
                    </BlogContent>
                    <BlogContent>
                        • <strong>{t('oilTreatment.title')}:</strong> {t('oilTreatment.description')}
                    </BlogContent>
                    <BlogContent>
                        • <strong>{t('customizable.title')}:</strong> {t('customizable.description')}
                    </BlogContent>
                    <BlogContent>
                        • <strong>{t('underfloorHeating.title')}:</strong> {t('underfloorHeating.description')}
                    </BlogContent>
                    <BlogContent>
                        • <strong>{t('dutchQuality.title')}:</strong> {t('dutchQuality.description')}
                    </BlogContent>
                </Stack>
            </Stack>
        </Container>
    );
}
