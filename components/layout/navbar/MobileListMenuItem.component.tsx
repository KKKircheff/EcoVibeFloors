'use client';

import { ListItem, Typography, Collapse, List } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Messages } from '@/global';
import { NavRoute } from '@/i18n/routing';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type ItemProps = {
    route: NavRoute,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

const MobileListMenuItem = ({ route, setIsDrawerOpen }: ItemProps) => {

    const t = useTranslations("navigation");
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        setIsDrawerOpen(false);
    }

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const hasSubmenu = route.submenu && route.submenu.length > 0;

    if (hasSubmenu) {
        return (
            <>
                <ListItem
                    onClick={handleExpandClick}
                    sx={{
                        px: 0,
                        py: .5,
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Typography
                        variant='subtitle2'
                        color='text.primary'
                        sx={{
                            fontWeight: 400,
                            '&:hover': {
                                color: 'primary.700'
                            },
                            transition: 'color 0.3s ease-in-out'
                        }}
                    >
                        {t(`${route.name.replace(' ', '_')}` as keyof Messages['navigation'])}
                    </Typography>
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ListItem>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                        {route?.submenu?.map((submenuItem) => (
                            <ListItem
                                key={submenuItem.path}
                                onClick={handleClick}
                                sx={{
                                    paddingX: 0,
                                    py: .5
                                }}
                            >
                                <Link
                                    href={submenuItem.path}
                                    style={{ textDecoration: 'none', width: '100%' }}
                                    aria-label={t(`${submenuItem.name.replace(/\s/g, '_')}` as keyof Messages['navigation'])}
                                >
                                    <Typography
                                        variant='body1'
                                        color='info.600'
                                        sx={{
                                            fontWeight: 400,
                                            '&:hover': {
                                                color: 'primary.700'
                                            },
                                            transition: 'color 0.3s ease-in-out'
                                        }}
                                    >
                                        {t(`${submenuItem.name.replace(/\s/g, '_')}` as keyof Messages['navigation'])}
                                    </Typography>
                                </Link>
                            </ListItem>
                        ))}
                    </List>
                </Collapse>
            </>
        );
    }

    return (
        <ListItem onClick={handleClick} sx={{ px: 0, py: .5 }} >
            <Link href={route.path} key={route.path} style={{ textDecoration: 'none' }} aria-label={t(`${route.name.replace(' ', '_')}` as keyof Messages['navigation'])}>
                <Typography
                    variant='subtitle2'
                    color='text.primary'
                    sx={{
                        fontWeight: 400,
                        '&:hover': {
                            color: 'primary.700'
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

export default MobileListMenuItem