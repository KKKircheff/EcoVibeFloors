import { Stack, Typography } from '@mui/material';
import { getTranslations } from 'next-intl/server';
import type { BlogSource } from '@/lib/types/blog';

interface BlogSourcesProps {
    sources: BlogSource[];
    locale: string;
}

export async function BlogSources({ sources, locale }: BlogSourcesProps) {
    const t = await getTranslations({ locale, namespace: 'blog.sources' });

    return (
        <Stack
            component="section"
            aria-label={t('title')}
            spacing={1.5}
            pt={4}
            mt={2}
            sx={{ borderTop: '1px solid', borderColor: 'primary.100' }}
        >
            <Typography variant="h6" color="info.main" fontWeight={600}>
                {t('title')}
            </Typography>
            <Stack component="ul" spacing={0.5} sx={{ pl: 3, m: 0 }}>
                {sources.map((s, i) => (
                    <Typography
                        key={i}
                        component="li"
                        variant="body2"
                        color="info.400"
                        lineHeight={1.7}
                    >
                        {s.url ? (
                            <Typography
                                component="a"
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                sx={{ color: 'primary.main', textDecoration: 'underline' }}
                            >
                                {s.label}
                            </Typography>
                        ) : (
                            s.label
                        )}
                    </Typography>
                ))}
            </Stack>
        </Stack>
    );
}
