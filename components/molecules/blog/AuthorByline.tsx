import { Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import type { Author } from '@/lib/authors/authors';
import { getFirebaseStorageUrl } from '@/lib/utils/getStorageUrl';

interface AuthorBylineProps {
    author: Author;
    locale: string;
    /**
     * Compact: photo + name (uppercased) + date — used in article header.
     * Full: photo + "Written by" + name + shortBio — used in author cards.
     */
    compact?: boolean;
    /** Formatted date string shown only in compact mode. */
    date?: string;
}

export async function AuthorByline({ author, locale, compact = false, date }: AuthorBylineProps) {
    const lang = locale === 'en' ? 'en' : 'bg';
    const t = await getTranslations({ locale, namespace: 'blog.byline' });
    const photoUrl = getFirebaseStorageUrl(author.photo);
    const authorHref = `/author/${author.slug}`;
    const photoSize = compact ? 40 : 48;

    return (
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Link
                href={authorHref}
                aria-label={t('aboutAuthor')}
                style={{ display: 'inline-flex', lineHeight: 0, textDecoration: 'none', flexShrink: 0 }}
            >
                <Image
                    src={photoUrl}
                    alt={author.name[lang]}
                    width={photoSize}
                    height={photoSize}
                    style={{ borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                />
            </Link>

            {compact ? (
                <Stack spacing={0.25}>
                    <Link href={authorHref} style={{ textDecoration: 'none' }}>
                        <Typography
                            component="span"
                            variant="caption"
                            sx={{
                                color: 'text.primary',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            {author.name[lang]}
                        </Typography>
                    </Link>
                    {date && (
                        <Typography variant="caption" color="text.secondary">
                            {date}
                        </Typography>
                    )}
                </Stack>
            ) : (
                <Stack spacing={0}>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.2}>
                        {t('writtenBy')}
                    </Typography>
                    <Link href={authorHref} style={{ textDecoration: 'none' }}>
                        <Typography
                            component="span"
                            sx={{
                                color: 'info.main',
                                fontWeight: 600,
                                '&:hover': { textDecoration: 'underline' },
                            }}
                        >
                            {author.name[lang]}
                        </Typography>
                    </Link>
                    <Typography variant="caption" color="text.secondary" sx={{ maxWidth: '60ch' }}>
                        {author.shortBio[lang]}
                    </Typography>
                </Stack>
            )}
        </Stack>
    );
}
