import 'server-only';
import { getTranslations } from 'next-intl/server';
import { getStyleCardImages } from '@/lib/utils/getStyleCardImages';
import { ProductStylesGrid } from '@/components/ui/product/ProductStylesGrid';

export async function OakPatterns() {
    const t = await getTranslations('oak.patterns');

    // Get images from product data by SKU
    const plankImages = getStyleCardImages('oak', 'DIG-A0000449', 0, 1);
    const herringboneImages = getStyleCardImages('oak', 'DIG-A0002129', 0, 1);
    const chevronImages = getStyleCardImages('oak', 'DIG-A0002143', 0, 1);

    const stylesConfig = [
        {
            title: t('plank.title'),
            dimensions: t('plank.dimensions'),
            description: t('plank.description'),
            mainImage: plankImages.mainImage,
            hoverImage: plankImages.hoverImage,
            imageAlt: t('plank.title'),
            navigationUrl: '/oak/plank'
        },
        {
            title: t('herringbone.title'),
            dimensions: t('herringbone.dimensions'),
            description: t('herringbone.description'),
            mainImage: herringboneImages.mainImage,
            hoverImage: herringboneImages.hoverImage,
            imageAlt: t('herringbone.title'),
            navigationUrl: '/oak/herringbone'
        },
        {
            title: t('chevron.title'),
            dimensions: t('chevron.dimensions'),
            description: t('chevron.description'),
            mainImage: chevronImages.mainImage,
            hoverImage: chevronImages.hoverImage,
            imageAlt: t('chevron.title'),
            navigationUrl: '/oak/chevron'
        }
    ];

    return (
        <ProductStylesGrid
            title={t('title')}
            styles={stylesConfig}
        />
    );
}
