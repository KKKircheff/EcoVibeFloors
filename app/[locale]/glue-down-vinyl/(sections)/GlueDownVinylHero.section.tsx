import 'server-only';
import { getTranslations } from 'next-intl/server';
import { CollectionHero } from '@/components/organisms/hero/CollectionHero';

export async function GlueDownVinylHero() {
    const t = await getTranslations('glueDownVinyl.hero');

    return (
        <CollectionHero
            title={t('title')}
            subtitle={t('subtitle')}
            learnMoreText={t('learnMore')}
            learnMoreTargetId="glue-down-vinyl-learn-more"
        />
    );
}
