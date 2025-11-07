import 'server-only';
import { getTranslations } from 'next-intl/server';
import { getStyleCardImages } from '@/lib/utils/getStyleCardImages';
import { ProductCollectionGrid } from '@/components/ui/product/ProductCollectionGrid';

export async function GlueDownVinylCollections() {
    const t = await getTranslations('glueDownVinyl.collections');
    const tPatterns = await getTranslations('patterns');

    // Get images from product data by SKU for each pattern
    const dorpenImages = getStyleCardImages('glue-down-vinyl', 'FLR-3040', 8, 3);
    const landhuisImages = getStyleCardImages('glue-down-vinyl', 'FLR-3234', 11, 9);
    const hongaarsePuntImages = getStyleCardImages('glue-down-vinyl', 'FLR-3571', 10, 0);

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
            title: tPatterns('landhuis'),
            description: tPatterns('landhuisDescription'),
            mainImage: landhuisImages.mainImage,
            hoverImage: landhuisImages.hoverImage,
            imageAlt: tPatterns('landhuis'),
            navigationUrl: '/glue-down-vinyl/landhuis'
        },
        {
            title: tPatterns('hongaarse-punt'),
            description: tPatterns('hongaarsePuntDescription'),
            mainImage: hongaarsePuntImages.mainImage,
            hoverImage: hongaarsePuntImages.hoverImage,
            imageAlt: tPatterns('hongaarse-punt'),
            navigationUrl: '/glue-down-vinyl/hongaarse-punt'
        },
    ];

    return (
        <ProductCollectionGrid
            title={t('title')}
            styles={stylesConfig}
        />
    );
}
