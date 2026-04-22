import type { Author } from '@/lib/authors/authors';

interface PersonJsonLdProps {
    author: Author;
    photoUrl: string;
    locale: string;
}

export function PersonJsonLd({ author, photoUrl, locale }: PersonJsonLdProps) {
    const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://ecovibefloors.com';
    const lang = locale === 'en' ? 'en' : 'bg';
    const url = `${BASE}/${locale}/author/${author.slug}`;

    const jsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: author.name[lang],
        jobTitle: author.jobTitle[lang],
        description: author.shortBio[lang],
        image: photoUrl,
        url,
        knowsAbout: author.specialties[lang],
        worksFor: {
            '@type': 'Organization',
            name: 'EcoVibe Floors',
            url: 'https://ecovibefloors.com',
        },
    };

    if (author.socialLinks.linkedin) {
        jsonLd.sameAs = [author.socialLinks.linkedin];
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
