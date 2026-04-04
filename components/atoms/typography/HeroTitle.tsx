import { caveat } from '@/lib/styles/theme';
import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface HeroTitleProps {
    children: string;
}

export function HeroTitle({ children }: HeroTitleProps) {
    return (
        <Typography
            component={'h1'}
            variant="h3"
            // fontFamily={caveat.style.fontFamily}
            maxWidth={'1650px'}
            sx={{
                fontWeight: 300,
                // fontSize: { xs: '36px !important', md: '66px !important' },
                fontSize: { xs: '26px !important', md: '56px !important' },
                lineHeight: 1.3
            }}
        >
            {children}
        </Typography>
    );
}