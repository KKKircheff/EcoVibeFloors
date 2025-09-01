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
  UserCredential,
  AuthError,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';

import { auth } from '../firebase';
import { UsersDB } from './db';
import { User, FirebaseResult } from './types';

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

export class AuthService {
  
  // Sign up with email and password
  static async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const { email, password, firstName, lastName, phone, isDesignProfessional = false, language = 'en' } = data;
      
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update Firebase profile
      await updateProfile(firebaseUser, {
        displayName: `${firstName} ${lastName}`
      });

      // Create user document in Firestore
      const userData = {
        email: firebaseUser.email!,
        displayName: firebaseUser.displayName!,
        photoURL: firebaseUser.photoURL || undefined,
        role: 'customer' as const,
        preferences: {
          language,
          currency: language === 'bg' ? 'BGN' : 'EUR' as const
        },
        profile: {
          firstName,
          lastName,
          phone: phone || undefined,
          company: undefined,
          isDesignProfessional
        }
      };

      await UsersDB.createWithId(firebaseUser.uid, userData);

      // Send email verification
      await this.sendVerificationEmail();

      return {
        success: true,
        user: firebaseUser
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign up',
        code: (error as AuthError)?.code
      };
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        user: userCredential.user
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign in',
        code: (error as AuthError)?.code
      };
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<AuthResult> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user exists in Firestore, create if not
      const userResult = await UsersDB.getById(user.uid);
      if (!userResult.success) {
        // Create user document
        const userData = {
          email: user.email!,
          displayName: user.displayName || user.email!,
          photoURL: user.photoURL || undefined,
          role: 'customer' as const,
          preferences: {
            language: 'en' as const,
            currency: 'EUR' as const
          },
          profile: {
            firstName: user.displayName?.split(' ')[0] || '',
            lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
            isDesignProfessional: false
          }
        };

        await UsersDB.createWithId(user.uid, userData);
      }

      return {
        success: true,
        user
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign in with Google',
        code: (error as AuthError)?.code
      };
    }
  }

  // Sign out
  static async signOut(): Promise<FirebaseResult<void>> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to sign out',
        code: (error as AuthError)?.code
      };
    }
  }

  // Send password reset email
  static async sendPasswordResetEmail(email: string): Promise<FirebaseResult<void>> {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send password reset email',
        code: (error as AuthError)?.code
      };
    }
  }

  // Send email verification
  static async sendVerificationEmail(): Promise<FirebaseResult<void>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          success: false,
          error: 'No user signed in'
        };
      }

      await sendEmailVerification(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send verification email',
        code: (error as AuthError)?.code
      };
    }
  }

  // Update user profile
  static async updateUserProfile(data: UpdateProfileData): Promise<FirebaseResult<void>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          success: false,
          error: 'No user signed in'
        };
      }

      // Update Firebase profile if needed
      if (data.displayName !== undefined || data.photoURL !== undefined) {
        const updates: { displayName?: string; photoURL?: string } = {};
        if (data.displayName !== undefined) updates.displayName = data.displayName;
        if (data.photoURL !== undefined) updates.photoURL = data.photoURL;
        
        await updateProfile(user, updates);
      }

      // Update Firestore user document
      const firestoreUpdates: any = {};
      if (data.displayName) firestoreUpdates.displayName = data.displayName;
      if (data.photoURL !== undefined) firestoreUpdates.photoURL = data.photoURL;
      
      if (data.firstName || data.lastName || data.phone !== undefined || data.company !== undefined) {
        const profileUpdates: any = {};
        if (data.firstName) profileUpdates['profile.firstName'] = data.firstName;
        if (data.lastName) profileUpdates['profile.lastName'] = data.lastName;
        if (data.phone !== undefined) profileUpdates['profile.phone'] = data.phone;
        if (data.company !== undefined) profileUpdates['profile.company'] = data.company;
        
        Object.assign(firestoreUpdates, profileUpdates);
      }

      if (Object.keys(firestoreUpdates).length > 0) {
        await UsersDB.update(user.uid, firestoreUpdates);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
        code: (error as AuthError)?.code
      };
    }
  }

  // Update user email
  static async updateUserEmail(newEmail: string): Promise<FirebaseResult<void>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          success: false,
          error: 'No user signed in'
        };
      }

      await updateEmail(user, newEmail);
      
      // Update Firestore user document
      await UsersDB.update(user.uid, { email: newEmail });
      
      // Send verification email for new email
      await this.sendVerificationEmail();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update email',
        code: (error as AuthError)?.code
      };
    }
  }

  // Update user password
  static async updateUserPassword(newPassword: string): Promise<FirebaseResult<void>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          success: false,
          error: 'No user signed in'
        };
      }

      await updatePassword(user, newPassword);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update password',
        code: (error as AuthError)?.code
      };
    }
  }

  // Re-authenticate user (required for sensitive operations)
  static async reauthenticateUser(password: string): Promise<FirebaseResult<void>> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return {
          success: false,
          error: 'No user signed in or email not available'
        };
      }

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to re-authenticate',
        code: (error as AuthError)?.code
      };
    }
  }

  // Delete user account
  static async deleteUserAccount(password: string): Promise<FirebaseResult<void>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          success: false,
          error: 'No user signed in'
        };
      }

      // Re-authenticate before deletion
      const reauthResult = await this.reauthenticateUser(password);
      if (!reauthResult.success) {
        return reauthResult;
      }

      // Delete user document from Firestore
      await UsersDB.delete(user.uid);

      // Delete Firebase user
      await deleteUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete account',
        code: (error as AuthError)?.code
      };
    }
  }

  // Get current user data from Firestore
  static async getCurrentUserData(): Promise<FirebaseResult<User>> {
    try {
      const user = auth.currentUser;
      if (!user) {
        return {
          success: false,
          error: 'No user signed in'
        };
      }

      return await UsersDB.getById(user.uid) as FirebaseResult<User>;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get user data'
      };
    }
  }

  // Auth state observer
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Get current Firebase user
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Check if user email is verified
  static isEmailVerified(): boolean {
    return auth.currentUser?.emailVerified ?? false;
  }

  // Role-based access control helpers
  static async hasRole(role: 'customer' | 'admin' | 'designer'): Promise<boolean> {
    try {
      const userResult = await this.getCurrentUserData();
      if (!userResult.success || !userResult.data) {
        return false;
      }
      return userResult.data.role === role;
    } catch {
      return false;
    }
  }

  static async isAdmin(): Promise<boolean> {
    return this.hasRole('admin');
  }

  static async isDesigner(): Promise<boolean> {
    return this.hasRole('designer');
  }

  static async isDesignProfessional(): Promise<boolean> {
    try {
      const userResult = await this.getCurrentUserData();
      if (!userResult.success || !userResult.data) {
        return false;
      }
      return userResult.data.profile.isDesignProfessional || userResult.data.role === 'designer';
    } catch {
      return false;
    }
  }
}

