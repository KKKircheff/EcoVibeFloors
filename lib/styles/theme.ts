import {createTheme, responsiveFontSizes} from '@mui/material/styles';
import {Zen_Kaku_Gothic_New, Poiret_One, Montserrat, Caveat} from 'next/font/google';
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
export const caveat = Caveat({
    weight: ['400', '500', '600'],
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
});

const baseTheme = createTheme({
    palette: palette,
    typography: {
        // fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
        // fontFamily: `${poiretOne.style.fontFamily}, ${montserrat.style.fontFamily}, serif`,
        fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
        h1: {
            // fontFamily: `${caveat.style.fontFamily}, ${poiretOne.style.fontFamily}, ${montserrat.style.fontFamily}, serif`,
            fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '4.2rem',
            '@media (max-width:600px)': {
                fontSize: '4rem',
            },
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: '0.02em',
        },
        h2: {
            // fontFamily: `${caveat.style.fontFamily}, ${poiretOne.style.fontFamily}, ${montserrat.style.fontFamily}, serif`,
            fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '2.75rem',
            '@media (max-width:600px)': {
                fontSize: '2rem',
            },
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: '0.01em',
        },
        h3: {
            // fontFamily: `${caveat.style.fontFamily}, ${poiretOne.style.fontFamily}, ${montserrat.style.fontFamily}, serif`,
            fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '2.25rem',
            '@media (max-width:600px)': {
                fontSize: '1.75rem',
            },
            fontWeight: 400,
            lineHeight: 1.3,
        },
        h4: {
            // fontFamily: `${caveat.style.fontFamily}, ${poiretOne.style.fontFamily}, ${montserrat.style.fontFamily}, serif`,
            fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '1.75rem',
            '@media (max-width:600px)': {
                fontSize: '1.5rem',
            },
            fontWeight: 400,
            lineHeight: 1.3,
        },
        h5: {
            // fontFamily: `${montserrat.style.fontFamily}, sans-serif`,
            fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '1.5rem',
            '@media (max-width:600px)': {
                fontSize: '1.25rem',
            },
            fontWeight: 400,
            lineHeight: 1.4,
        },
        h6: {
            fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '1.25rem',
            '@media (max-width:600px)': {
                fontSize: '1.125rem',
            },
            fontWeight: 400,
            lineHeight: 1.4,
        },
        subtitle1: {
            fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '1.2rem',
            '@media (max-width:600px)': {
                fontSize: '1.1rem',
            },
            fontWeight: 400,
            lineHeight: 1.6,
        },
        subtitle2: {
            fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '1.1rem',
            '@media (max-width:600px)': {
                fontSize: '1rem',
            },
            fontWeight: 400,
            lineHeight: 1.6,
        },
        body1: {
            fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '1rem',
            '@media (max-width:600px)': {
                fontSize: '0.9rem',
            },
            fontWeight: 400,
            lineHeight: 1.6,
        },
        body2: {
            fontFamily: `${zenKakuGothicNew.style.fontFamily}, ${montserrat.style.fontFamily}, sans-serif`,
            fontSize: '0.875rem',
            '@media (max-width:600px)': {
                fontSize: '0.8rem',
            },
            fontWeight: 400,
            lineHeight: 1.6,
        },
        button: {
            fontFamily: `${montserrat.style.fontFamily}, ${zenKakuGothicNew.style.fontFamily}, sans-serif`,
            fontSize: '1rem',
            '@media (max-width:600px)': {
                fontSize: '0.875rem',
            },
            fontWeight: 500,
            textTransform: 'none' as const,
            letterSpacing: '0.02em',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 1,
                    padding: '12px 24px',
                    fontSize: '1rem',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#FFFFFF',
                    color: '#2C2C2C',
                    // boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
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
                            borderColor: palette.primary.main,
                        },
                    },
                },
            },
        },
    },
});

const luxuryTheme = responsiveFontSizes(baseTheme, {
    breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    factor: 4,
});

export default luxuryTheme;
