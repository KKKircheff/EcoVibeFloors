import 'server-only';
import { Stack, Container } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import { BlogTitle } from '@/components/ui/typography/BlogTitle';
import { BlogContent } from '@/components/ui/typography/BlogContent';
import { HeroButton } from '@/components/ui/buttons/HeroButton';

export interface ProductCtaProps {
    translationKey: string;
}

export async function ProductCta({ translationKey }: ProductCtaProps) {
    const t = await getTranslations(`${translationKey}.conclusion`);
    const tButtons = await getTranslations('buttons');

    return (
        <Container maxWidth="xl">
            <Stack spacing={6} textAlign="center" alignItems="center">
                <BlogTitle color="primary.contrastText">
                    {t('title')}
                </BlogTitle>
                <BlogContent color="primary.contrastText" maxWidth={'1250px'}>
                    {t('content')}
                </BlogContent>
                <BlogContent color="primary.contrastText" fontWeight={500}>
                    {t('cta')}
                </BlogContent>
                <HeroButton actionType='navigate' target='/contact' buttonVariant='outlined'>
                    {tButtons('contactUs')}
                </HeroButton>
            </Stack>
        </Container>
    );
}
