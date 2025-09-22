import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface HeroTitleProps {
    children: ReactNode;
}

export function HeroTitle({ children }: HeroTitleProps) {
    return (
        <Typography
            variant="h1"
            sx={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                fontWeight: 600,
            }}
        >
            {children}
        </Typography>
    );
}