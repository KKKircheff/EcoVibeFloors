'use client'
export const dynamic = 'force-dynamic';
import { alpha, Box, Button, Divider, List, Stack, Typography, useTheme } from "@mui/material";
import { Link, usePathname } from '@/i18n/navigation';
import { Locale, navRoutes } from '@/i18n/routing';
import React, { useState } from "react";
import { layoutPaddings } from "@/lib/styles/layoutPaddings";
import { borderRadius } from "@/lib/styles/borderRadius";
import { palette } from "@/lib/styles/pallete";
import { menuBgColor } from "@/lib/styles/colors";
import ListMenuItem from "./ListMenuItem.component";
import BurgerButton from "./BurgerButton.component";
import SideDrawer from "./SideDrawer.component";
import { LanguageSelector } from "./LanguageSelector.component";
import { useTranslations } from "next-intl";

type Props = {
    locale: Locale
}

const maxNavHeight = '61px'

export default function Navbar({ locale }: Props) {
    const pathName = usePathname();
    const c = useTheme().palette;
    const t = useTranslations('NavbarLinks')

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <Box
            position='fixed' width='100%'
            left={0} top={{ xs: '10px', md: '30px' }}
            px={layoutPaddings}
            zIndex='10' >
            <Stack
                component="nav" aria-label="My site"
                direction='row' justifyContent='space-between' alignItems='center'
                width='100%' mx={0} py={0.6} px={2} pr={{ lg: 1 }}
                borderRadius={borderRadius.pill}
                bgcolor={menuBgColor}
                sx={{
                    backdropFilter: 'blur(5px)',
                    maxHeight: maxNavHeight,
                    border: '.5px solid',
                    borderColor: alpha(palette.info.main, .25),
                }}>

                <Link href={`/`}>
                    <Button variant='text' color='secondary' sx={{ '&:hover': { color: palette.info[300] } }} aria-label="Logo">
                        <Typography variant='h6' fontWeight={700} color='text.primary'>EcoVibeFloors</Typography>
                    </Button>
                </Link>

                <List
                    component="ul"
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
                        .map((route, index) => (
                            <React.Fragment key={route.path}>
                                <ListMenuItem
                                    route={route}
                                    setIsDrawerOpen={setIsDrawerOpen}
                                />
                                {(index < navRoutes.filter(route => route.visible).length - 1) && (
                                    <Divider orientation="vertical" sx={{ mx: 2, my: 1 }} flexItem />
                                )}
                            </React.Fragment>
                        ))
                    }
                </List>

                <Stack display={{ xs: 'none', lg: 'flex' }} alignSelf='flex-start' >
                    <LanguageSelector locale={locale} />
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

