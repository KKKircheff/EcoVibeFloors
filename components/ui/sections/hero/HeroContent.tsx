import React, { ReactNode } from 'react';
import { alpha, Box, Stack, SxProps, Theme } from '@mui/material';
import { HeroTitle } from '../../typography/HeroTitle';
import { HeroSubtitle } from '../../typography/HeroSubtitle';
import { HeroButtonGroup } from './HeroButtonGroup';
import { palette } from '@/lib/styles/pallete';

interface HeroButtonConfig {
    text: string;
    href?: string;
    actionType?: 'scroll' | 'navigate';
    target?: string;
    sx?: SxProps<Theme>;
    buttonVariant?: 'primary' | 'secondary';
}

interface HeroContentProps {
    title: string;
    subtitle: string;
    buttons?: HeroButtonConfig[];
}

export const heroTextsbackground = alpha(palette.primary[700], 0.8)

export const HeroContent = ({
    title,
    subtitle,
    buttons = [],
}: HeroContentProps) => {


    return (
        <Stack spacing={{ xs: 4, lg: 12 }} width={'100%'} pt={{ xs: buttons.length ? 6 : 0, md: buttons.length ? 20 : 0 }}>
            <Stack
                spacing={{ xs: 2, lg: 3 }}
                alignItems="center"
                py={{ xs: 4, sm: 6 }}
                bgcolor={heroTextsbackground}
                sx={{
                    backdropFilter: 'blur(6px)',
                    position: 'relative',
                    zIndex: 2,
                    textAlign: 'center',
                    color: 'info.50',
                    width: '100%',
                    px: { xs: 3, md: 10 }
                }}
            >
                <HeroTitle>
                    {title}
                </HeroTitle>
                <HeroSubtitle>
                    {subtitle}
                </HeroSubtitle>

            </Stack>
            <HeroButtonGroup buttons={buttons} />
        </Stack>
    );
};