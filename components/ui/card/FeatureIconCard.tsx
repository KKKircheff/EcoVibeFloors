import { Stack, Typography, Box } from '@mui/material';
import React, { ReactNode, ReactElement } from 'react';

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
    iconSize = 60
}: FeatureIconCardProps) {

    return (
        <Stack justifyContent={'center'} alignItems={'center'}>
            <Typography
                gutterBottom textAlign={'center'}
                sx={{
                    color: `${iconColor}.500`,
                    fontSize: `${iconSize}px`
                }}>

                {icon}
            </Typography>
            <Typography variant="h2" component="h3" gutterBottom textAlign={'center'}>
                {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign={'center'}>
                {description}
            </Typography>
        </Stack>
    );
}