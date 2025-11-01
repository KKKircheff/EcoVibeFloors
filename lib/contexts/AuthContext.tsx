'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { useRouter } from '@/i18n/navigation';
import {
    signIn as authSignIn,
    signUp as authSignUp,
    signInWithGooglePopup as authSignInWithGooglePopup,
    signInWithGoogle as authSignInWithGoogle,
    handleRedirectResult as authHandleRedirectResult,
    signOutUser as authSignOut,
    onAuthStateChangedListener,
    AuthResult
} from '@/lib/firebase/auth';

interface AuthContextType {
    user: FirebaseUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<AuthResult>;
    signUp: (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
        isDesignProfessional?: boolean;
        language?: 'en' | 'bg';
    }) => Promise<AuthResult>;
    signInWithGooglePopup: () => Promise<AuthResult>;
    signInWithGoogle: () => Promise<AuthResult | void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();

    // Subscribe to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
            setIsHydrated(true);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    // Check for redirect result on mount (for signInWithRedirect)
    useEffect(() => {
        const checkRedirectResult = async () => {
            const result = await authHandleRedirectResult();

            if (result.success && result.user) {
                setUser(result.user);
                // Navigate to home page after successful redirect sign-in
                router.push('/');
            }
        };

        // Only check on client side
        if (typeof window !== 'undefined') {
            checkRedirectResult();
        }
    }, [router]);

    const signIn = async (email: string, password: string): Promise<AuthResult> => {
        const result = await authSignIn(email, password);
        if (result.success && result.user) {
            setUser(result.user);
        }
        return result;
    };

    const signUp = async (data: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        phone?: string;
        isDesignProfessional?: boolean;
        language?: 'en' | 'bg';
    }): Promise<AuthResult> => {
        const result = await authSignUp(data);
        if (result.success && result.user) {
            setUser(result.user);
        }
        return result;
    };

    const signInWithGooglePopup = async (): Promise<AuthResult> => {
        const result = await authSignInWithGooglePopup();
        if (result.success && result.user) {
            setUser(result.user);
            // Navigate to home page after successful sign-in
            router.push('/');
        }
        return result;
    };

    const signInWithGoogle = async (): Promise<AuthResult | void> => {
        const result = await authSignInWithGoogle();

        // If using popup (dev), result will be returned immediately
        if (result && result.success && result.user) {
            setUser(result.user);
            router.push('/');
            return result;
        }
    };

    const signOut = async (): Promise<void> => {
        await authSignOut();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        loading,
        signIn,
        signUp,
        signInWithGooglePopup,
        signInWithGoogle,
        signOut,
    };

    // Don't render children until hydrated to avoid SSR mismatch
    if (!isHydrated) {
        return null;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
