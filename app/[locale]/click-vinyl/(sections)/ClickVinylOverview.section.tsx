import 'server-only';
import { ProductOverview } from '@/components/organisms/product-sections/ProductOverview';

export async function ClickVinylOverview() {
    return <ProductOverview translationKey="clickVinyl" />;
}