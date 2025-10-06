import { caveat } from '@/lib/styles/theme';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface HeroTitleProps {
    children: ReactNode;
}

export function HeroTitle({ children }: HeroTitleProps) {
    return (
        <Typography
            component={'h1'}
            variant="h3"
            fontFamily={caveat.style.fontFamily}
            // maxWidth={'1200px'}
            sx={{
                fontWeight: 400,
                fontSize: { xs: '36px !important', md: '66px !important' },
                lineHeight: 1
            }}
        >
            {children}
        </Typography>
    );
}