/**
 * Hardcoded author registry for EcoVibe Floors blog.
 *
 * Single source of truth for author data. The content hub's blog-post-schema.js
 * restricts `author` to the keys of AUTHORS below; the Next.js app resolves the
 * slug against this registry when rendering bylines, author pages, and Person
 * JSON-LD.
 *
 * Adding an author:
 *   1. Add a new entry to AUTHORS and append the slug to the AuthorSlug union.
 *   2. Mirror the slug in scripts/blog-post-schema.js in the content hub (author.enum).
 *   3. Upload the author photo to Firebase Storage at the path in `photo`.
 */

export type AuthorSlug = 'gancho-georgiev';

export interface Author {
    slug: AuthorSlug;
    name: { bg: string; en: string };
    jobTitle: { bg: string; en: string };
    /** 1-sentence byline shown under the blog post title. */
    shortBio: { bg: string; en: string };
    /** 2-3 paragraphs shown on the author bio page. */
    bio: { bg: string; en: string };
    experienceYears: number;
    specialties: { bg: string[]; en: string[] };
    /** Firebase Storage path: authors/{slug}/photo.webp */
    photo: string;
    socialLinks: {
        linkedin?: string;
    };
}

export const AUTHORS: Record<AuthorSlug, Author> = {
    'gancho-georgiev': {
        slug: 'gancho-georgiev',
        name: {
            bg: 'Ганчо Георгиев',
            en: 'Gancho Georgiev',
        },
        jobTitle: {
            bg: 'Специалист подови настилки и строителни материали',
            en: 'Flooring & Construction Materials Specialist',
        },
        shortBio: {
            bg: '6 години опит в строителството, подовите настилки и металните изделия.',
            en: '6 years of experience in construction, flooring, and metal products.',
        },
        bio: {
            bg: '[TBD — draft with Kiril and Ганчо]',
            en: '[TBD — draft with Kiril and Ганчо]',
        },
        experienceYears: 6,
        specialties: {
            bg: ['Инженерен паркет', 'Хибридни настилки', 'Подово отопление', 'Монтаж на паркет'],
            en: ['Engineered parquet', 'Hybrid flooring', 'Underfloor heating', 'Parquet installation'],
        },
        photo: 'authors/gancho-georgiev/photo.webp',
        socialLinks: {},
    },
};

export function getAuthor(slug: AuthorSlug | string | undefined): Author {
    if (slug && slug in AUTHORS) return AUTHORS[slug as AuthorSlug];
    return AUTHORS['gancho-georgiev'];
}

export function getAllAuthorSlugs(): AuthorSlug[] {
    return Object.keys(AUTHORS) as AuthorSlug[];
}
