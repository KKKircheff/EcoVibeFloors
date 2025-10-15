import 'server-only';
import { Stack, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import glueDownVinylImage from '../../../../public/images/home-page/hero-c.webp';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';

export async function Introduction() {
    const t = await getTranslations('whatIsGlueDownVinyl.introduction');

    return (
        <Container maxWidth="xl">
            <Stack spacing={4}>
                <BlogTitle>
                    {t('title')}
                </BlogTitle>
                <BlogContent>
                    {t('content')}
                </BlogContent>
                <Stack sx={{
                    width: '100%',
                    borderRadius: 2,
                    overflow: 'hidden',
                    maxWidth: '1000px',
                    alignSelf: 'center'
                }}>
                    <Image
                        src={glueDownVinylImage}
                        alt={t('imageCaption')}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        sizes="(min-width: 1200px) 80vw, 100vw"
                        priority
                    />
                </Stack>
            </Stack>
        </Container>
    );
}
