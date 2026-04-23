import 'server-only';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Box, Chip, Stack, Typography } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

import PageLayoutContainer from '@/components/layout/PageLayoutContainer';
import { PersonJsonLd } from '@/components/atoms/seo/PersonJsonLd';
import { BlogPostCard } from '@/components/organisms/blog/BlogPostCard';
import { AUTHORS, getAllAuthorSlugs, getAuthor, type AuthorSlug } from '@/lib/authors/authors';
import { buildAlternates } from '@/lib/seo';
import { getBlogPostsByAuthor } from '@/lib/firebase/blog';
import { getFirebaseStorageUrl } from '@/lib/utils/getStorageUrl';
import { routing } from '@/i18n/routing';

export const dynamicParams = false;

interface AuthorPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const params: { locale: string; slug: string }[] = [];
    for (const slug of getAllAuthorSlugs()) {
        for (const locale of routing.locales) {
            params.push({ locale, slug });
        }
    }
    return params;
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    if (!(slug in AUTHORS)) return {};
    const author = getAuthor(slug as AuthorSlug);
    const lang = locale === 'en' ? 'en' : 'bg';
    return {
        title: `${author.name[lang]} — ${author.jobTitle[lang]} | EcoVibe Floors`,
        description: author.shortBio[lang],
        alternates: buildAlternates(locale, `/author/${slug}`),
    };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    if (!(slug in AUTHORS)) notFound();

    const author = getAuthor(slug as AuthorSlug);
    const lang = locale === 'en' ? 'en' : 'bg';
    const photoUrl = getFirebaseStorageUrl(author.photo);
    const t = await getTranslations({ locale, namespace: 'author' });

    const posts = await getBlogPostsByAuthor(author.slug, locale);

    return (
        <>
            <PersonJsonLd author={author} photoUrl={photoUrl} locale={locale} />

            <PageLayoutContainer py={{ xs: 6, md: 10 }} spacing={6}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems={{ xs: 'center', md: 'flex-start' }}>
                    <Box
                        sx={{
                            width: { xs: 160, md: 200 },
                            height: { xs: 160, md: 200 },
                            position: 'relative',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            flexShrink: 0,
                        }}
                    >
                        <Image
                            src={photoUrl}
                            alt={author.name[lang]}
                            fill
                            sizes="200px"
                            style={{ objectFit: 'cover' }}
                        />
                    </Box>
                    <Stack spacing={1.5} textAlign={{ xs: 'center', md: 'left' }}>
                        <Typography variant="h1" color="info.main" fontWeight={600}>
                            {author.name[lang]}
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight={500}>
                            {author.jobTitle[lang]}
                        </Typography>
                        <Typography variant="body1" color="info.400">
                            {author.shortBio[lang]}
                        </Typography>
                        {author.socialLinks.linkedin && (
                            <Stack direction="row" spacing={1} alignItems="center" pt={1} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                                <LinkedInIcon fontSize="small" />
                                <Typography
                                    component="a"
                                    href={author.socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: 'primary.main', textDecoration: 'underline' }}
                                >
                                    {t('linkedin')}
                                </Typography>
                            </Stack>
                        )}
                    </Stack>
                </Stack>

                {/* Bio */}
                <Stack spacing={2}>
                    {author.bio[lang].split(/\n{2,}/).map((paragraph, i) => (
                        <Typography key={i} variant="body1" color="info.400" lineHeight={1.8}>
                            {paragraph}
                        </Typography>
                    ))}
                </Stack>

                {/* Specialties */}
                <Stack spacing={1.5}>
                    <Typography variant="h5" color="info.main" fontWeight={600}>
                        {t('specialties')}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                        {author.specialties[lang].map((s, i) => (
                            <Chip key={i} label={s} variant="outlined" color="primary" />
                        ))}
                    </Stack>
                </Stack>

                {/* Posts by this author */}
                {posts.length > 0 && (
                    <Stack spacing={3}>
                        <Typography variant="h4" color="info.main" fontWeight={600}>
                            {t('postsByAuthor')}
                        </Typography>
                        <Stack direction={{ xs: 'column', md: 'row' }} flexWrap="wrap" gap={3}>
                            {posts.map((post) => (
                                <Box key={post.slug} sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
                                    <BlogPostCard post={post} locale={locale === 'en' ? 'en' : 'bg'} />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                )}
            </PageLayoutContainer>
        </>
    );
}
