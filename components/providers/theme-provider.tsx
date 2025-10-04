'use client';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline, GlobalStyles } from '@mui/material';
import luxuryTheme from '@/lib/styles/theme';

type Props = {
    children: React.ReactNode;
};

export default function ClientThemeProvider({ children }: Props) {
    return (
        <AppRouterCacheProvider>
            <GlobalStyles styles="@layer base,mui,components,utilities;" />
            <ThemeProvider theme={luxuryTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
} ``