import 'server-only';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { HeroWrapper } from '@/components/ui/sections/hero/HeroWrapper';
import { HeroContent } from '@/components/ui/sections/hero/HeroContent';
import heroImage from '../../../public/images/home-page/hero-b.webp';

export async function ContactHero() {
    const t = await getTranslations('contact');
    const tButtons = await getTranslations('buttons');

    return (
        <HeroWrapper>
            <Image
                src={heroImage}
                alt="Premium wooden flooring showcase"
                fill
                priority
                placeholder="blur"
                style={{
                    objectFit: 'cover',
                    objectPosition: '100% 100%',
                }}
                sizes="100vw"
            />
            <HeroContent
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
                buttons={[
                    {
                        text: tButtons('contactNow'),
                        actionType: 'scroll',
                        target: 'contact-form'
                    }
                ]}
            />
        </HeroWrapper>
    );
}