'use client';
import React from 'react';
import { Stack, SxProps, Theme } from '@mui/material';
import { HeroButton } from '../../buttons/HeroButton';

interface HeroButtonConfig {
    text: string;
    href?: string;
    actionType?: 'scroll' | 'navigate';
    target?: string;
    sx?: SxProps<Theme>;
    buttonVariant?: 'primary' | 'secondary';
}

interface HeroButtonGroupProps {
    buttons: HeroButtonConfig[];
}

export const HeroButtonGroup = ({ buttons }: HeroButtonGroupProps) => {
    if (buttons.length === 0) return null;

    return (
        <Stack
            direction={{ xs: 'column', md: buttons.length > 1 ? 'row' : 'column' }}
            spacing={3}
            pb={6}
            width="100%"
            justifyContent="center"
            alignItems="center"
            sx={{
                position: 'relative',
                zIndex: 2,
            }}
        >
            {buttons.map((button, index) => (
                <HeroButton
                    key={index}
                    actionType={button.actionType}
                    target={button.target}
                    href={button.href}
                    buttonVariant={button.buttonVariant || (index === 0 ? 'secondary' : 'secondary')}
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
    );
};
