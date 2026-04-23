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
    name: {bg: string; en: string};
    jobTitle: {bg: string; en: string};
    /** 1-sentence byline shown under the blog post title. */
    shortBio: {bg: string; en: string};
    /** 2-3 paragraphs shown on the author bio page. */
    bio: {bg: string; en: string};
    experienceYears: number;
    specialties: {bg: string[]; en: string[]};
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
            bg: 'Специалист подови настилки, приложни конструкции и инженерни решения',
            en: 'Specialist in Flooring, Applied Structures, and Engineering Solutions',
        },
        shortBio: {
            bg: '6 години опит в подовите настилки, инженерни решения и металните изделия.',
            en: '6 years of experience in flooring, engineering sollutions and metal products.',
        },
        bio: {
            bg: 'Запознайте се с Ганчо Георгиев - Експерт по подови настилки и Съосновател на Ecovibefloors\n\nГанчо Георгиев не просто познава подовите настилки - това е негова страст. Като съосновател на Ecovibefloors, той е посветил усилията си на това да помага на хората да открият идеалната настилка за своите домове. С шест години практически опит и партньорства с някои от най-добрите европейски марки, Ганчо знае какво прави една настилка красива, издръжлива и готова за реалния живот. Деца, домашни любимци, подово отопление - той ще помогне. В този блог той не използва объркващи термини и ви предлага прости, честни съвети, на които можете да се доверите. Когато не мисли за настилки, ще го намерите за риба, да гледа футбол и да почива със семейството.',
            en: "Meet Gancho Georgiev: Flooring Expert & Co-Founder of Ecovibefloors\n\nGancho Georgiev doesn't just know floors—he's passionate about them. As the co-founder of Ecovibefloors, he's made it his mission to help people find the perfect flooring for their homes. With six years of hands-on experience and partnerships with some of Europe's top flooring brands, Gancho understands what makes a floor beautiful, durable, and ready for real life. Kids, pets, floor heating - he'll help. On this blog, he cuts through the jargon to give you straightforward, honest advice you can trust. When he's not thinking about floors, you'll find him fishing or enjoying a football game and time with his family.",
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
