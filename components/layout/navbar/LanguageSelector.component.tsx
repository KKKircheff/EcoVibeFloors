"use client"
import React, { useState } from 'react'
import { borderRadius } from '@/lib/styles/borderRadius';
import { alpha, MenuItem, Select, SelectChangeEvent, Stack, Typography, useMediaQuery } from '@mui/material'
import Image from 'next/image';
import { RiArrowDownSLine } from 'react-icons/ri';
import { Locale } from '@/i18n/routing';
import { usePathname, useRouter } from '@/i18n/navigation';
import { palette } from '@/lib/styles/pallete';
import { useTranslations } from 'next-intl';

type Props = {
    locale: Locale,
    isScrolled?: boolean
}
const flagSize = 22

export const LanguageSelector = ({ locale, isScrolled = true }: Props) => {
    const _t = useTranslations('navigation');
    const pathname = usePathname()
    const router = useRouter();

    const br = borderRadius

    const [open, setOpen] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

    const handleLanguageChange = (e: SelectChangeEvent<Locale>) => {
        const newLocale = e.target.value as Locale;
        router.replace(pathname, { locale: newLocale });
        router.refresh();
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <Stack direction='row' alignItems={'center'} spacing={0} px={{ xs: 0, md: 1 }} alignSelf={{ xs: 'flex-start' }} pt={{ xs: .5, md: 0.3, }}>
            <Select
                variant="standard"
                size="medium"
                value={locale}
                onChange={(e) => handleLanguageChange(e)}
                onOpen={handleOpen}
                onClose={handleClose}
                open={open}
                sx={{
                    maxWidth: `${flagSize + 2}px !important`,
                    width: `${flagSize + 2}px !important`,
                    overflow: 'hidden',
                    '&::before, &::after': {
                        display: 'none',
                        border: 'none',
                    },
                    '& .MuiSelect-standard': {
                        marginTop: .6,
                        padding: '0px 0px',
                        overflow: 'hidden',
                        maxWidth: `${flagSize + 2}px !important`,
                        minWidth: `${flagSize + 2}px !important`,
                        width: `${flagSize + 2}px !important`,
                        background: 'transparent',
                        // background: c.neutral[200],
                        borderRadius: 0,
                        transition: 'background-color 0.3s ease',
                        textOverflow: 'clip',
                        whiteSpace: 'nowrap',

                        '&:hover': {
                            // background: c.neutral[400],
                            outline: 'none',
                        },
                    },
                    '& .MuiSelect-icon': {
                        display: 'none',
                    },
                    '&.Mui-focused': {
                        outline: 'none !important',
                        border: 'none !important',
                        boxShadow: 'none !important',

                        '& .MuiSelect-standard': {
                            color: palette.primary.contrastText,
                        }
                    },
                }}
                MenuProps={{
                    PaperProps: {
                        sx: {
                            mt: isMobile ? .5 : 1,
                            ml: 0,
                            py: .2,
                            borderRadius: br.sm,
                            backgroundColor: palette.info[400],
                            '& .MuiMenuItem-root': {
                                padding: '2px 16px',
                                color: palette.info.contrastText,
                                transition: 'background-color 0.3s ease',
                                '&:hover': {
                                    backgroundColor: alpha(palette.info.contrastText, 0.3),
                                },
                                '&.Mui-selected': {
                                    backgroundColor: alpha(palette.info.contrastText, 0.15),
                                    '&:hover': {
                                        backgroundColor: alpha(palette.info.contrastText, 0.2),
                                    },
                                },
                            },
                        },
                    },
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                    },
                    transformOrigin: {
                        vertical: 'top',
                        horizontal: 'left',
                    },
                    disableScrollLock: true,
                }}
            >
                <MenuItem value='bg' sx={{ mb: .5 }}>
                    <Image
                        src={`/images/flags/bg.png`}
                        alt="Bulgarian Flag"
                        width={flagSize}
                        height={flagSize}
                        style={{
                            width: `${flagSize}px`,
                            height: `${flagSize - 4}px`,
                            objectFit: 'fill'
                        }}
                    />
                    <Typography
                        color='info.contrastText'
                        display={'inline-block'}
                        sx={{ fontSize: '16px !important' }}
                        pl={1}>
                        Български
                    </Typography>
                </MenuItem>
                <MenuItem value='en' >
                    <Image
                        src={'/images/flags/gb.png'}
                        alt="UK flag"
                        width={flagSize}
                        height={flagSize}
                        style={{
                            width: `${flagSize}px`,
                            height: `${flagSize - 4}px`,
                            objectFit: 'fill'
                        }}
                    />
                    <Typography
                        color='info.contrastText'
                        display={'inline-block'}
                        sx={{ fontSize: '16px !important' }}
                        pl={1}
                    >
                        English
                    </Typography>
                </MenuItem>
            </Select>

            <RiArrowDownSLine
                fontSize={'20px'}
                color={isScrolled ? palette.info[600] : palette.info[50]}
                onClick={handleOpen}
                style={{
                    paddingTop: '4px',
                    transition: 'color 0.3s ease-in-out',
                    cursor: 'pointer'
                }}
            />
        </Stack>
    )
}