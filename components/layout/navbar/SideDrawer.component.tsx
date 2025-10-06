'use client'
import { Drawer, List, Stack, Typography } from '@mui/material';
import MobileListMenuItem from './MobileListMenuItem.component';
import { NavRoute, Locale } from '@/i18n/routing';
import { borderRadius } from '@/lib/styles/borderRadius';
import React, { useEffect } from 'react';
import BurgerButton from './BurgerButton.component';
import { layoutPaddings as _layoutPaddings } from '@/lib/styles/layoutPaddings';
import { LanguageSelector } from './LanguageSelector.component';
import { caveat } from '@/lib/styles/theme';

type Props = {
    routes: NavRoute[],
    isDrawerOpen: boolean,
    setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>,
    bgColor: string,
    locale: Locale,
}

const SideDrawer = ({
    routes,
    isDrawerOpen,
    setIsDrawerOpen,
    bgColor,
    locale,
}: Props) => {


    const [viewportHeight, setViewportHeight] = React.useState(typeof window !== 'undefined' ? window.innerHeight : 800);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateHeight = () => setViewportHeight(window.innerHeight);
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    // Disable background scroll when drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            const originalBodyOverflow = document.body.style.overflow;
            const originalHtmlOverflow = document.documentElement.style.overflow;

            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            return () => {
                // Restore original values
                document.body.style.overflow = originalBodyOverflow;
                document.documentElement.style.overflow = originalHtmlOverflow;
            };
        }
    }, [isDrawerOpen]);
    const handleDrawerClose = () => {
        setTimeout(() => {
            setIsDrawerOpen(false);
        }, 150);
    };

    return (
        <Drawer
            variant="temporary"
            open={isDrawerOpen}
            onClose={handleDrawerClose}
            slotProps={{
                paper: {
                    sx: {
                        width: '100%',
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        height: `${viewportHeight}px`,
                        overflowY: 'auto',
                    },
                },
                transition: {
                    timeout: 300,
                },
            }}
        >
            <Stack
                direction="column"
                overflow="hidden"
                boxSizing="border-box"
                height={`${viewportHeight}px`}
                m={2}
                px={3}
                pr={1.5}
                py={2}
                borderRadius={borderRadius.lg}
                bgcolor={bgColor}
                sx={{
                    backdropFilter: 'blur(5px)',
                    transition: 'all .3s ease-in-out',
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" pb={3}>
                    <Typography
                        component="label"
                        htmlFor="close-icon"
                        variant="h2"
                        fontWeight="500"
                        color="primary.500"
                        fontFamily={caveat.style.fontFamily}
                    >
                        EcoVibeFloors
                    </Typography>
                    <BurgerButton
                        isDrawerOpen={isDrawerOpen}
                        setIsDrawerOpen={setIsDrawerOpen}
                    />
                </Stack>
                <Stack spacing={2}>
                    <LanguageSelector locale={locale} />
                </Stack>

                <List
                    component="nav"
                    sx={{
                        flex: 'none',
                        overflowY: 'auto',
                        height: '350px',
                    }}
                >
                    {routes
                        .filter(route => route.visible)
                        .map((route, _index) => (
                            <MobileListMenuItem
                                key={route.path}
                                route={route}
                                setIsDrawerOpen={setIsDrawerOpen}
                            />
                        ))
                    }
                </List>

            </Stack>
        </Drawer>
    );
};

export default SideDrawer;