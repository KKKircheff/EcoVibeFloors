import 'server-only';
import { getTranslations } from 'next-intl/server';
import { HeroSection } from '../../../components/ui/sections/HeroSection';

export async function OakHero() {
    const t = await getTranslations('oak');
    const tButtons = await getTranslations('buttons');

    return (
        <HeroSection
            title={t('hero.title')}
            subtitle={t('hero.subtitle')}
            imageSrc="/images/home-page/hero.webp"
            imageAlt="Premium oak flooring showcase"
            buttons={[
                {
                    text: tButtons('exploreCollection')
                }
            ]}
        />
    );
}