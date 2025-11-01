// Authentication utilities for Firebase Auth

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    updateEmail,
    updatePassword,
    sendEmailVerification,
    User as FirebaseUser,
    AuthError,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth';

import {auth} from '../firebase';
import {UsersDB} from './db';
import {User, FirebaseResult} from './types';

export interface AuthResult {
    success: boolean;
    user?: FirebaseUser;
    error?: string;
    code?: string;
}

export interface SignUpData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isDesignProfessional?: boolean;
    language?: 'en' | 'bg';
}

export interface UpdateProfileData {
    displayName?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    photoURL?: string;
    company?: string;
}

// Sign up with email and password
export async function signUp(data: SignUpData): Promise<AuthResult> {
    try {
        const {email, password, firstName, lastName, phone, isDesignProfessional = false, language = 'en'} = data;

        // Create Firebase user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Update Firebase profile
        await updateProfile(firebaseUser, {
            displayName: `${firstName} ${lastName}`,
        });

        // Create user document in Firestore
        const userData = {
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName!,
            role: 'customer' as const,
            preferences: {
                language,
            },
            profile: {
                isDesignProfessional,
                ...(phone && {phone}),
            },
            ...(firebaseUser.photoURL && {photoURL: firebaseUser.photoURL}),
        };

        await UsersDB.createWithId(firebaseUser.uid, userData);

        // Send email verification
        await sendVerificationEmail();

        return {
            success: true,
            user: firebaseUser,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to sign up',
            code: (error as AuthError)?.code,
        };
    }
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthResult> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return {
            success: true,
            user: userCredential.user,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to sign in',
            code: (error as AuthError)?.code,
        };
    }
}

// Sign in with Google using popup
// Works reliably across all environments (dev and production)
// No third-party storage issues or iframe complications
export async function signInWithGooglePopup(): Promise<AuthResult> {
    try {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        // Use popup instead of redirect - completes in same window
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        // Check if user exists in Firestore, create if not
        const userResult = await UsersDB.getById(user.uid);

        if (!userResult.success) {
            // Create user document
            const userData = {
                email: user.email!,
                displayName: user.displayName || user.email!,
                role: 'customer' as const,
                preferences: {
                    language: 'en' as const,
                },
                profile: {
                    isDesignProfessional: false,
                },
                ...(user.photoURL && {photoURL: user.photoURL}),
            };

            await UsersDB.createWithId(user.uid, userData);
        }

        return {
            success: true,
            user,
        };
    } catch (error) {
        console.error('❌ Auth: Error with popup sign-in:', error);

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to sign in with Google',
            code: (error as AuthError)?.code,
        };
    }
}

// Sign in with Google using redirect
// Recommended for production/mobile devices - better compatibility
// Requires custom authDomain to match app domain for getRedirectResult() to work
export async function signInWithGoogleRedirect(): Promise<void> {
    try {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

        // Redirect to Google sign-in
        // User will be redirected back to the app after authentication
        // Use handleRedirectResult() on the landing page to complete sign-in
        await signInWithRedirect(auth, provider);
    } catch (error) {
        console.error('❌ Auth: Error initiating redirect sign-in:', error);
        throw error;
    }
}

// Handle redirect result after Google sign-in
// Call this function when the app loads to check for redirect result
export async function handleRedirectResult(): Promise<AuthResult> {
    try {
        const result = await getRedirectResult(auth);

        if (!result) {
            return {
                success: false,
                error: 'No redirect result',
            };
        }

        const user = result.user;

        const userResult = await UsersDB.getById(user.uid);

        if (!userResult.success) {
            const userData = {
                email: user.email!,
                displayName: user.displayName || user.email!,
                role: 'customer' as const,
                preferences: {
                    language: 'en' as const,
                },
                profile: {
                    isDesignProfessional: false,
                },
                ...(user.photoURL && {photoURL: user.photoURL}),
            };

            await UsersDB.createWithId(user.uid, userData);
        }

        return {
            success: true,
            user,
        };
    } catch (error) {
        console.error('❌ Auth: Error handling redirect result:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to handle redirect result',
            code: (error as AuthError)?.code,
        };
    }
}

