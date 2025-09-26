import 'server-only';
import { ProductCollections } from '@/components/ui/sections/product';

export async function VinylCollections() {
    const collectionsConfig = [
        {
            name: 'tileVinyl',
            iconColor: 'primary' as const,
            features: ['waterproof', 'underfloorHeating', 'dampAreas']
        },
        {
            name: 'herringboneVinyl',
            iconColor: 'secondary' as const,
            features: ['elegantPattern', 'commercialGrade', 'clickSystem']
        },
        {
            name: 'natureRigid',
            iconColor: 'primary' as const,
            features: ['rigidCore', 'commercialUse', 'scratchResistant']
        },
        {
            name: 'villageVinyl',
            iconColor: 'secondary' as const,
            features: ['realisticOak', 'versatile', 'durable']
        },
        {
            name: 'forestVinyl',
            iconColor: 'primary' as const,
            features: ['extraWide', 'uniqueEffect', 'premiumLook']
        }
    ];

    return (
        <ProductCollections
            translationKey="vinyl"
            collections={collectionsConfig}
        />
    );
}