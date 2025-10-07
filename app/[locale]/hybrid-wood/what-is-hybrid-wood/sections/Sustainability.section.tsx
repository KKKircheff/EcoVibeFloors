import 'server-only';
import { Stack, Typography, Box, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import hybridWoodImage from '../../../../../public/images/other/sustainable.webp';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function Sustainability() {
    const t = await getTranslations('whatIsHybridWood.sustainability');

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
                    <BlogContent>
                        • {t('lessWood')}
                    </BlogContent >
                    <BlogContent>
                        • {t('recycled')}
                    </BlogContent>
                    <BlogContent>
                        • {t('chemicalFree')}
                    </BlogContent>
                    <BlogContent>
                        • {t('responsibleSourcing')}
                    </BlogContent>
                </Stack>

                <Box
                    py={2}
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                        overflow: 'hidden',
                        maxWidth: '1000px',
                        alignSelf: 'center'
                    }}>
                    <Image
                        src={hybridWoodImage}
                        alt={t('imageCaption')}
                        style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
                        sizes="(min-width: 1200px) 50vw, 100vw"
                    />
                </Box>
            </Stack>
        </Container>
    );
}
