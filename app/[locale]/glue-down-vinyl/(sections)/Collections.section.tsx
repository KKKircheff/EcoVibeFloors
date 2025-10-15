import 'server-only';
import { Stack, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogSubtitle } from '@/components/ui/typography/BlogSubtitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function Collections() {
    const t = await getTranslations('whatIsGlueDownVinyl.collections');

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
                    <Stack spacing={1.5}>
                        <BlogSubtitle>Tile Vinyl</BlogSubtitle>
                        <BlogContent>{t('tileVinyl')}</BlogContent>
                    </Stack>

                    <Stack spacing={1.5}>
                        <BlogSubtitle>Herringbone Vinyl</BlogSubtitle>
                        <BlogContent>{t('herringbone')}</BlogContent>
                    </Stack>

                    <Stack spacing={1.5}>
                        <BlogSubtitle>Nature Rigid</BlogSubtitle>
                        <BlogContent>{t('natureRigid')}</BlogContent>
                    </Stack>

                    <Stack spacing={1.5}>
                        <BlogSubtitle>Village Vinyl</BlogSubtitle>
                        <BlogContent>{t('village')}</BlogContent>
                    </Stack>

                    <Stack spacing={1.5}>
                        <BlogSubtitle>Forest Vinyl</BlogSubtitle>
                        <BlogContent>{t('forest')}</BlogContent>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
}
