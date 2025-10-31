'use client'
export const dynamic = 'force-dynamic';
import { Box, Stack, Typography, IconButton, Badge } from "@mui/material";
import { useRouter } from '@/i18n/navigation';
import { Locale, navRoutes } from '@/i18n/routing';
import React, { useState } from "react";
import { borderRadius } from "@/lib/styles/borderRadius";
import { menuBgColor } from "@/lib/styles/colors";
import { navbarHeight } from "@/lib/styles/navbarHeight";
import { caveat } from "@/lib/styles/theme";
import ListMenuItem from "./ListMenuItem.component";
import BurgerButton from "./BurgerButton.component";
import SideDrawer from "./SideDrawer.component";
import { LanguageSelector } from "./LanguageSelector.component";
import { useTranslations } from "next-intl";
import { layoutPaddings } from "@/lib/styles/layoutPaddings";
import { useSampleBasket } from "@/lib/contexts/SampleBasketContext";
import { PiBag } from "react-icons/pi";
import { palette } from "@/lib/styles/pallete";
import { AuthMenu } from "./AuthMenu.component";

type Props = {
    locale: Locale
}


export default function Navbar({ locale }: Props) {

    // const screenWidth = useScreenWidth();
    const t = useTranslations('navigation')
    const { itemCount } = useSampleBasket();

    // Navbar changes on scroll
    // const isScrolled = useScrollPosition(30);

    // Navbar always visible
    const isScrolled = true;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    // const getLogoSize = () => {
    //     if (screenWidth < 600) return { width: 32 };
    //     if (screenWidth < 900) return { width: 40 };
    //     if (screenWidth < 1200) return { width: 48 }
    //     if (screenWidth < 1536) return { width: 54 };
    //     return { width: 60 };
    // };

    // const logoSize = getLogoSize()

    const router = useRouter()
    const navigateHome = () => router.push('/')
    const navigateToBasket = () => router.push('/sample-basket')


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
                    {/* <Box pt={{ xs: .6, sm: 1 }}>
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
                    </Box> */}
                    <Typography
                        variant='h3'
                        fontFamily={caveat.style.fontFamily}
                        color={isScrolled ? 'primary.600' : 'white'}
                        sx={{
                            transition: 'color 0.3s ease-in-out',
                            '@media (max-width:600px)': {
                                fontSize: '1.6rem',
                            },
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
                                openSubmenu={openSubmenu}
                                setOpenSubmenu={setOpenSubmenu}
                            />
                        ))
                    }
                    <Stack display={{ xs: 'none', lg: 'flex' }} direction="row" alignItems="flex-start" spacing={2} pt={.5}>
                        <AuthMenu isScrolled={isScrolled} />
                        <IconButton
                            onClick={navigateToBasket}
                            aria-label="Sample basket"
                        >
                            <Badge badgeContent={itemCount} color="primary">
                                <PiBag
                                    style={{
                                        color: isScrolled ? palette.info[500] : 'white',
                                        transition: 'color 0.3s ease-in-out',
                                    }}
                                />
                            </Badge>
                        </IconButton>
                        <LanguageSelector locale={locale} isScrolled={isScrolled} />
                    </Stack>
                </Stack>



                <Stack direction="row" alignItems="center" spacing={1} display={{ xs: 'flex', lg: 'none' }}>
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

