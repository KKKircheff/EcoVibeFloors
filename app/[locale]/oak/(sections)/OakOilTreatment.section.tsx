import 'server-only';
import { Stack, Container, Box } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogContent } from '@/components/ui/typography/BlogContent';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';

export async function OakOilTreatment() {
    const t = await getTranslations('oakFlooring.oilTreatment');

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
                            • <strong>{t('benefits.instantCuring.title')}:</strong> {t('benefits.instantCuring.description')}
                        </BlogContent>
                        <BlogContent>
                            • <strong>{t('benefits.naturalLook.title')}:</strong> {t('benefits.naturalLook.description')}
                        </BlogContent>
                        <BlogContent>
                            • <strong>{t('benefits.durability.title')}:</strong> {t('benefits.durability.description')}
                        </BlogContent>
                        <BlogContent>
                            • <strong>{t('benefits.ecoFriendly.title')}:</strong> {t('benefits.ecoFriendly.description')}
                        </BlogContent>
                    </Stack>
                </Stack>

                <Box
                    sx={{
                        bgcolor: 'grey.100',
                        p: 3,
                        borderRadius: 2
                    }}
                >
                    <BlogSubtitle>{t('colorOptions.title')}</BlogSubtitle>
                    <BlogContent>{t('colorOptions.description')}</BlogContent>
                </Box>
            </Stack>
        </Container>
    );
}
