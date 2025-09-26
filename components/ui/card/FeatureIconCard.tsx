import React, { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { caveat } from '@/lib/styles/theme';

export interface FeatureIconCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    iconColor?: 'primary' | 'secondary';
    iconSize?: number;
}

export function FeatureIconCard({
    icon,
    title,
    description,
    iconColor = 'primary',
}: FeatureIconCardProps) {

    return (
        <Stack justifyContent={'center'} alignItems={'center'}>
            <Typography
                gutterBottom textAlign={'center'}
                sx={{
                    color: `${iconColor}.500`,
                }}>

                {icon}
            </Typography>
            <Typography variant="h2" component="h3" textAlign={'center'} fontFamily={caveat.style.fontFamily} color='info.500' pb={{ xs: 1, md: 2 }}>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign={'center'}>
                {description}
            </Typography>
        </Stack>
    );
}