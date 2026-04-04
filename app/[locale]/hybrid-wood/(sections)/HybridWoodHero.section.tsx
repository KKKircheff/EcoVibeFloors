import 'server-only';
import { getTranslations } from 'next-intl/server';
import { CollectionHero } from '@/components/organisms/hero/CollectionHero';

export async function HybridWoodHero() {
    const tHybrid = await getTranslations('hybridWood.hero');

    return (
        <CollectionHero
            title={tHybrid('title')}
            subtitle={tHybrid('subtitle')}
            learnMoreText={tHybrid('learnMore')}
            learnMoreTargetId="hybrid-wood-learn-more"
        />
    );
}