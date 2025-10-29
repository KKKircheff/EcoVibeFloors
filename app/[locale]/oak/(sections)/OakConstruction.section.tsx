import 'server-only';
import { Stack, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function OakConstruction() {
    const t = await getTranslations('oakFlooring.construction');

    return (
        <Container maxWidth="xl">
            <Stack spacing={4}>
                <BlogTitle>{t('title')}</BlogTitle>
                <BlogSubtitle>{t('subtitle')}</BlogSubtitle>
                <BlogContent>{t('description')}</BlogContent>

                <Stack spacing={2}>
                    <BlogSubtitle>{t('benefits.title')}</BlogSubtitle>
                    <Stack ml={2} spacing={1.5}>
                        <BlogContent>
                            • <strong>{t('benefits.stability.title')}:</strong> {t('benefits.stability.description')}
                        </BlogContent>
                        <BlogContent>
                            • <strong>{t('benefits.moisture.title')}:</strong> {t('benefits.moisture.description')}
                        </BlogContent>
                        <BlogContent>
                            • <strong>{t('benefits.heating.title')}:</strong> {t('benefits.heating.description')}
                        </BlogContent>
                        <BlogContent>
                            • <strong>{t('benefits.versatile.title')}:</strong> {t('benefits.versatile.description')}
                        </BlogContent>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
}
