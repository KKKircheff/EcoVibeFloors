import React from 'react';

interface BlogJsonLdProps {
    title: string;
    description: string;
    slug: string;
    heroImageUrl: string;
    datePublished: Date;
    dateModified: Date;
    schemaType?: 'Article' | 'HowTo' | 'FAQPage';
    locale?: string;
}

export function BlogJsonLd({
    title,
    description,
    slug,
    heroImageUrl,
    datePublished,
    dateModified,
    schemaType = 'Article',
    locale = 'bg',
}: BlogJsonLdProps) {
    const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://ecovibefloors.com';
    const url = `${BASE}/${locale}/blog/${slug}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        headline: title,
        description: description,
        image: heroImageUrl,
        datePublished: datePublished.toISOString(),
        dateModified: dateModified.toISOString(),
        url,
        author: {
            '@type': 'Organization',
            name: 'EcoVibe Floors',
            url: 'https://ecovibefloors.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'EcoVibe Floors',
            url: 'https://ecovibefloors.com',
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
