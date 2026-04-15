import 'server-only';
import Image from 'next/image';
import { HeroWrapper } from '@/components/organisms/hero/HeroWrapper';
import { HeroContent } from '@/components/organisms/hero/HeroContent';
import { BlogCategoryBadge } from '@/components/atoms/blog/BlogCategoryBadge';

interface BlogPostHeroProps {
    title: string;
    heroImageUrl: string;
}

export function BlogPostHero({ title, heroImageUrl }: BlogPostHeroProps) {
    return (
        <HeroWrapper minHeight={{ xs: '65vh', md: '65vh' }}>
            <Image
                src={heroImageUrl}
                alt={title}
                fill
                priority
                placeholder="empty"
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                }}
                sizes="100vw"
            />
            <HeroContent
                title={title}
                subtitle=""
            />
        </HeroWrapper>
    );
}
