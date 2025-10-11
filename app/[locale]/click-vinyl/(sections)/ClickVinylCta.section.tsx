import 'server-only';
import { ProductCta } from '@/components/ui/sections/product';

export async function ClickVinylCta() {
    return <ProductCta translationKey="clickVinyl" />;
}