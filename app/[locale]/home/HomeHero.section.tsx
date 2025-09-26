import 'server-only';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import heroImage from '../../../public/images/home-page/hero-home.webp';
import { HeroWrapper } from '@/components/ui/sections/hero/HeroWrapper';
import { HeroContent } from '@/components/ui/sections/hero/HeroContent';

export async function HomeHero() {
    const t = await getTranslations('home');
    const tButtons = await getTranslations('buttons');

    return (
        <HeroWrapper id='home-hero' minHeight={{ xs: '75vh', md: '90vh' }}>
            <Image
                src={heroImage}
                placeholder="blur"
                alt="Premium wooden flooring showcase"
                fill
                priority
                style={{
                    objectFit: 'cover',
                    objectPosition: '100% 100%',
                }}
                sizes="100vw"
            />
            <HeroContent
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
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
        </HeroWrapper>
    );
}