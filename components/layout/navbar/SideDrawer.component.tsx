'use client'
import { Divider, Drawer, List, Stack, Typography } from '@mui/material';
import ListMenuItem from './ListMenuItem.component';
import { NavRoute, Locale } from '@/i18n/routing';
import { borderRadius } from '@/lib/styles/borderRadius';
import React from 'react';
import BurgerButton from './BurgerButton.component';
import { layoutPaddings } from '@/lib/styles/layoutPaddings';
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
            PaperProps={{
                sx: {
                    width: '100%',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    hheight: `${viewportHeight}px`,
                    overflowY: 'auto',
                },
            }}
            SlideProps={{
                timeout: 300, // Adjust animation duration
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
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography
                        component="label"
                        htmlFor="close-icon"
                        variant="h6"
                        fontWeight="700"
                        color="text.primary"
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
                        height: '300px',
                    }}
                >
                    {routes
                        .filter(route => route.visible)
                        .map((route, index) => (
                            <React.Fragment key={route.path}>
                                <ListMenuItem
                                    route={route}
                                    setIsDrawerOpen={setIsDrawerOpen}
                                />
                                {/* {index < routes.filter(route => route.visible).length - 1 && (
                                    <Divider
                                        orientation="horizontal"
                                        sx={{ mx: 0, my: 0 }}
                                        flexItem
                                    />
                                )} */}
                            </React.Fragment>
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