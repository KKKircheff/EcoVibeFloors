import 'server-only';
import { getTranslations } from 'next-intl/server';
import { HeroSection } from '../../../components/ui/sections/HeroSection';

export async function BlogHero() {
    const t = await getTranslations('blog');
    const tButtons = await getTranslations('buttons');

    return (
        <HeroSection
            title={t('hero.title')}
            subtitle={t('hero.subtitle')}
            imageSrc="/images/home-page/hero.webp"
            imageAlt="Premium wooden flooring showcase"
            buttons={[
                {
                    text: tButtons('readArticles'),
                    actionType: 'scroll',
                    target: 'hero-section'
                }
            ]}
        />
    );
}