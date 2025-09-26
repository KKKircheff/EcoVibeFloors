import React, { ReactNode } from 'react';
import { Box, Stack, StackProps, SxProps, Theme } from '@mui/material';
import { HeroTitle } from '../../typography/HeroTitle';
import { HeroSubtitle } from '../../typography/HeroSubtitle';
import { HeroButton } from '../../buttons/HeroButton';

interface HeroButtonConfig extends StackProps {
    text: string;
    href?: string;
    actionType?: 'scroll' | 'navigate';
    target?: string;
    sx?: SxProps<Theme>;
}

interface HeroContentProps {
    title: string | ReactNode;
    subtitle: string | ReactNode;
    buttons?: HeroButtonConfig[];
    overlayOpacity?: number;
    contentBackgroundOpacity?: { xs: number; md: number };
}

export const HeroContent = ({
    title,
    subtitle,
    buttons = [],
    overlayOpacity = 0.20,
    contentBackgroundOpacity = { xs: 0.40, md: 0.35 }
}: HeroContentProps) => {
    return (
        <>
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
                py={{ xs: 6, sm: 8 }}
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
                                actionType={button.actionType}
                                target={button.target}
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
        </>
    );
};