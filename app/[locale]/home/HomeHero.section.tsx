import 'server-only';
import { getTranslations } from 'next-intl/server';
import { Box, Stack } from '@mui/material';
import Image from 'next/image';
import { HeroTitle } from '../../../components/ui/typography/HeroTitle';
import { HeroSubtitle } from '../../../components/ui/typography/HeroSubtitle';
import { HeroButton } from '../../../components/ui/buttons/HeroButton';

export async function HomeHero() {
    const t = await getTranslations('home');
    const tButtons = await getTranslations('buttons');

    return (
        <Stack
            sx={{
                position: 'relative',
                minHeight: { xs: `70vh`, md: `90vh` },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }
            }
        >
            <Image
                src="/images/home-page/hero-home.jpg"
                alt="Premium wooden flooring showcase"
                fill
                priority
                style={{
                    objectFit: 'cover',
                    objectPosition: '100% 100%',
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
                    zIndex: 1,
                }}
            />
            <Stack
                spacing={{ xs: 2, lg: 5 }}
                alignItems={'center'}
                // justifyContent={'center'}
                py={{ xs: 8 }}
                sx={{
                    backgroundColor: { xs: 'rgba(0, 0, 0, 0.40)', md: 'rgba(0, 0, 0, 0.35)' },
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    color: 'info.50',
                    maxWidth: '1200px',
                    px: { xs: 3, md: 10 },
                }}
            >
                <HeroTitle>
                    {t('hero.title')}
                </HeroTitle>
                <HeroSubtitle>
                    {t('hero.subtitle')}
                </HeroSubtitle>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} width={'100%'} justifyContent={'center'} alignItems={'center'}>
                    <HeroButton
                        borderColor='lighter'
                        sx={{
                            width: { xs: '100%', md: '50%' },
                            maxWidth: '400px',
                        }}
                    >
                        {tButtons('learnMore')}
                    </HeroButton>
                    <HeroButton
                        borderColor='lighter'
                        sx={{
                            width: { xs: '100%', md: '50%' },
                            maxWidth: '400px',
                        }}
                    >
                        {tButtons('exploreCollection')}
                    </HeroButton>
                </Stack>
            </Stack>
        </ Stack>
    );
}