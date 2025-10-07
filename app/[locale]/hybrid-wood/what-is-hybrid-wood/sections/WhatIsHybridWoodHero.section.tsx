import 'server-only';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { HeroWrapper } from '@/components/ui/sections/hero/HeroWrapper';
import { HeroContent } from '@/components/ui/sections/hero/HeroContent';
// import heroImage from '../../../../../public/images/home-page/floor-varaiety-hero.webp';
import heroImage from '../../../../../public/images/home-page/hero-c.webp';

export async function WhatIsHybridWoodHero() {
    const t = await getTranslations('whatIsHybridWood.hero');
    const tButtons = await getTranslations('buttons');

    return (
        <HeroWrapper id='hybrid-wood-hero' minHeight={{ xs: '65vh', md: '40vh' }}>
            <Image
                src={heroImage}
                placeholder="blur"
                alt={t('title')}
                fill
                priority
                fetchPriority="high"
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
                sizes="100vw"
            />
            <HeroContent
                title={t('title')}
                subtitle={t('subtitle')}
            />
        </HeroWrapper>
    );
}
