'use client';
import React from 'react'
import { Button, ButtonProps } from '@mui/material'
import { palette } from '@/lib/styles/pallete'
import { useRouter } from '@/i18n/navigation'

interface HeroButtonProps extends ButtonProps {
    children: React.ReactNode;
    action?: 'scroll' | 'navigate';
    target?: string;
    href?: string;
}

const HeroButton = ({ children, action, target, href, ...otherProps }: HeroButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        if (otherProps.onClick) {
            otherProps.onClick();
        } else if (action === 'scroll' && target) {
            const element = document.getElementById(target);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else if (action === 'navigate' && target) {
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
                px: 4,
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