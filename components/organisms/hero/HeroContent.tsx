import React from 'react';
import { Stack, SxProps, Theme } from '@mui/material';
import { HeroTitle } from '@/components/atoms/typography/HeroTitle';
import { HeroSubtitle } from '@/components/atoms/typography/HeroSubtitle';
import { HeroButtonGroup } from '@/components/molecules/hero/HeroButtonGroup';
import { heroTextsbackground } from '@/lib/styles/colors';

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