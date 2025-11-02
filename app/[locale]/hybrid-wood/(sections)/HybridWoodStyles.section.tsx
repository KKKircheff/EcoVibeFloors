import 'server-only';
import { getTranslations } from 'next-intl/server';
import { getStyleCardImages } from '@/lib/utils/getStyleCardImages';
import { ProductCollectionGrid } from '@/components/ui/product/ProductCollectionGrid';

export async function HybridWoodStyles() {
    const t = await getTranslations('hybridWood.styles');
    const tPatterns = await getTranslations('patterns');

    // Get images from product data by SKU (all 6 patterns)
    const classicEvoImages = getStyleCardImages('hybrid-wood', '1101280228', 0, 2);
    const noblessseEvoImages = getStyleCardImages('hybrid-wood', '1101280128', 0, 2);
    const herringboneEvoImages = getStyleCardImages('hybrid-wood', '1101281421', 0, 2);
    const classicOlioImages = getStyleCardImages('hybrid-wood', '1101280236', 0, 2);
    const noblessseOlioImages = getStyleCardImages('hybrid-wood', '1101280136', 0, 2);
    const herringboneOlioImages = getStyleCardImages('hybrid-wood', '1101281428', 0, 2);

    const stylesConfig = [
        {
            title: tPatterns('classic-evo'),
            dimensions: t('classicEvo.dimensions', { defaultValue: '2197 × 233 × 11 mm' }),
            description: t('classicEvo.description', { defaultValue: tPatterns('classic-evoDescription') }),
            mainImage: classicEvoImages.mainImage,
            hoverImage: classicEvoImages.hoverImage,
            imageAlt: tPatterns('classic-evo'),
            navigationUrl: '/hybrid-wood/classic-evo'
        },
        {
            title: tPatterns('noblessse-evo'),
            dimensions: t('noblessseEvo.dimensions', { defaultValue: '2375 × 270 × 11 mm' }),
            description: t('noblessseEvo.description', { defaultValue: tPatterns('noblessse-evoDescription') }),
            mainImage: noblessseEvoImages.mainImage,
            hoverImage: noblessseEvoImages.hoverImage,
            imageAlt: tPatterns('noblessse-evo'),
            navigationUrl: '/hybrid-wood/noblessse-evo'
        },
        {
            title: tPatterns('herringbone-evo'),
            dimensions: t('herringboneEvo.dimensions', { defaultValue: '774 × 129 × 11 mm' }),
            description: t('herringboneEvo.description', { defaultValue: tPatterns('herringbone-evoDescription') }),
            mainImage: herringboneEvoImages.mainImage,
            hoverImage: herringboneEvoImages.hoverImage,
            imageAlt: tPatterns('herringbone-evo'),
            navigationUrl: '/hybrid-wood/herringbone-evo'
        },
        {
            title: tPatterns('classic-olio'),
            dimensions: t('classicOlio.dimensions', { defaultValue: '2197 × 233 × 11 mm' }),
            description: t('classicOlio.description', { defaultValue: tPatterns('classic-olioDescription') }),
            mainImage: classicOlioImages.mainImage,
            hoverImage: classicOlioImages.hoverImage,
            imageAlt: tPatterns('classic-olio'),
            navigationUrl: '/hybrid-wood/classic-olio'
        },
        {
            title: tPatterns('noblessse-olio'),
            dimensions: t('noblessseOlio.dimensions', { defaultValue: '2375 × 270 × 11 mm' }),
            description: t('noblessseOlio.description', { defaultValue: tPatterns('noblessse-olioDescription') }),
            mainImage: noblessseOlioImages.mainImage,
            hoverImage: noblessseOlioImages.hoverImage,
            imageAlt: tPatterns('noblessse-olio'),
            navigationUrl: '/hybrid-wood/noblessse-olio'
        },
        {
            title: tPatterns('herringbone-olio'),
            dimensions: t('herringboneOlio.dimensions', { defaultValue: '546 × 91 × 11 mm' }),
            description: t('herringboneOlio.description', { defaultValue: tPatterns('herringbone-olioDescription') }),
            mainImage: herringboneOlioImages.mainImage,
            hoverImage: herringboneOlioImages.hoverImage,
            imageAlt: tPatterns('herringbone-olio'),
            navigationUrl: '/hybrid-wood/herringbone-olio'
        }
    ];

    return (
        <ProductCollectionGrid
            title={t('title')}
            styles={stylesConfig}
        />
    );
}