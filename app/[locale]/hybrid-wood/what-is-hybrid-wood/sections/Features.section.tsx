import 'server-only';
import { Stack, Typography, Container, Divider } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function Features() {
    const t = await getTranslations('whatIsHybridWood.features');

    return (
        <Container maxWidth="xl">
            <Stack spacing={4}>
                <BlogTitle color={'primary.50'}>
                    {t('title')}
                </BlogTitle>

                {/* Durability Features */}
                <Stack spacing={3}>
                    <BlogSubtitle >
                        {t('durability.title')}
                    </BlogSubtitle>
                    <Stack spacing={2} sx={{ ml: 2 }}>
                        <BlogContent color={'primary.100'}>
                            <strong>{t('durability.waterResistant.title')}:</strong> {t('durability.waterResistant.description')}
                        </BlogContent  >
                        <BlogContent color={'primary.100'}>
                            <strong>{t('durability.scratchResistant.title')}:</strong> {t('durability.scratchResistant.description')}
                        </BlogContent>
                        <BlogContent color={'primary.100'}>
                            <strong>{t('durability.warranty.title')}:</strong> {t('durability.warranty.description')}
                        </BlogContent>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 3 }} />

                {/* Compatibility Features */}
                <Stack spacing={3}>
                    <BlogSubtitle>
                        {t('compatibility.title')}
                    </BlogSubtitle>
                    <Stack spacing={2} sx={{ ml: 2 }}>
                        <BlogContent color={'primary.100'}>
                            <strong>{t('compatibility.underfloorHeating.title')}:</strong> {t('compatibility.underfloorHeating.description')}
                        </BlogContent>
                        <BlogContent color={'primary.100'}>
                            <strong>{t('compatibility.subfloors.title')}:</strong> {t('compatibility.subfloors.description')}
                        </BlogContent>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
}
