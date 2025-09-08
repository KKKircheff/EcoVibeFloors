'use client'
export const dynamic = 'force-dynamic';
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link, useRouter } from '@/i18n/navigation';
import { Locale, navRoutes } from '@/i18n/routing';
import React, { useState } from "react";
import { borderRadius } from "@/lib/styles/borderRadius";
import { palette } from "@/lib/styles/pallete";
import { menuBgColor } from "@/lib/styles/colors";
import { navbarHeight } from "@/lib/styles/navbarHeight";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import ListMenuItem from "./ListMenuItem.component";
import BurgerButton from "./BurgerButton.component";
import SideDrawer from "./SideDrawer.component";
import { LanguageSelector } from "./LanguageSelector.component";
import { useTranslations } from "next-intl";
import { layoutPaddings } from "@/lib/styles/layoutPaddings";

type Props = {
    locale: Locale
}


export default function Navbar({ locale }: Props) {

    const screenWidth = useScreenWidth();
    const t = useTranslations('navigation')
    const isScrolled = useScrollPosition(30);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const getLogoSize = () => {
        if (screenWidth < 600) return { width: 32 };
        if (screenWidth < 900) return { width: 40 };
        if (screenWidth < 1200) return { width: 48 }
        if (screenWidth < 1536) return { width: 54 };
        return { width: 60 };
    };


    const router = useRouter()
    const navigateHome = () => router.push('/')
    const logoSize = getLogoSize()


    return (
        <Box
            position='fixed' width='100%'
            left={0} top={0}
            zIndex='10' >
            <Stack
                component="nav" aria-label="EcoVibeFloors.com"
                direction='row' justifyContent='space-between'
                alignItems='center'
                width='100%'
                mx={0}
                px={layoutPaddings}
                borderRadius={borderRadius.no}
                bgcolor={isScrolled ? menuBgColor : 'transparent'}
                sx={{
                    backdropFilter: isScrolled ? 'blur(6px)' : 'none',
                    height: navbarHeight,
                    maxHeight: navbarHeight,
                    transition: 'background-color 0.3s ease-in-out',
                    '&.MuiStack-root': {
                        background: isScrolled ? menuBgColor : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))',
                        transition: 'all 0.3s ease-in-out'
                    }
                }}>

                <Stack direction={'row'} alignItems={'center'} spacing={2} onClick={navigateHome} sx={{ cursor: 'pointer' }}>
                    <Box pt={{ xs: .6, sm: 1 }}>
                        <img
                            src={`/images/logos/logo-new-c.png`}
                            alt="EcoVibe Floors logo"
                            style={{
                                width: logoSize.width,
                                aspectRatio: 2,
                                objectFit: 'fill',
                                filter: isScrolled ? 'none' : 'brightness(0) invert(1)',
                                transition: 'filter 0.3s ease-in-out'
                            }}
                        />
                    </Box>
                    <Typography
                        variant='h3'
                        fontWeight={400}
                        color={isScrolled ? 'text.primary' : 'white'}
                        sx={{
                            transition: 'color 0.3s ease-in-out'
                        }}
                    >
                        EcoVibe Floors
                    </Typography>
                </Stack>

                <Stack
                    component="ul"
                    direction={'row'}
                    spacing={8}
                    sx={{
                        display: { xs: 'none', lg: 'flex' },
                        justifyContent: 'center',
                        paddingX: 0,
                        paddingY: 0,
                        paddingTop: .3,
                    }}
                >
                    {navRoutes
                        .filter(route => route.visible)
                        .map((route) => (
                            <ListMenuItem
                                key={route.path}
                                route={route}
                                setIsDrawerOpen={setIsDrawerOpen}
                                isScrolled={isScrolled}
                            />
                        ))
                    }
                    <Stack display={{ xs: 'none', lg: 'flex' }} pt={1}>
                        <LanguageSelector locale={locale} isScrolled={isScrolled} />
                    </Stack>
                </Stack>



                <Stack role="button" display={{ xs: 'block', lg: 'none' }}>
                    <BurgerButton isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} aria-label={t('burgerMenuButton')} />
                </Stack>

            </Stack>

            <SideDrawer
                routes={navRoutes}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
                bgColor={menuBgColor}
                locale={locale}
            />
        </Box >
    );
}

