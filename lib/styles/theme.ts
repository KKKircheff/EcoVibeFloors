import {createTheme} from '@mui/material/styles';
import {Zen_Kaku_Gothic_New, Poiret_One, Montserrat} from 'next/font/google';
import {palette} from './pallete';

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
});

const poiretOne = Poiret_One({
    weight: ['400'],
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
});

const montserrat = Montserrat({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
});

// Luxury color palette inspired by premium flooring
const luxuryTheme = createTheme({
    palette: palette,
    typography: {
        fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
        h1: {
            fontFamily: `${poiretOne.style.fontFamily}, ${montserrat.style.fontFamily}, serif`,
            fontSize: '3.5rem',
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: '0.02em',
        },
        h2: {
            fontFamily: `${poiretOne.style.fontFamily}, ${montserrat.style.fontFamily}, serif`,
            fontSize: '2.75rem',
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: '0.01em',
        },
        h3: {
            fontFamily: `${poiretOne.style.fontFamily}, ${montserrat.style.fontFamily}, serif`,
            fontSize: '2.25rem',
            fontWeight: 400,
            lineHeight: 1.3,
        },
        h4: {
            fontFamily: `${poiretOne.style.fontFamily}, ${montserrat.style.fontFamily}, serif`,
            fontSize: '1.75rem',
            fontWeight: 400,
            lineHeight: 1.3,
        },
        h5: {
            fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '1.5rem',
            fontWeight: 400,
            lineHeight: 1.4,
        },
        h6: {
            fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '1.25rem',
            fontWeight: 400,
            lineHeight: 1.4,
        },
        body1: {
            fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.6,
        },
        body2: {
            fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.6,
        },
        button: {
            fontFamily: `${montserrat.style.fontFamily}, ${zenKakuGothicNew.style.fontFamily}, sans-serif`,
            fontWeight: 500,
            textTransform: 'none' as const,
            letterSpacing: '0.02em',
        },
    },
    components: {
        // MuiButton: {
        //     styleOverrides: {
        //         root: {
        //             borderRadius: 8,
        //             padding: '12px 24px',
        //             fontSize: '1rem',
        //             boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        //             '&:hover': {
        //                 boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        //             },
        //         },
        //         contained: {
        //             background: 'linear-gradient(45deg, #8B4513 30%, #A0522D 90%)',
        //             '&:hover': {
        //                 background: 'linear-gradient(45deg, #654321 30%, #8B4513 90%)',
        //             },
        //         },
        //     },
        // },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    '&:hover': {
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: '#2C2C2C',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: palette.primary.main,
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: ':palette.primary.main,',
                        },
                    },
                },
            },
        },
    },
});

export default luxuryTheme;
