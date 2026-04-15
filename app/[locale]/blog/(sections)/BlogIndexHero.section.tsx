import 'server-only';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { HeroWrapper } from '@/components/organisms/hero/HeroWrapper';
import { HeroContent } from '@/components/organisms/hero/HeroContent';
import heroImage from '../../../../public/images/home-page/hero.webp';

export async function BlogIndexHero() {
    const t = await getTranslations('blog.hero');

    return (
        <HeroWrapper minHeight={{ xs: '60vh', md: '45vh' }}>
            <Image
                src={heroImage}
                alt="EcoVibe Floors Blog"
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
                title={t('title')}
                subtitle={t('subtitle')}
            />
        </HeroWrapper>
    );
}
