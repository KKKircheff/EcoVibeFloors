'use client';
import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { palette } from '@/lib/styles/pallete'
import { useRouter } from '@/i18n/navigation'
import { scrollToEndOfElement } from '@/lib/utils/scrollToEndOfElement';

interface HeroButtonProps extends ButtonProps {
    children: React.ReactNode;
    actionType?: 'scroll' | 'navigate';
    target?: string;
    href?: string;
}

const HeroButton = ({ children, actionType, target, href, ...otherProps }: HeroButtonProps) => {
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

    return (
        <Button
            variant='text'
            size="large"
            {...otherProps}
            onClick={handleClick}
            sx={{
                border: `2px solid ${palette.info[100]}`,
                px: { xs: 2.5, md: 4 },
                py: 2.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                color: palette.info[50],
                minWidth: { xs: '250px', md: 300, lg: 400 },
                '&:hover': {
                    bgcolor: 'primary.700',
                },
                ...otherProps.sx
            }}
        >
            {children}
        </Button>
    )
}

export { HeroButton }