// Error message mapping for user-friendly messages
export const AUTH_ERROR_MESSAGES = {
  'auth/user-not-found': {
    en: 'No account found with this email address.',
    bg: 'Няма намерен акаунт с този имейл адрес.'
  },
  'auth/wrong-password': {
    en: 'Incorrect password.',
    bg: 'Неправилна парола.'
  },
  'auth/email-already-in-use': {
    en: 'An account with this email already exists.',
    bg: 'Вече съществува акаунт с този имейл.'
  },
  'auth/weak-password': {
    en: 'Password should be at least 6 characters.',
    bg: 'Паролата трябва да бъде поне 6 символа.'
  },
  'auth/invalid-email': {
    en: 'Please enter a valid email address.',
    bg: 'Моля, въведете валиден имейл адрес.'
  },
  'auth/too-many-requests': {
    en: 'Too many failed attempts. Please try again later.',
    bg: 'Прекалено много неуспешни опити. Моля, опитайте отново по-късно.'
  },
  'auth/network-request-failed': {
    en: 'Network error. Please check your connection.',
    bg: 'Мрежова грешка. Моля, проверете връзката си.'
  },
  'auth/requires-recent-login': {
    en: 'This action requires recent authentication. Please sign in again.',
    bg: 'Това действие изисква скорошна автентикация. Моля, влезте отново.'
  }
} as const;

// Get user-friendly error message
export function getAuthErrorMessage(errorCode: string, language: 'en' | 'bg' = 'en'): string {
  const errorKey = errorCode as keyof typeof AUTH_ERROR_MESSAGES;
  return AUTH_ERROR_MESSAGES[errorKey]?.[language] || 
    (language === 'en' ? 'An unexpected error occurred.' : 'Възникна неочаквана грешка.');
}