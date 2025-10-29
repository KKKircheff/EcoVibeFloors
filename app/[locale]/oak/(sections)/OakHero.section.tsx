import 'server-only';
import { getTranslations } from 'next-intl/server';
import { CollectionHero } from '@/components/ui/sections/hero/CollectionHero.section';
import Image from 'next/image';
import { HeroContent } from '@/components/ui/sections/hero/HeroContent';
import { HeroWrapper } from '@/components/ui/sections/hero/HeroWrapper';
import heroImage from '../../../../public/images/home-page/hero-c.webp';

export async function OakHero() {
    const t = await getTranslations('oakFlooring.hero');

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
