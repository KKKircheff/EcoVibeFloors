import 'server-only';
import { ProductOverview } from '@/components/ui/sections/product';

export async function VinylOverview() {
    return <ProductOverview translationKey="vinyl" />;
}