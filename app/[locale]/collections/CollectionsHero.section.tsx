import 'server-only';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { HeroWrapper } from '@/components/ui/sections/hero/HeroWrapper';
import { HeroContent } from '@/components/ui/sections/hero/HeroContent';
import heroImage from '../../../public/images/home-page/hero-collections-new.webp';

export async function CollectionsHero() {
    const t = await getTranslations('collections');
    const tButtons = await getTranslations('buttons');

    return (
        <HeroWrapper minHeight={{ xs: '75vh', md: '90vh' }}>
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
                        text: tButtons('exploreCollection'),
                        actionType: 'scroll',
                        target: 'hero-section'
                    }
                ]}
            />
        </HeroWrapper>
    );
}