
'use client';

import { ListItem, Typography, Stack, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Messages } from '@/global';
import { NavRoute } from '@/i18n/routing';
import React, { useState, useRef } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type ItemProps = {
    route: NavRoute,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isScrolled?: boolean,
    openSubmenu: string | null,
    setOpenSubmenu: React.Dispatch<React.SetStateAction<string | null>>
}

const ListMenuItem = ({ route, setIsDrawerOpen, isScrolled = true, openSubmenu, setOpenSubmenu }: ItemProps) => {

    const t = useTranslations("navigation");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = openSubmenu === route.path;
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleClick = () => {
        setIsDrawerOpen(false);
    }

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        // Clear any existing close timeout
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }

        if (route.submenu && route.submenu.length > 0) {
            // Open this submenu and close any other open submenu
            setAnchorEl(event.currentTarget);
            setOpenSubmenu(route.path);
        } else {
            // Close any open submenu when hovering non-submenu items
            setOpenSubmenu(null);
        }
    };

    const handleMouseLeave = () => {
        if (route.submenu && route.submenu.length > 0) {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            closeTimeoutRef.current = setTimeout(() => {
                setOpenSubmenu(null);
                setAnchorEl(null);
            }, 100);
        }
    };


    const hasSubmenu = route.submenu && route.submenu.length > 0;

    if (hasSubmenu) {
        return (
            <ListItem
                sx={{
                    paddingX: 0,
                    position: 'relative'
                }}
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
                {open && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            backgroundColor: '#FFF',
                            minWidth: 300,
                            // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                            py: 2
                        }}
                    >
                        {route?.submenu?.map((submenuItem) => (
                            <Box
                                key={submenuItem.path}
                                onClick={handleClick}
                                sx={{
                                    py: 1.5,
                                    px: 3,
                                    cursor: 'pointer',
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
                            </Box>
                        ))}
                    </Box>
                )}
            </ListItem>
        );
    }

    return (
        <ListItem
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            sx={{
                paddingX: 0,
                cursor: 'pointer'
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

