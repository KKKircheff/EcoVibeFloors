import 'server-only';
import { getTranslations } from 'next-intl/server';
import { CollectionHero } from '@/components/ui/sections/hero/CollectionHero.section';

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
