'use client';
import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { scrollToEndOfElement } from '@/lib/utils/scrollToEndOfElement';

interface LearnMoreLinkProps extends Omit<TypographyProps, 'onClick'> {
    children: React.ReactNode;
    targetId: string;
}

export const LearnMoreLink = ({ children, targetId, ...otherProps }: LearnMoreLinkProps) => {
    const handleClick = () => {
        scrollToEndOfElement(targetId);
    };

    return (
        <Typography
            variant="subtitle1"
            fontWeight={500}
            onClick={handleClick}
            sx={{
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                '&:hover': {
                    color: 'primary.main',
                },
                ...otherProps.sx
            }}
            {...otherProps}
        >
            {children}
        </Typography>
    );
};
