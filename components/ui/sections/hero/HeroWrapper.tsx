import React, { ReactNode } from 'react';
import { Stack } from '@mui/material';

interface HeroWrapperProps {
    id?: string;
    minHeight?: { xs: string; md?: string };
    children: ReactNode;
}

export const HeroWrapper = ({
    id = 'hero-section',
    minHeight = { xs: '90vh', md: '90vh' },
    children
}: HeroWrapperProps) => {
    return (
        <Stack
            id={id}
            sx={{
                position: 'relative',
                minHeight: minHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {children}
        </Stack>
    );
};