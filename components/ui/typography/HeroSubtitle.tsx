import { Typography } from '@mui/material';
import { ReactNode } from 'react';

interface HeroSubtitleProps {
    children: ReactNode;
}

export function HeroSubtitle({ children }: HeroSubtitleProps) {
    return (
        <Typography
            variant="h5"
            component="p"
            pb={3}
            sx={{
                lineHeight: 1.6,
                textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
            }}
        >
            {children}
        </Typography>
    );
}