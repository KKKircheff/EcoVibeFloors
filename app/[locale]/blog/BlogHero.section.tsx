import 'server-only';
import { getTranslations } from 'next-intl/server';
import { Box, Typography, Button, Stack } from '@mui/material';
import Image from 'next/image';
import { palette } from '@/lib/styles/pallete';

export async function BlogHero() {
    const t = await getTranslations('blog');
    const tButtons = await getTranslations('buttons');

    return (
        <Stack
            sx={{
                position: 'relative',
                minHeight: { xs: `90vh`, md: `90vh` },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }
            }
        >
            <Image
                src="/images/home-page/hero.webp"
                alt="Premium wooden flooring showcase"
                fill
                priority
                style={{
                    objectFit: 'cover',
                    objectPosition: 'bottom',
                }}
                sizes="100vw"
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.20)',
                    zIndex: 1,
                }}
            />
            <Stack
                spacing={{ xs: 2, lg: 5 }}
                alignItems={'center'}
                pt={{ xs: 0, md: 12 }}
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    color: 'info.50',
                    maxWidth: '1100px',
                    px: { xs: 3, md: 6 },
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    {t('hero.title')}
                </Typography>
                <Typography
                    variant="h5"
                    component="p"
                    pb={3}
                    sx={{
                        lineHeight: 1.6,
                    }}
                >
                    {t('hero.subtitle')}
                </Typography>
                <Button
                    variant='text'
                    size="large"
                    sx={{
                        border: `2px solid ${palette.info[200]}`,
                        px: 4,
                        py: 2.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        maxWidth: '400px',
                        color: palette.info[50],
                        '&:hover': {
                            bgcolor: 'primary.700',
                        }
                    }}
                >
                    {tButtons('readArticles')}
                </Button>
            </Stack>
        </Stack>
    );
}