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
    AuthResult,
} from '@/lib/firebase/auth';

interface AdminAuthContextType {
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

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChangedListener((firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
            setIsHydrated(true);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const checkRedirectResult = async () => {
            const result = await authHandleRedirectResult();
            if (result.success && result.user) {
                setUser(result.user);
                router.push('/admin');
            }
        };
        if (typeof window !== 'undefined') {
            checkRedirectResult();
        }
    }, [router]);

    const signIn = async (email: string, password: string): Promise<AuthResult> => {
        const result = await authSignIn(email, password);
        if (result.success && result.user) setUser(result.user);
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
        if (result.success && result.user) setUser(result.user);
        return result;
    };

    const signInWithGooglePopup = async (): Promise<AuthResult> => {
        const result = await authSignInWithGooglePopup();
        if (result.success && result.user) {
            setUser(result.user);
            router.push('/admin');
        }
        return result;
    };

    const signInWithGoogle = async (): Promise<AuthResult | void> => {
        const result = await authSignInWithGoogle();
        if (result && result.success && result.user) {
            setUser(result.user);
            router.push('/admin');
            return result;
        }
    };

    const signOut = async (): Promise<void> => {
        await authSignOut();
        setUser(null);
    };

    const value: AdminAuthContextType = {
        user,
        isAuthenticated: !!user,
        loading,
        signIn,
        signUp,
        signInWithGooglePopup,
        signInWithGoogle,
        signOut,
    };

    if (!isHydrated) return null;

    return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextType {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth must be used within AdminAuthProvider');
    }
    return context;
}
