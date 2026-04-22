import type { Author } from '@/lib/authors/authors';
import type { BlogFaqItem, BlogSource } from '@/lib/types/blog';

interface BlogJsonLdProps {
    title: string;
    description: string;
    slug: string;
    heroImageUrl: string;
    datePublished: Date;
    dateModified: Date;
    schemaType?: 'Article' | 'HowTo' | 'FAQPage';
    locale?: string;
    author: Author;
    faq?: BlogFaqItem[];
    sources?: BlogSource[];
}

const FAQ_MIN_FOR_SCHEMA = 3;

export function BlogJsonLd({
    title,
    description,
    slug,
    heroImageUrl,
    datePublished,
    dateModified,
    schemaType = 'Article',
    locale = 'bg',
    author,
    faq,
    sources,
}: BlogJsonLdProps) {
    const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://ecovibefloors.com';
    const url = `${BASE}/${locale}/blog/${slug}`;
    const lang = locale === 'en' ? 'en' : 'bg';

    const linkedSources = (sources ?? []).filter((s) => s.url);
    const authorSameAs = author.socialLinks.linkedin ? [author.socialLinks.linkedin] : undefined;

    const article: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': schemaType,
        headline: title,
        description,
        image: heroImageUrl,
        datePublished: datePublished.toISOString(),
        dateModified: dateModified.toISOString(),
        url,
        inLanguage: lang,
        author: {
            '@type': 'Person',
            name: author.name[lang],
            jobTitle: author.jobTitle[lang],
            url: `${BASE}/${locale}/author/${author.slug}`,
            ...(authorSameAs ? { sameAs: authorSameAs } : {}),
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
        speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['.key-takeaway-box'],
        },
    };

    if (linkedSources.length > 0) {
        article.citation = linkedSources.map((s) => ({
            '@type': 'CreativeWork',
            name: s.label,
            url: s.url,
        }));
    }

    const emitFaq = faq && faq.length >= FAQ_MIN_FOR_SCHEMA;
    const faqLd = emitFaq
        ? {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faq.map((item) => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: {
                      '@type': 'Answer',
                      text: item.answer,
                  },
              })),
          }
        : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
            />
            {faqLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
                />
            )}
        </>
    );
}
