import 'server-only';
import { getTranslations } from 'next-intl/server';
import { getStyleCardImages } from '@/lib/utils/getStyleCardImages';
import { ProductCollectionGrid } from '@/components/ui/product/ProductCollectionGrid';

export async function ClickVinylCollections() {
    const t = await getTranslations('clickVinyl.collections');
    const tPatterns = await getTranslations('patterns');

    // Get images from product data by SKU for each pattern
    const walvisgraatImages = getStyleCardImages('click-vinyl', 'FLR-3911', 7, 30);
    const natuurImages = getStyleCardImages('click-vinyl', 'FLR-3726', 7, 0);
    const landhuisImages = getStyleCardImages('click-vinyl', 'FLR-3753', 15, 1);
    const tegelImages = getStyleCardImages('click-vinyl', 'FLR-3805', 12, 0);
    const visgraatImages = getStyleCardImages('click-vinyl', 'FLR-3930', 11, 0);

    const stylesConfig = [
        {
            title: tPatterns('walvisgraat-click'),
            description: tPatterns('walvisgraatClickDescription'),
            mainImage: walvisgraatImages.mainImage,
            hoverImage: walvisgraatImages.hoverImage,
            imageAlt: tPatterns('walvisgraat-click'),
            navigationUrl: '/click-vinyl/walvisgraat-click'
        },
        {
            title: tPatterns('visgraat-click'),
            description: tPatterns('visgraatClickDescription'),
            mainImage: visgraatImages.mainImage,
            hoverImage: visgraatImages.hoverImage,
            imageAlt: tPatterns('visgraat-click'),
            navigationUrl: '/click-vinyl/visgraat-click'
        },
        {
            title: tPatterns('natuur-click'),
            description: tPatterns('natuurClickDescription'),
            mainImage: natuurImages.mainImage,
            hoverImage: natuurImages.hoverImage,
            imageAlt: tPatterns('natuur-click'),
            navigationUrl: '/click-vinyl/natuur-click'
        },
        {
            title: tPatterns('landhuis-click'),
            description: tPatterns('landhuisClickDescription'),
            mainImage: landhuisImages.mainImage,
            hoverImage: landhuisImages.hoverImage,
            imageAlt: tPatterns('landhuis-click'),
            navigationUrl: '/click-vinyl/landhuis-click'
        },
        {
            title: tPatterns('tegel-click'),
            description: tPatterns('tegelClickDescription'),
            mainImage: tegelImages.mainImage,
            hoverImage: tegelImages.hoverImage,
            imageAlt: tPatterns('tegel-click'),
            navigationUrl: '/click-vinyl/tegel-click'
        },
    ];

    return (
        <ProductCollectionGrid
            title={t('title')}
            styles={stylesConfig}
        />
    );
}
