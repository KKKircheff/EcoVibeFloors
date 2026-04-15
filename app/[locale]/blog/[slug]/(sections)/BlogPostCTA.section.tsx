import 'server-only';
import { Stack, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/atoms/typography/BlogTitle';
import { BlogContent } from '@/components/atoms/typography/BlogContent';
import { HeroButton } from '@/components/atoms/buttons/HeroButton';

export async function BlogPostCTA() {
    const t = await getTranslations('blog.cta');
    const tButtons = await getTranslations('buttons');

    return (
        <Container maxWidth="xl">
            <Stack spacing={6} textAlign="center" alignItems="center" py={{ xs: 6, md: 10 }}>
                <BlogTitle color="primary.contrastText">
                    {t('title')}
                </BlogTitle>
                <BlogContent color="primary.contrastText" maxWidth="1250px">
                    {t('subtitle')}
                </BlogContent>
                <HeroButton
                    actionType="navigate"
                    target="/collections"
                    buttonVariant="outlined"
                >
                    {tButtons('viewCollections')}
                </HeroButton>
            </Stack>
        </Container>
    );
}
