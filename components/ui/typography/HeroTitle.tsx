import { caveat } from '@/lib/styles/theme';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface HeroTitleProps {
    children: ReactNode;
}

export function HeroTitle({ children }: HeroTitleProps) {
    return (
        <Typography
            variant="h1"
            fontFamily={caveat.style.fontFamily}
            sx={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                fontWeight: 400,
                fontSize: { xs: '40px !important', md: '66px !important' },
            }}
        >
            {children}
        </Typography>
    );
}