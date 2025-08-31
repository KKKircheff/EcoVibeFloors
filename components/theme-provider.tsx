'use client';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline } from '@mui/material';
import luxuryTheme from '@/lib/theme';

type Props = {
    children: React.ReactNode;
};

export default function ClientThemeProvider({ children }: Props) {
    return (
        <AppRouterCacheProvider >
            <ThemeProvider theme={luxuryTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}