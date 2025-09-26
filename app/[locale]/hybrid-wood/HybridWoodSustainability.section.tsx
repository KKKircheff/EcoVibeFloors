import 'server-only';
import { ProductSustainability } from '@/components/ui/sections/product';

export async function HybridWoodSustainability() {
    return (
        <ProductSustainability
            translationKey="hybridWood"
            textColor="secondary.contrastText"
        />
    );
}