// Sign in with Google - automatically chooses popup or redirect based on environment
// Development: Uses popup (better DX, works on localhost)
// Production: Uses redirect (better mobile compatibility, works with custom domain)
export async function signInWithGoogle(): Promise<AuthResult | void> {
    const isProduction = process.env.NODE_ENV === 'production';
    const isMobile =
        typeof window !== 'undefined' &&
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // TEMPORARY: Force redirect in development for testing
    // TODO: Remove this and restore the original condition after testing
    const forceRedirectForTesting = false;

    // Use redirect in production or on mobile devices
    if (isProduction || isMobile || forceRedirectForTesting) {
        //     await signInWithGoogleRedirect();
        //     // Redirect methods don't return immediately - user will be redirected
        //     return;
        return await signInWithGooglePopup();
    } else {
        return await signInWithGooglePopup();
    }
}

// Sign out
export async function signOutUser(): Promise<FirebaseResult<void>> {
    try {
        await signOut(auth);
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to sign out',
            code: (error as AuthError)?.code,
        };
    }
}

// Send password reset email
export async function sendPasswordResetEmailToUser(email: string): Promise<FirebaseResult<void>> {
    try {
        await sendPasswordResetEmail(auth, email);
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send password reset email',
            code: (error as AuthError)?.code,
        };
    }
}

// Send email verification
export async function sendVerificationEmail(): Promise<FirebaseResult<void>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'No user signed in',
            };
        }

        await sendEmailVerification(user);
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to send verification email',
            code: (error as AuthError)?.code,
        };
    }
}

// Update user profile
export async function updateUserProfile(data: UpdateProfileData): Promise<FirebaseResult<void>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'No user signed in',
            };
        }

        // Update Firebase profile if needed
        if (data.displayName !== undefined || data.photoURL !== undefined) {
            const updates: {displayName?: string; photoURL?: string} = {};
            if (data.displayName !== undefined) updates.displayName = data.displayName;
            if (data.photoURL !== undefined) updates.photoURL = data.photoURL;

            await updateProfile(user, updates);
        }

        // Update Firestore user document
        const firestoreUpdates: Record<string, unknown> = {};
        if (data.displayName) firestoreUpdates.displayName = data.displayName;
        if (data.photoURL !== undefined) firestoreUpdates.photoURL = data.photoURL;

        if (data.firstName || data.lastName || data.phone !== undefined || data.company !== undefined) {
            const profileUpdates: Record<string, unknown> = {};
            if (data.firstName) profileUpdates['profile.firstName'] = data.firstName;
            if (data.lastName) profileUpdates['profile.lastName'] = data.lastName;
            if (data.phone !== undefined) profileUpdates['profile.phone'] = data.phone;
            if (data.company !== undefined) profileUpdates['profile.company'] = data.company;

            Object.assign(firestoreUpdates, profileUpdates);
        }

        if (Object.keys(firestoreUpdates).length > 0) {
            await UsersDB.update(user.uid, firestoreUpdates);
        }

        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update profile',
            code: (error as AuthError)?.code,
        };
    }
}

// Update user email
export async function updateUserEmail(newEmail: string): Promise<FirebaseResult<void>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'No user signed in',
            };
        }

        await updateEmail(user, newEmail);

        // Update Firestore user document
        await UsersDB.update(user.uid, {email: newEmail});

        // Send verification email for new email
        await sendVerificationEmail();

        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update email',
            code: (error as AuthError)?.code,
        };
    }
}

// Update user password
export async function updateUserPassword(newPassword: string): Promise<FirebaseResult<void>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'No user signed in',
            };
        }

        await updatePassword(user, newPassword);
        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update password',
            code: (error as AuthError)?.code,
        };
    }
}

