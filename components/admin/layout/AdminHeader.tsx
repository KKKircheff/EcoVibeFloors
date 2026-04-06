'use client';

import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Stack,
    Tooltip,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useAdminAuth } from './AdminAuthProvider';
import { SIDEBAR_WIDTH } from './AdminSidebar';
import { palette } from '@/lib/styles/pallete';
import { navbarHeight } from '@/lib/styles/navbarHeight';

interface AdminHeaderProps {
    title?: string;
}

export function AdminHeader({ title }: AdminHeaderProps) {
    const { user, signOut } = useAdminAuth();
    const router = useRouter();
    const t = useTranslations('admin');

    const handleSignOut = async () => {
        await signOut();
        router.push('/admin/login');
    };

    const initials = user?.displayName
        ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
        : user?.email?.[0]?.toUpperCase() ?? '?';

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
                ml: `${SIDEBAR_WIDTH}px`,
                top: { xs: navbarHeight.xs, md: navbarHeight.md },
                bgcolor: palette.primary[500],
                borderBottom: 'none',
                color: 'white',
            }}
        >
            <Toolbar>
                <Typography variant="h6" fontWeight={500} sx={{ flexGrow: 1 }}>
                    {title ?? t('title')}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" color="rgba(255,255,255,0.75)">
                        {user?.displayName || user?.email}
                    </Typography>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: palette.primary[500], fontSize: 13, color: 'white' }}>
                        {initials}
                    </Avatar>
                    <Tooltip title={t('header.signOut')}>
                        <IconButton size="small" onClick={handleSignOut} sx={{ color: 'rgba(255,255,255,0.75)' }}>
                            <LogoutIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
