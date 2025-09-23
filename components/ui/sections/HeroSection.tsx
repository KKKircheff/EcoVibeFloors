import React, { ReactNode } from 'react';
import { Box, Stack, SxProps, Theme } from '@mui/material';
import Image from 'next/image';
import { HeroTitle } from '../typography/HeroTitle';
import { HeroSubtitle } from '../typography/HeroSubtitle';
import { HeroButton } from '../buttons/HeroButton';

interface HeroButtonConfig {
    text: string;
    onClick?: () => void;
    href?: string;
    sx?: SxProps<Theme>;
}

interface HeroSectionProps {
    // Content
    title: string | ReactNode;
    subtitle: string | ReactNode;

    // Image
    imageSrc: string;
    imageAlt: string;
    imagePosition?: string;

    // Buttons (flexible configuration)
    buttons?: HeroButtonConfig[];

    // Customization
    minHeight?: { xs: string; md?: string };
    overlayOpacity?: number;
    contentBackgroundOpacity?: { xs: number; md: number };
}

export const HeroSection = ({
    title,
    subtitle,
    imageSrc,
    imageAlt,
    imagePosition = 'bottom',
    buttons = [],
    minHeight = { xs: '90vh', md: '90vh' },
    overlayOpacity = 0.20,
    contentBackgroundOpacity = { xs: 0.40, md: 0.35 }
}: HeroSectionProps) => {
    return (
        <Stack
            sx={{
                position: 'relative',
                minHeight: minHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                style={{
                    objectFit: 'cover',
                    objectPosition: imagePosition,
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
                    backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
                    zIndex: 1,
                }}
            />
            <Stack
                spacing={{ xs: 2, lg: 5 }}
                alignItems="center"
                py={{ xs: 8 }}
                sx={{
                    backgroundColor: {
                        xs: `rgba(0, 0, 0, ${contentBackgroundOpacity.xs})`,
                        md: `rgba(0, 0, 0, ${contentBackgroundOpacity.md})`
                    },
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    color: 'info.50',
                    maxWidth: '1200px',
                    px: { xs: 3, md: 10 },
                }}
            >
                <HeroTitle>
                    {title}
                </HeroTitle>
                <HeroSubtitle>
                    {subtitle}
                </HeroSubtitle>

                {buttons.length > 0 && (
                    <Stack
                        direction={{ xs: 'column', md: buttons.length > 1 ? 'row' : 'column' }}
                        spacing={3}
                        width="100%"
                        justifyContent="center"
                        alignItems="center"
                    >
                        {buttons.map((button, index) => (
                            <HeroButton
                                key={index}
                                onClick={button.onClick}
                                href={button.href}
                                sx={{
                                    width: buttons.length > 1 ? { xs: '100%', md: '50%' } : 'auto',
                                    maxWidth: '400px',
                                    ...button.sx
                                }}
                            >
                                {button.text}
                            </HeroButton>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Stack>
    );
};