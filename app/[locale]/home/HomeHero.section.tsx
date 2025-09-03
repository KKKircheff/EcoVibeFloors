import 'server-only';
import { getTranslations } from 'next-intl/server';
import { Box, Typography, Button, Stack } from '@mui/material';
import Image from 'next/image';

export async function HomeHero() {
    const t = await getTranslations('home');
    const tButtons = await getTranslations('buttons');

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: { xs: `75vh`, md: `80vh` },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            <Image
                src="/images/home-page/hero-b.webp"
                alt="Premium wooden flooring showcase"
                fill
                priority
                style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
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
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    zIndex: 1,
                }}
            />
            <Stack
                spacing={{ xs: 2, lg: 5 }}
                alignItems={'center'}
                // justifyContent={'center'}
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
                    component="h1"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    }}
                >
                    {t('hero.title')}
                </Typography>
                <Typography
                    variant="h5"
                    component="p"
                    pb={3}
                    sx={{
                        fontSize: { xs: '1.1rem', md: '1.3rem' },
                        lineHeight: 1.6,
                    }}
                >
                    {t('hero.subtitle')}
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        maxWidth: '400px'
                    }}
                >
                    {tButtons('exploreCollection')}
                </Button>
            </Stack>
        </Box>
    );
}