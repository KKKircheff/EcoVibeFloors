import 'server-only';
import { getTranslations } from 'next-intl/server';
import { HeroSection } from '../../../components/ui/sections/HeroSection';

export async function HomeHero() {
    const t = await getTranslations('home');
    const tButtons = await getTranslations('buttons');

    return (
        <HeroSection
            id='home-hero'
            title={t('hero.title')}
            subtitle={t('hero.subtitle')}
            imageSrc="/images/home-page/hero-home.jpg"
            imageAlt="Premium wooden flooring showcase"
            imagePosition="100% 100%"
            minHeight={{ xs: '70vh', md: '90vh' }}
            overlayOpacity={0}
            buttons={[
                {
                    text: tButtons('learnMore'),
                    actionType: 'scroll',
                    target: 'home-hero'
                },
                {
                    text: tButtons('exploreCollection'),
                    actionType: 'navigate',
                    target: '/collections'
                }
            ]}
        />
    );
}