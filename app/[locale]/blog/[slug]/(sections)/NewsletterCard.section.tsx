'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useAuth } from '@/lib/contexts/AuthContext';
import { subscribeToNewsletter } from '@/app/[locale]/blog/actions';

interface NewsletterCardProps {
    locale: string;
    title: string;
    subtitle: string;
    placeholder: string;
    buttonLabel: string;
    loggedInInfo: string;
    successMessage: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 80;

export function NewsletterCard({
    locale,
    title,
    subtitle,
    placeholder,
    buttonLabel,
    loggedInInfo,
    successMessage,
}: NewsletterCardProps) {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = async () => {
        const targetEmail = isAuthenticated && user?.email ? user.email : email.trim();

        if (!isAuthenticated) {
            if (targetEmail.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(targetEmail)) {
                setEmailError('Please enter a valid email address.');
                return;
            }
            setEmailError('');
        }

        setStatus('loading');
        const language = locale === 'bg' ? 'bg' : 'en';
        await subscribeToNewsletter(targetEmail, language, user?.uid);
        setStatus('success');
    };

    if (status === 'success') {
        return (
            <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'success.light', bgcolor: 'success.50' }}>
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <CheckCircleOutlineIcon sx={{ color: 'success.main', fontSize: 22 }} />
                        <Typography variant="body2" color="success.dark" fontWeight={500}>
                            {successMessage}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card variant="outlined" sx={{ borderRadius: 2, borderColor: 'primary.light', bgcolor: 'primary.50' }}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Typography variant="subtitle2" color="primary.dark" fontWeight={600}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 2 }}>
                    {subtitle}
                </Typography>
                <Stack spacing={1.5}>
                    {isAuthenticated && user?.email ? (
                        <>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    px: 1.5,
                                    py: 1,
                                    bgcolor: 'white',
                                    borderRadius: 1,
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {user.email}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                                {loggedInInfo}
                            </Typography>
                        </>
                    ) : !authLoading ? (
                        <TextField
                            size="small"
                            placeholder={placeholder}
                            fullWidth
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError('');
                            }}
                            error={!!emailError}
                            helperText={emailError || undefined}
                            slotProps={{ htmlInput: { maxLength: MAX_EMAIL_LENGTH } }}
                            sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 1 } }}
                        />
                    ) : null}
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        fullWidth
                        disabled={status === 'loading' || authLoading}
                        onClick={handleSubmit}
                        sx={{ borderRadius: 1 }}
                    >
                        {status === 'loading' ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : (
                            buttonLabel
                        )}
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
}
