import 'server-only';
import { getTranslations } from 'next-intl/server';
import { CollectionHero } from '@/components/ui/sections/hero/CollectionHero.section';

export async function ClickVinylHero() {
    const t = await getTranslations('clickVinyl.hero');

    return (
        <CollectionHero
            title={t('title')}
            subtitle={t('subtitle')}
            learnMoreText={t('learnMore')}
            learnMoreTargetId="click-vinyl-learn-more"
        />
    );
}
