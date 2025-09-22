'use client';
import { useTranslations } from 'next-intl';
import { Box, Stack } from '@mui/material';
import Image from 'next/image';
import { HeroTitle } from '../../../components/ui/typography/HeroTitle';
import { HeroSubtitle } from '../../../components/ui/typography/HeroSubtitle';
import { HeroButton } from '../../../components/ui/buttons/HeroButton';

export function ContactHero() {
    const t = useTranslations('contact');
    const tButtons = useTranslations('buttons');

    const scrollToForm = () => {
        const formElement = document.getElementById('contact-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                src="/images/home-page/hero-b.webp"
                alt="Premium wooden flooring showcase"
                fill
                priority
                style={{
                    objectFit: 'cover',
                    // objectPosition: 'bottom',
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
                    backgroundColor: 'rgba(0, 0, 0, 0.20)',
                    zIndex: 1,
                }}
            />
            <Stack
                spacing={{ xs: 2, lg: 5 }}
                alignItems={'center'}
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
                <HeroButton
                    borderColor='light'
                    onClick={scrollToForm}
                    sx={{
                        maxWidth: '400px',
                    }}
                >
                    {tButtons('contactNow')}
                </HeroButton>
            </Stack>
        </Stack>
    );
}