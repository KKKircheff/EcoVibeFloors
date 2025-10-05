import 'server-only';
import { getTranslations } from 'next-intl/server';
import { ProductStyles } from '@/components/ui/sections/product';
import { getStyleCardImages } from '@/lib/utils/getStyleCardImages';

export async function HybridWoodStyles() {
    const t = await getTranslations('hybridWood.styles');

    // Get images from product data by SKU
    const plankImages = getStyleCardImages('hybrid-wood', 'FLR-5002', 2, 7);
    const fishboneImages = getStyleCardImages('hybrid-wood', 'FLR-5015', 0, 3);

    const stylesConfig = [
        {
            title: t('xlPlanks.title'),
            dimensions: t('xlPlanks.dimensions'),
            description: t('xlPlanks.description'),
            mainImage: plankImages.mainImage,
            hoverImage: plankImages.hoverImage,
            imageAlt: t('xlPlanks.title'),
            navigationUrl: '/hybrid-wood/plank'
        },
        {
            title: t('herringbone.title'),
            dimensions: t('herringbone.dimensions'),
            description: t('herringbone.description'),
            mainImage: fishboneImages.mainImage,
            hoverImage: fishboneImages.hoverImage,
            imageAlt: t('herringbone.title'),
            navigationUrl: '/hybrid-wood/fishbone'
        }
    ];

    return (
        <ProductStyles
            title={t('title')}
            styles={stylesConfig}
        />
    );
}