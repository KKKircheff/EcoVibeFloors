import 'server-only';
import { getTranslations } from 'next-intl/server';
import { CollectionHero } from '@/components/organisms/hero/CollectionHero';

export async function OakHero() {
    const tOak = await getTranslations('oak.hero');
    const tButtons = await getTranslations('buttons');

    return (
        <CollectionHero
            title={tOak('title')}
            subtitle={tOak('subtitle')}
            learnMoreText={tButtons('learnMore')}
            learnMoreTargetId="oak-learn-more"
        />
    );
}