import 'server-only';
import { getTranslations } from 'next-intl/server';
import { CollectionHero } from '@/components/organisms/hero/CollectionHero';
import Image from 'next/image';
import { HeroContent } from '@/components/organisms/hero/HeroContent';
import { HeroWrapper } from '@/components/organisms/hero/HeroWrapper';
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
