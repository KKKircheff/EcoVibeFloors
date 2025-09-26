import 'server-only';
import { ProductStyles } from '@/components/ui/sections/product';

export async function HybridWoodStyles() {
    const stylesConfig = [
        {
            titleKey: 'styles.xlPlanks.title',
            dimensionsKey: 'styles.xlPlanks.dimensions',
            descriptionKey: 'styles.xlPlanks.description',
            imageCaptionKey: 'styles.xlPlanks.imageCaption'
        },
        {
            titleKey: 'styles.herringbone.title',
            dimensionsKey: 'styles.herringbone.dimensions',
            descriptionKey: 'styles.herringbone.description',
            imageCaptionKey: 'styles.herringbone.imageCaption'
        }
    ];

    return (
        <ProductStyles
            translationKey="hybridWood"
            styles={stylesConfig}
        />
    );
}