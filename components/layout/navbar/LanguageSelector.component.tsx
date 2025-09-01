// components/navigation/LanguageSelector.component.tsx
"use client"
import React, { useState } from 'react'
import { borderRadius } from '@/lib/styles/borderRadius';
import { alpha, MenuItem, Select, SelectChangeEvent, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import Image from 'next/image';
import { RiArrowDownSLine } from 'react-icons/ri';
import { Locale } from '@/i18n/routing';
import { usePathname, useRouter } from '@/i18n/navigation';
import { palette } from '@/lib/styles/pallete';
import { useTranslations } from 'next-intl';

type Props = {
    locale: Locale
}
const flagSize = 22

export const LanguageSelector = ({ locale }: Props) => {
    const t = useTranslations('navigation');
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
        <Stack direction='row' alignItems={'center'} spacing={0}>
            <Select
                variant="standard"
                size="medium"
                value={locale}
                color="primary"
                onChange={(e) => handleLanguageChange(e)}
                onOpen={handleOpen}
                onClose={handleClose}
                open={open}
                sx={{
                    border: 'none !important',
                    maxWidth: flagSize + 2,
                    overflow: 'hidden',

                    // Remove underline and border effects
                    '&::before, &::after': {
                        display: 'none !important',
                        border: 'none !important',
                    },
                    // Standard variant specific styling
                    '& .MuiSelect-standard': {
                        marginTop: .6,
                        padding: '0px 0px',
                        overflow: 'hidden',
                        maxWidth: flagSize,
                        background: 'transparent',
                        // background: c.neutral[200],
                        borderRadius: br.md,
                        transition: 'background-color 0.3s ease',

                        '&:hover': {
                            // background: c.neutral[400],
                            outline: 'none',
                        },
                    },

                    // Hide dropdown icon
                    '& .MuiSelect-icon': {
                        display: 'none',
                    },

                    // Focused state
                    '&.Mui-focused': {
                        outline: 'none !important',
                        border: 'none !important',
                        boxShadow: 'none !important',

                        '& .MuiSelect-standard': {
                            color: palette.primary.contrastText,
                        }
                    },
                }}
                // Dropdown menu styles
                MenuProps={{
                    PaperProps: {
                        sx: {
                            mt: isMobile ? -1.5 : 1,
                            ml: -1.3,
                            borderRadius: br.md,
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
                        vertical: isMobile ? 'top' : 'bottom',
                        horizontal: 'left',
                    },
                    transformOrigin: {
                        vertical: isMobile ? 'bottom' : 'top',
                        horizontal: 'left',
                    },
                    disableScrollLock: true,
                }}
            >
                <MenuItem value='en'>
                    <Image
                        src={`/images/flags/gb.png`}
                        alt="UK flag"
                        width={flagSize}
                        height={flagSize}
                        style={{ borderRadius: flagSize, border: `1px solid ${palette.info[400]}` }}
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
                <MenuItem value='bg'>
                    <Image
                        src={`/images/flags/bg.png`}
                        alt="Bulgarian Flag"
                        width={flagSize}
                        height={flagSize}
                        style={{ borderRadius: flagSize }}
                    />
                    <Typography
                        color='info.contrastText'
                        display={'inline-block'}
                        sx={{ fontSize: '16px !important' }}
                        pl={1}>
                        Български
                    </Typography>
                </MenuItem>
            </Select>
            <RiArrowDownSLine fontSize={'20px'} color='neutral.600' onClick={handleOpen} />
        </Stack>
    )
}