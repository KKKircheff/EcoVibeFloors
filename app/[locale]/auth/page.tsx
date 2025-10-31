'use client';

import React, { useState } from 'react';
import {
    Box,
    Container,
    Stack,
    Typography,
    TextField,
    Button,
    Divider,
    Alert,
    Checkbox,
    FormControlLabel,
    Card,
    Tabs,
    Tab,
} from '@mui/material';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/hooks';
import PrimaryActionButton from '@/components/ui/buttons/PrimaryActionButton';
import { getAuthErrorTranslationKey } from '@/lib/firebase/auth';
import googleIcon from '../../../public/images/icons/google.png';

type AuthMode = 'login' | 'signup';

export default function AuthPage() {
    const t = useTranslations('auth');
    const locale = useLocale() as 'en' | 'bg';
    const router = useRouter();
    const { signIn, signUp, signInWithGoogle } = useAuth();

    // Tab state
    const [mode, setMode] = useState<AuthMode>('login');

    // Shared state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTabChange = (_event: React.SyntheticEvent, newValue: AuthMode) => {
        setMode(newValue);
        setError(''); // Clear errors when switching tabs
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        console.log('🔐 Auth Page: Starting Google sign-in...');

        const result = await signInWithGoogle();

        if (result && !result.success) {
            console.error('❌ Auth Page: Google sign-in failed');
            const errorKey = result.code
                ? getAuthErrorTranslationKey(result.code)
                : 'unexpectedError';
            setError(t(`errors.${errorKey}` as 'errors.unexpectedError'));
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Card elevation={3} sx={{ p: 4, px: { xs: 1, md: 4 } }}>
                <Stack spacing={4}>
                    {/* Tabs */}
                    <Tabs
                        value={mode}
                        onChange={handleTabChange}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            mb: 2,
                        }}
                    >
                        <Tab label={t('login')} value="login" sx={{ mx: 'auto', width: '50%', color: 'info.600' }} />
                        <Tab label={t('signUp')} value="signup" sx={{ mx: 'auto', width: '50%', color: 'info.600' }} />
                    </Tabs>

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    {/* Google Sign In */}
                    <Button
                        variant="contained"
                        color='info'
                        size="large"
                        fullWidth
                        startIcon={
                            <Image
                                src={googleIcon}
                                alt="Google"
                                width={20}
                                height={20}
                                style={{ objectFit: 'contain' }}
                            />
                        }
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        sx={{
                            py: 1.5,
                            border: '1px solid',
                            borderColor: 'info.200',
                            borderRadius: '60px',
                            bgcolor: 'white',
                            color: 'info.600',
                            '&:hover': {
                                color: 'info.50',
                                borderColor: 'grey.400',
                                backgroundColor: 'grey.800',
                            },
                        }}
                    >
                        {t('googleSignIn')}
                    </Button>

                    <Divider>
                        <Typography variant="body2" color="text.secondary">
                            {t('orDivider')}
                        </Typography>
                    </Divider>

                    {/* Forms */}
                    {mode === 'login' ? (
                        <LoginForm
                            t={t}
                            signIn={signIn}
                            router={router}
                            loading={loading}
                            setLoading={setLoading}
                            setError={setError}
                        />
                    ) : (
                        <SignUpForm
                            t={t}
                            signUp={signUp}
                            router={router}
                            locale={locale}
                            loading={loading}
                            setLoading={setLoading}
                            setError={setError}
                        />
                    )}
                </Stack>
            </Card>
        </Container>
    );
}

// Login Form Component
interface LoginFormProps {
    t: ReturnType<typeof useTranslations>;
    signIn: (email: string, password: string) => Promise<any>;
    router: ReturnType<typeof useRouter>;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
}

function LoginForm({ t, signIn, router, loading, setLoading, setError }: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateForm = (): boolean => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError(t('validation.emailRequired'));
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setEmailError(t('validation.emailInvalid'));
            isValid = false;
        }

        if (!password) {
            setPasswordError(t('validation.passwordRequired'));
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        const result = await signIn(email, password);

        if (result.success) {
            router.push('/');
        } else {
            const errorKey = result.code
                ? getAuthErrorTranslationKey(result.code)
                : 'unexpectedError';
            setError(t(`errors.${errorKey}` as 'errors.unexpectedError'));
        }

        setLoading(false);
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <TextField
                    label={t('email')}
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                    disabled={loading}
                    autoComplete="email"
                />

                <TextField
                    label={t('password')}
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
                    disabled={loading}
                    autoComplete="current-password"
                />

                <PrimaryActionButton type="submit" fullWidth disabled={loading} sx={{ mt: 2 }}>
                    {loading ? t('loading') : t('signIn')}
                </PrimaryActionButton>
            </Stack>
        </Box>
    );
}

// SignUp Form Component
interface SignUpFormProps {
    t: ReturnType<typeof useTranslations>;
    signUp: (data: any) => Promise<any>;
    router: ReturnType<typeof useRouter>;
    locale: 'en' | 'bg';
    loading: boolean;
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
}

function SignUpForm({ t, signUp, router, locale, loading, setLoading, setError }: SignUpFormProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        isDesignProfessional: false,
    });

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const validateForm = (): boolean => {
        const newErrors = {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        let isValid = true;

        if (!formData.fullName.trim()) {
            newErrors.fullName = t('validation.fullNameRequired');
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = t('validation.emailRequired');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('validation.emailInvalid');
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = t('validation.passwordRequired');
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = t('validation.passwordTooShort');
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('validation.passwordsDontMatch');
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        const nameParts = formData.fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const result = await signUp({
            email: formData.email,
            password: formData.password,
            firstName,
            lastName,
            phone: formData.phone || undefined,
            isDesignProfessional: formData.isDesignProfessional,
            language: locale,
        });

        if (result.success) {
            router.push('/');
        } else {
            const errorKey = result.code
                ? getAuthErrorTranslationKey(result.code)
                : 'unexpectedError';
            setError(t(`errors.${errorKey}` as 'errors.unexpectedError'));
        }

        setLoading(false);
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (field in errors) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <TextField
                    label={t('fullName')}
                    fullWidth
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    disabled={loading}
                    autoComplete="name"
                />

                <TextField
                    label={t('email')}
                    type="email"
                    fullWidth
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={loading}
                    autoComplete="email"
                />

                <TextField
                    label={t('phone')}
                    type="tel"
                    fullWidth
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={loading}
                    autoComplete="tel"
                />

                <TextField
                    label={t('password')}
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={loading}
                    autoComplete="new-password"
                />

                <TextField
                    label={t('confirmPassword')}
                    type="password"
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={loading}
                    autoComplete="new-password"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.isDesignProfessional}
                            onChange={(e) =>
                                handleInputChange('isDesignProfessional', e.target.checked)
                            }
                            disabled={loading}
                        />
                    }
                    label={t('designProfessional')}
                />

                <PrimaryActionButton type="submit" fullWidth disabled={loading} sx={{ mt: 2 }}>
                    {loading ? t('loading') : t('signUp')}
                </PrimaryActionButton>
            </Stack>
        </Box>
    );
}
