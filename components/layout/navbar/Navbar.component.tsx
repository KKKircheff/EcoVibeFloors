'use client'
export const dynamic = 'force-dynamic';
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
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
import Image from "next/image";

type Props = {
    locale: Locale
}

const maxNavHeight = '120px'

export default function Navbar({ locale }: Props) {
    const _pathName = usePathname();
    const _c = useTheme().palette;
    const t = useTranslations('navigation')

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
                bgcolor={menuBgColor}
                sx={{
                    backdropFilter: 'blur(5px)',
                    maxHeight: maxNavHeight,
                    // border: '.5px solid',
                    // borderColor: alpha(palette.info.main, .25),
                }}>

                <Link href={`/`}>
                    <Button variant='text' color='secondary' sx={{ '&:hover': { color: palette.info[300] } }} aria-label="Logo">
                        <Image
                            src={`/images/logos/logo-sx.png`}
                            alt="EcoVibe Floors logo"
                            width={30}
                            height={18}
                        />
                        <Typography variant='h6' fontWeight={700} color='text.primary' pl={1}>EcoVibeFloors</Typography>
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
                            <React.Fragment key={route.path}>
                                <ListMenuItem
                                    route={route}
                                    setIsDrawerOpen={setIsDrawerOpen}
                                />
                                {/* {(index < navRoutes.filter(route => route.visible).length - 1) && (
                                    <Divider orientation="vertical" sx={{ mx: 2, my: 1 }} flexItem />
                                )} */}
                            </React.Fragment>
                        ))
                    }
                    <Stack display={{ xs: 'none', lg: 'flex' }} pt={1}>
                        <LanguageSelector locale={locale} />
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

