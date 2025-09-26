import 'server-only';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { HeroWrapper } from '@/components/ui/sections/hero/HeroWrapper';
import { HeroContent } from '@/components/ui/sections/hero/HeroContent';
import heroImage from '../../../public/images/home-page/hero.webp';

export async function VinylHero() {
    const t = await getTranslations('vinyl');
    const tButtons = await getTranslations('buttons');

    return (
        <HeroWrapper>
            <Image
                src={heroImage}
                alt="Premium vinyl flooring showcase"
                fill
                priority
                placeholder="blur"
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
                sizes="100vw"
            />
            <HeroContent
                title={t('hero.title')}
                subtitle={t('hero.subtitle')}
                buttons={[
                    {
                        text: tButtons('exploreCollection'),
                        actionType: 'scroll',
                        target: 'hero-section'
                    }
                ]}
            />
        </HeroWrapper>
    );
}