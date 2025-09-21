
'use client';

import { ListItem, Typography, Menu, MenuItem, Box, Stack } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Messages } from '@/global';
import { NavRoute } from '@/i18n/routing';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type ItemProps = {
    route: NavRoute,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isScrolled?: boolean
}

const ListMenuItem = ({ route, setIsDrawerOpen, isScrolled = true }: ItemProps) => {

    const t = useTranslations("navigation");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = () => {
        setIsDrawerOpen(false);
    }

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        if (route.submenu && route.submenu.length > 0) {
            setAnchorEl(event.currentTarget);
        }
    };

    const handleMouseLeave = () => {
        setAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const hasSubmenu = route.submenu && route.submenu.length > 0;

    if (hasSubmenu) {
        return (
            <ListItem
                sx={{ paddingX: 0 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Stack
                    direction={'row'}
                    alignItems='center'
                    sx={{
                        cursor: 'pointer',
                    }}
                >
                    <Link href={route.path} key={route.path} style={{ textDecoration: 'none' }} aria-label={t(`${route.name.replace(' ', '_')}` as keyof Messages['navigation'])}>
                        <Typography
                            variant='subtitle2'
                            color={isScrolled ? 'text.primary' : 'white'}
                            sx={{
                                '&:hover': {
                                    color: isScrolled ? 'primary.700' : 'rgba(255, 255, 255, 0.8)'
                                },
                                transition: 'color 0.1s ease-in-out'
                            }}
                        >
                            {t(`${route.name.replace(' ', '_')}` as keyof Messages['navigation'])}
                        </Typography>
                    </Link>
                    <ExpandMoreIcon
                        className="expand-icon"
                        sx={{
                            ml: 0.5,
                            mt: 0.5,
                            fontSize: 16,
                            color: isScrolled ? 'text.primary' : 'white',
                            transition: 'transform 0.1s ease-in-out'
                        }}
                    />
                </Stack>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    slotProps={{
                        list: {
                            'aria-labelledby': 'collections-menu',
                            onMouseLeave: handleMenuClose,
                        }
                    }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    sx={{
                        '& .MuiPaper-root': {
                            backgroundColor: '#FFF',
                            border: 'none',
                            borderRadius: 0,
                            minWidth: 220,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0)',
                        }
                    }}
                >
                    {route?.submenu?.map((submenuItem) => (
                        <MenuItem
                            key={submenuItem.path}
                            onClick={handleClick}
                            sx={{
                                mt: 1.1,
                                py: 1,
                                px: 4,
                                '&:hover': {
                                    backgroundColor: 'primary.100',
                                }
                            }}
                        >
                            <Link
                                href={submenuItem.path}
                                style={{ textDecoration: 'none', width: '100%' }}
                                aria-label={t(`${submenuItem.name.replace(/\s/g, '_')}` as keyof Messages['navigation'])}
                            >
                                <Typography
                                    variant='body1'
                                    color='text.primary'
                                    sx={{
                                        '&:hover': {
                                            color: 'primary.700'
                                        }
                                    }}
                                >
                                    {t(`${submenuItem.name.replace(/\s/g, '_')}` as keyof Messages['navigation'])}
                                </Typography>
                            </Link>
                        </MenuItem>
                    ))}
                </Menu>
            </ListItem>
        );
    }

    return (
        <ListItem onClick={handleClick} sx={{ paddingX: 0 }} >
            <Link href={route.path} key={route.path} style={{ textDecoration: 'none' }} aria-label={t(`${route.name.replace(' ', '_')}` as keyof Messages['navigation'])}>
                <Typography
                    variant='subtitle2'
                    color={isScrolled ? 'text.primary' : 'white'}
                    sx={{
                        '&:hover': {
                            color: isScrolled ? 'primary.700' : 'rgba(255, 255, 255, 0.8)'
                        },
                        transition: 'color 0.3s ease-in-out'
                    }}
                >
                    {t(`${route.name.replace(' ', '_')}` as keyof Messages['navigation'])}
                </Typography>
            </Link>
        </ListItem >
    )
}

export default ListMenuItem

