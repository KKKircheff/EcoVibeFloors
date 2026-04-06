'use client';

import { AdminGuard } from '@/components/admin/layout/AdminGuard';
import { AdminSidebar, SIDEBAR_WIDTH } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';
import { Box, Toolbar } from '@mui/material';
import { navbarHeight } from '@/lib/styles/navbarHeight';

export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <Box sx={{ display: 'flex', minHeight: '100vh', mt: { xs: navbarHeight.xs, md: navbarHeight.md } }}>
                <AdminSidebar />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        ml: `${SIDEBAR_WIDTH}px`,
                        bgcolor: 'background.default',
                        minHeight: '100vh',
                    }}
                >
                    <AdminHeader />
                    {/* Toolbar spacer pushes content below the fixed AppBar */}
                    <Toolbar />
                    <Box p={3}>{children}</Box>
                </Box>
            </Box>
        </AdminGuard>
    );
}
