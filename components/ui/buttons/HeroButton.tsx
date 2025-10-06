'use client';
import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { palette } from '@/lib/styles/pallete'
import { useRouter } from '@/i18n/navigation'
import { scrollToEndOfElement } from '@/lib/utils/scrollToEndOfElement';
import { heroTextsbackground } from '../sections/hero/HeroContent';

interface HeroButtonProps extends Omit<ButtonProps, 'variant'> {
    children: React.ReactNode;
    actionType?: 'scroll' | 'navigate';
    target?: string;
    href?: string;
    buttonVariant?: 'primary' | 'secondary';
}

const HeroButton = ({ children, actionType, target, href, buttonVariant = 'primary', ...otherProps }: HeroButtonProps) => {
    const router = useRouter();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (otherProps.onClick) {
            otherProps.onClick(event);
        } else if (actionType === 'scroll' && target) {
            scrollToEndOfElement(target)
        } else if (actionType === 'navigate' && target) {
            router.push(target);
        } else if (href) {
            router.push(href);
        }
    };

    const primaryStyles = {
        bgcolor: palette.primary[100],
        color: palette.primary[800],
        border: `2px solid ${palette.primary[100]}`,
        '&:hover': {
            bgcolor: palette.primary[200],
            borderColor: palette.primary[200],
        },
    };

    const secondaryStyles = {
        bgcolor: heroTextsbackground,
        color: palette.info[50],
        border: `2px solid ${palette.info[50]}`,
        '&:hover': {
            color: palette.primary[50],
            bgcolor: palette.primary[500],
            borderColor: palette.primary[50],
        },
    };

    const variantStyles = buttonVariant === 'primary' ? primaryStyles : secondaryStyles;

    return (
        <Button
            size="large"
            {...otherProps}
            onClick={handleClick}
            sx={{
                px: { xs: 2.5, md: 4 },
                py: 2.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                minWidth: { xs: '250px', md: 300, lg: 400 },
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(6px)',
                ...variantStyles,
                ...otherProps.sx
            }}
        >
            {children}
        </Button>
    )
}

export { HeroButton }