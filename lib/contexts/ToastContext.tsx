'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

interface ToastContextType {
    showToast: (message: string, severity?: AlertColor) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<AlertColor>('info');

    const showToast = (msg: string, sev: AlertColor = 'info') => {
        setMessage(msg);
        setSeverity(sev);
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    sx={{
                        width: '100%',
                        ...(severity === 'success' && {
                            backgroundColor: 'secondary.dark',
                            color: 'white'
                        })
                    }}
                    variant="filled"
                >
                    {message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
}

export function useToast(): ToastContextType {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
