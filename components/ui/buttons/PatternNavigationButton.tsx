'use client';

import React from 'react';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';
import { useRouter } from '@/i18n/navigation';

interface PatternNavigationButtonProps {
    href: string;
    label: string;
    variant?: 'contained' | 'outlined';
}

const PatternNavigationButton = ({ href, label, variant = 'contained' }: PatternNavigationButtonProps) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(href);
    };

    return (
        <PrimaryActionButton
            onClick={handleClick}
            variant={variant}
            size="large"
            fullWidth
            sx={{
                py: 3,
                fontSize: '1.25rem',
            }}
        >
            {label}
        </PrimaryActionButton>
    );
};

export default PatternNavigationButton;
