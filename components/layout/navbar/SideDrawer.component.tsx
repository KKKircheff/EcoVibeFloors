'use client'
import { Drawer, List, Stack, Typography } from '@mui/material';
import MobileListMenuItem from './MobileListMenuItem.component';
import { NavRoute, Locale } from '@/i18n/routing';
import { borderRadius } from '@/lib/styles/borderRadius';
import React from 'react';
import BurgerButton from './BurgerButton.component';
import { layoutPaddings as _layoutPaddings } from '@/lib/styles/layoutPaddings';
import { LanguageSelector } from './LanguageSelector.component';

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


    // Use viewport height for mobile drawer
    const [viewportHeight, setViewportHeight] = React.useState(typeof window !== 'undefined' ? window.innerHeight : 800);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateHeight = () => setViewportHeight(window.innerHeight);
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);
    // Handle drawer close with animation
    const handleDrawerClose = () => {
        // Add a slight delay to allow animation to complete
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
                    // height: 'calc(100vh - 100px)', // Adjust height to prevent overflow
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center" pb={3}>
                    <Typography
                        component="label"
                        htmlFor="close-icon"
                        variant="h1"
                        fontWeight="600"
                        color="primary.500"
                    >
                        EcoVibeFloors
                    </Typography>
                    <BurgerButton
                        isDrawerOpen={isDrawerOpen}
                        setIsDrawerOpen={setIsDrawerOpen}
                    />
                </Stack>

                <List
                    component="nav"
                    sx={{
                        flex: 'none',
                        overflowY: 'auto',
                        height: '400px',
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

                <Stack spacing={2} mt='auto'>
                    <LanguageSelector locale={locale} />
                </Stack>
            </Stack>
        </Drawer>
    );
};

export default SideDrawer;