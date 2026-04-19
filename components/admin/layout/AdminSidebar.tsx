'use client';

import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
    Divider,
    Tooltip,
} from '@mui/material';
import {
    Inventory2Outlined as ProductsIcon,
    ArticleOutlined as BlogIcon,
    PeopleOutlined as CrmIcon,
    DashboardOutlined as DashboardIcon,
    HomeOutlined as HomeIcon,
} from '@mui/icons-material';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { palette } from '@/lib/styles/pallete';
import { navbarHeight } from '@/lib/styles/navbarHeight';

export const SIDEBAR_WIDTH = 220;

export function AdminSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations('admin');

    const navItems = [
        { label: t('sidebar.dashboard'), icon: <DashboardIcon />, href: '/admin' as const, exact: true },
        { label: t('sidebar.products'), icon: <ProductsIcon />, href: '/admin/products' },
        { label: t('sidebar.blog'), icon: <BlogIcon />, href: '/admin/blog' },
        { label: t('sidebar.crm'), icon: <CrmIcon />, href: '/admin/crm', disabled: true },
    ];

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: SIDEBAR_WIDTH,
                    boxSizing: 'border-box',
                    bgcolor: palette.info[700],
                    color: 'white',
                    borderRight: 'none',
                    top: { xs: navbarHeight.xs, md: navbarHeight.md },
                    height: { xs: `calc(100vh - ${navbarHeight.xs})`, md: `calc(100vh - ${navbarHeight.md})` },
                },
            }}
        >
            <Stack px={2} py={3}>
                <Typography
                    variant="h6"
                    fontWeight={600}
                    color="white"
                    noWrap
                >
                    {t('title')}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {t('managementPanel')}
                </Typography>
            </Stack>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)' }} />

            <List sx={{ px: 1, pt: 1 }}>
                {navItems.map((item) => (
                    <Tooltip
                        key={item.href}
                        title={item.disabled ? t('sidebar.comingSoon') : ''}
                        placement="right"
                    >
                        <span>
                            <ListItemButton
                                disabled={item.disabled}
                                selected={isActive(item.href, item.exact)}
                                onClick={() => router.push(item.href)}
                                sx={{
                                    borderRadius: 1,
                                    mb: 0.5,
                                    color: 'rgba(255,255,255,0.75)',
                                    '&.Mui-selected': {
                                        bgcolor: 'rgba(255,255,255,0.12)',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
                                    },
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' },
                                    '&.Mui-disabled': { opacity: 0.4 },
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    slotProps={{ primary: { variant: 'body2', fontWeight: 500 } }}
                                />
                            </ListItemButton>
                        </span>
                    </Tooltip>
                ))}
            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mt: 'auto' }} />

            <List sx={{ px: 1, pb: 1 }}>
                <ListItemButton
                    onClick={() => router.push('/')}
                    sx={{
                        borderRadius: 1,
                        color: 'rgba(255,255,255,0.75)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' },
                    }}
                >
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText
                        primary={t('sidebar.backToSite')}
                        slotProps={{ primary: { variant: 'body2', fontWeight: 500 } }}
                    />
                </ListItemButton>
            </List>
        </Drawer>
    );
}
