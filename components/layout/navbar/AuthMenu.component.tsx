'use client';

import React, { useState } from 'react';
import {
    Stack,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Avatar,
    Divider,
} from '@mui/material';
import { AccountCircleOutlined as PersonIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/hooks';
import { palette } from '@/lib/styles/pallete';

interface AuthMenuProps {
    isScrolled: boolean;
    onNavigate?: () => void;
}

export function AuthMenu({ isScrolled, onNavigate }: AuthMenuProps) {
    const t = useTranslations('auth');
    const router = useRouter();
    const { user, isAuthenticated, signOut } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        await signOut();
        handleMenuClose();
        router.push('/');
    };

    const handleSignInClick = () => {
        onNavigate?.();
        router.push('/auth');
    };

    const handleSignUpClick = () => {
        router.push('/auth');
    };

    if (!isAuthenticated) {
        return (
            <Typography
                variant="subtitle2"
                onClick={handleSignInClick}
                alignSelf={'center'}
                sx={{
                    color: isScrolled ? 'text.primary' : 'white',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                        color: isScrolled ? 'primary.700' : 'rgba(255, 255, 255, 0.8)',
                    },
                    transition: 'color 0.1s ease-in-out',
                }}
            >
                {t('signIn')}
            </Typography>

        );
    }

    return (
        <>
            <IconButton
                onClick={handleMenuOpen}
                aria-label="User menu"
                aria-controls="auth-menu"
                aria-haspopup="true"
            >
                <Avatar sx={{ width: 24, height: 24, bgcolor: 'white', color: 'info.400', pt: { xs: 0, md: 0.2 } }} variant='circular'>
                    <PersonIcon sx={{ fontSize: 24 }} />
                </Avatar>
            </IconButton>

            <Menu
                id="auth-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                sx={{ mt: 2 }}
            >
                <Stack px={2} py={1} spacing={0.5}>
                    <Typography variant="body1" fontWeight={500}>
                        {user?.displayName || user?.email}
                    </Typography>
                    {user?.email && user?.displayName && (
                        <Typography variant="caption" color="text.secondary">
                            {user.email}
                        </Typography>
                    )}
                </Stack>

                <Divider />

                <MenuItem onClick={handleSignOut}>
                    {/* <Stack direction={'row'} alignItems={'center'}> */}
                    <LogoutIcon sx={{ mr: 1, fontSize: 20, mt: .5 }} />
                    <Typography variant='body1'>
                        {t('signOut')}
                    </Typography>
                    {/* </Stack> */}
                </MenuItem>
            </Menu>
        </>
    );
}
