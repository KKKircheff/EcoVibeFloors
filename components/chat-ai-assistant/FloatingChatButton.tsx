/**
 * Floating Chat Button Component
 *
 * Toggleable floating action button for chat assistant
 */

'use client';

import { useState } from 'react';
import { Fab, Zoom, Dialog, useMediaQuery, useTheme } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { ChatAssistant } from './ChatAssistant';
import { palette } from '@/lib/styles/pallete';

export function FloatingChatButton() {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {/* Floating Action Button */}
            <Zoom in={!open}>
                <Fab
                    color="primary"
                    aria-label="chat"
                    onClick={handleToggle}
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                    }}
                >
                    <ChatIcon />
                </Fab>
            </Zoom>

            {/* Chat Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={isMobile}
                maxWidth="md"
                fullWidth
                hideBackdrop
                slotProps={{
                    paper: {
                        sx: {
                            position: 'fixed',
                            bottom: isMobile ? 0 : 70,
                            right: isMobile ? 0 : 24,
                            height: isMobile ? '100%' : '80vh',
                            maxHeight: isMobile ? '100%' : '900px',
                            width: isMobile ? '100%' : '40%',
                            maxWidth: isMobile ? '100%' : '40%',
                            m: 0,
                            borderRadius: isMobile ? 0 : 2,
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: palette.primary[500],
                            bgcolor: 'transparent',
                            boxShadow: isMobile ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.24)',
                        },
                    },
                }}
            >
                <ChatAssistant onClose={handleClose} embedded />
            </Dialog>
        </>
    );
}
