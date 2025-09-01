import {createTheme} from '@mui/material/styles';
import {Roboto} from 'next/font/google';
import {palette} from './pallete';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin', 'cyrillic'],
    display: 'swap',
});

// Luxury color palette inspired by premium flooring
const luxuryTheme = createTheme({
    palette: palette,
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: {
            fontSize: '3.5rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: '2.75rem',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontSize: '2.25rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h4: {
            fontSize: '1.75rem',
            fontWeight: 600,
            lineHeight: 1.3,
        },
        h5: {
            fontSize: '1.5rem',
            fontWeight: 500,
            lineHeight: 1.4,
        },
        h6: {
            fontSize: '1.25rem',
            fontWeight: 500,
            lineHeight: 1.4,
        },
        body1: {
            fontSize: '1rem',
            fontWeight: 400,
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.6,
        },
        button: {
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
