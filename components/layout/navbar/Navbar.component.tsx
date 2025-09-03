'use client'
export const dynamic = 'force-dynamic';
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from '@/i18n/navigation';
import { Locale, navRoutes } from '@/i18n/routing';
import React, { useState } from "react";
import { layoutPaddings } from "@/lib/styles/layoutPaddings";
import { borderRadius } from "@/lib/styles/borderRadius";
import { palette } from "@/lib/styles/pallete";
import { menuBgColor } from "@/lib/styles/colors";
import { navbarHeight } from "@/lib/styles/navbarHeight";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import ListMenuItem from "./ListMenuItem.component";
import BurgerButton from "./BurgerButton.component";
import SideDrawer from "./SideDrawer.component";
import { LanguageSelector } from "./LanguageSelector.component";
import { useTranslations } from "next-intl";
import Image from "next/image";

type Props = {
    locale: Locale
}


export default function Navbar({ locale }: Props) {

    const t = useTranslations('navigation')
    const isScrolled = useScrollPosition(30);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <Box
            position='fixed' width='100%'
            left={0} top={0}
            zIndex='10' >
            <Stack
                component="nav" aria-label="My site"
                direction='row' justifyContent='space-between' alignItems='center'
                width='100%' mx={0} py={4} px={layoutPaddings} pr={{ lg: 1 }}
                borderRadius={borderRadius.no}
                bgcolor={isScrolled ? menuBgColor : 'transparent'}
                sx={{
                    // backdropFilter: 'blur(6px)',
                    maxHeight: navbarHeight,
                    transition: 'background-color 0.3s ease-in-out',
                    '&.MuiStack-root': {
                        backgroundColor: isScrolled ? menuBgColor : 'transparent !important',
                    }
                }}>

                <Link href={`/`}>
                    <Button variant='text' color='secondary' sx={{ '&:hover': { color: palette.info[300] } }} aria-label="Logo">
                        <Typography
                            variant='h3'
                            fontWeight={400}
                            color={isScrolled ? 'text.primary' : 'white'}
                            pr={1.5}
                            sx={{
                                transition: 'color 0.3s ease-in-out'
                            }}
                        >
                            EcoVibe Floors
                        </Typography>
                        <Image
                            src={`/images/logos/logo-sx.png`}
                            alt="EcoVibe Floors logo"
                            width={34}
                            height={25}
                        />
                    </Button>
                </Link>

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

