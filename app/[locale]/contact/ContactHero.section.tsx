import 'server-only';
import { getTranslations } from 'next-intl/server';
import { HeroSection } from '../../../components/ui/sections/HeroSection';

export async function ContactHero() {
    const t = await getTranslations('contact');
    const tButtons = await getTranslations('buttons');

    return (
        <HeroSection
            title={t('hero.title')}
            subtitle={t('hero.subtitle')}
            imageSrc="/images/home-page/hero-b.webp"
            imageAlt="Premium wooden flooring showcase"
            imagePosition="100% 100%"
            buttons={[
                {
                    text: tButtons('contactNow'),
                    actionType: 'scroll',
                    target: 'contact-form'
                }
            ]}
        />
    );
}