// Re-authenticate user (required for sensitive operations)
export async function reauthenticateUser(password: string): Promise<FirebaseResult<void>> {
    try {
        const user = auth.currentUser;
        if (!user || !user.email) {
            return {
                success: false,
                error: 'No user signed in or email not available',
            };
        }

        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to re-authenticate',
            code: (error as AuthError)?.code,
        };
    }
}

// Delete user account
export async function deleteUserAccount(password: string): Promise<FirebaseResult<void>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'No user signed in',
            };
        }

        // Re-authenticate before deletion
        const reauthResult = await reauthenticateUser(password);
        if (!reauthResult.success) {
            return reauthResult;
        }

        // Delete user document from Firestore
        await UsersDB.delete(user.uid);

        // Delete Firebase user
        await deleteUser(user);

        return {success: true};
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to delete account',
            code: (error as AuthError)?.code,
        };
    }
}

// Get current user data from Firestore
export async function getCurrentUserData(): Promise<FirebaseResult<User>> {
    try {
        const user = auth.currentUser;
        if (!user) {
            return {
                success: false,
                error: 'No user signed in',
            };
        }

        return (await UsersDB.getById(user.uid)) as FirebaseResult<User>;
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get user data',
        };
    }
}

// Auth state observer
export function onAuthStateChangedListener(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
}

// Get current Firebase user
export function getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
    return !!auth.currentUser;
}

// Check if user email is verified
export function isEmailVerified(): boolean {
    return auth.currentUser?.emailVerified ?? false;
}

// Role-based access control helpers
export async function hasRole(role: 'customer' | 'admin' | 'designer'): Promise<boolean> {
    try {
        const userResult = await getCurrentUserData();
        if (!userResult.success || !userResult.data) {
            return false;
        }
        return userResult.data.role === role;
    } catch {
        return false;
    }
}

export async function isAdmin(): Promise<boolean> {
    return hasRole('admin');
}

export async function isDesigner(): Promise<boolean> {
    return hasRole('designer');
}

export async function isDesignProfessional(): Promise<boolean> {
    try {
        const userResult = await getCurrentUserData();
        if (!userResult.success || !userResult.data) {
            return false;
        }
        return userResult.data.profile.isDesignProfessional || userResult.data.role === 'designer';
    } catch {
        return false;
    }
}

/**
 * Maps Firebase auth error codes to camelCase translation keys used in messages/en.json and messages/bg.json
 * under the auth.errors namespace
 *
 * @param errorCode - Firebase error code (e.g., 'auth/user-not-found')
 * @returns Translation key (e.g., 'userNotFound') or 'unexpectedError' for unmapped codes
 *
 * @example
 * ```ts
 * const key = getAuthErrorTranslationKey('auth/user-not-found'); // Returns 'userNotFound'
 * const message = t(`auth.errors.${key}`); // Gets translated message
 * ```
 */
export function getAuthErrorTranslationKey(errorCode: string): string {
    const errorMap: Record<string, string> = {
        'auth/user-not-found': 'userNotFound',
        'auth/wrong-password': 'wrongPassword',
        'auth/email-already-in-use': 'emailAlreadyInUse',
        'auth/weak-password': 'weakPassword',
        'auth/invalid-email': 'invalidEmail',
        'auth/too-many-requests': 'tooManyRequests',
        'auth/network-request-failed': 'networkError',
        'auth/requires-recent-login': 'requiresRecentLogin',
        'auth/popup-closed-by-user': 'popupClosedByUser',
        'auth/cancelled-popup-request': 'cancelledPopupRequest',
        'auth/account-exists-with-different-credential': 'accountExistsWithDifferentCredential',
        'auth/unauthorized-domain': 'unauthorizedDomain',
        'auth/operation-not-allowed': 'operationNotAllowed',
        'auth/invalid-api-key': 'invalidApiKey',
    };

    return errorMap[errorCode] || 'unexpectedError';
}
