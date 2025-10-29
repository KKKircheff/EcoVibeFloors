import 'server-only';
import { getTranslations } from 'next-intl/server';
import { Stack } from '@mui/material';
import { BlogContent } from '@/components/ui/typography/BlogContent';
import { ProductCollectionGrid } from '@/components/ui/product/ProductCollectionGrid';

export async function OakStyles() {
    const t = await getTranslations('oakFlooring.styles');

    // Using placeholder images - user will replace with actual product images
    const stylesConfig = [
        {
            title: t('plank.title'),
            dimensions: t('plank.dimensions'),
            description: t('plank.description'),
            mainImage: '/images/oak/treatments/natural.webp',
            hoverImage: '/images/oak/treatments/medium-brown.webp',
            imageAlt: t('plank.title'),
            navigationUrl: '/oak/plank'
        },
        {
            title: t('herringbone.title'),
            dimensions: t('herringbone.dimensions'),
            description: t('herringbone.description'),
            mainImage: '/images/oak/treatments/smokey.webp',
            hoverImage: '/images/oak/treatments/greywash.webp',
            imageAlt: t('herringbone.title'),
            navigationUrl: '/oak/herringbone'
        }
    ];

    return (
        <Stack spacing={3}>
            <BlogContent textAlign="center">{t('description')}</BlogContent>
            <ProductCollectionGrid
                title={t('title')}
                styles={stylesConfig}
            />
        </Stack>
    );
}
