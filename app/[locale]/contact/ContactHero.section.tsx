'use client';
import { useTranslations } from 'next-intl';
import { HeroSection } from '../../../components/ui/sections/HeroSection';

export function ContactHero() {
    const t = useTranslations('contact');
    const tButtons = useTranslations('buttons');

    const scrollToForm = () => {
        const formElement = document.getElementById('contact-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                    onClick: scrollToForm
                }
            ]}
        />
    );
}