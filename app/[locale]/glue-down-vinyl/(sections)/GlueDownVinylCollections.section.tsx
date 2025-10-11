import 'server-only';
import { getTranslations } from 'next-intl/server';
import { getStyleCardImages } from '@/lib/utils/getStyleCardImages';
import { ProductStylesGrid } from '@/components/ui/product/ProductStylesGrid';

export async function GlueDownVinylCollections() {
    const t = await getTranslations('glueDownVinyl.collections');
    const tPatterns = await getTranslations('patterns');

    // Get images from product data by SKU for each pattern
    const dorpenImages = getStyleCardImages('glue-down-vinyl', 'FLR-3040', 0, 1);
    const hongaarsePuntImages = getStyleCardImages('glue-down-vinyl', 'FLR-3570', 0, 1);
    const landhuisImages = getStyleCardImages('glue-down-vinyl', 'FLR-3233', 0, 1);

    const stylesConfig = [
        {
            title: tPatterns('dorpen'),
            description: tPatterns('dorpenDescription'),
            mainImage: dorpenImages.mainImage,
            hoverImage: dorpenImages.hoverImage,
            imageAlt: tPatterns('dorpen'),
            navigationUrl: '/glue-down-vinyl/dorpen'
        },
        {
            title: tPatterns('hongaarse-punt'),
            description: tPatterns('hongaarsePuntDescription'),
            mainImage: hongaarsePuntImages.mainImage,
            hoverImage: hongaarsePuntImages.hoverImage,
            imageAlt: tPatterns('hongaarse-punt'),
            navigationUrl: '/glue-down-vinyl/hongaarse-punt'
        },
        {
            title: tPatterns('landhuis'),
            description: tPatterns('landhuisDescription'),
            mainImage: landhuisImages.mainImage,
            hoverImage: landhuisImages.hoverImage,
            imageAlt: tPatterns('landhuis'),
            navigationUrl: '/glue-down-vinyl/landhuis'
        }
    ];

    return (
        <ProductStylesGrid
            title={t('title')}
            styles={stylesConfig}
        />
    );
}
