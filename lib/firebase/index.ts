// Firebase utilities main export file

// Core Firebase configuration
export { db, auth, storage } from '../firebase';

// Type definitions
export * from './types';

// Database utilities
export {
  FirebaseDB,
  ProductsDB,
  UsersDB,
  OrdersDB,
  ConsultationsDB
} from './db';

// Authentication utilities
export {
  signUp,
  signIn,
  signInWithGoogle,
  signInWithGooglePopup,
  signInWithGoogleRedirect,
  handleRedirectResult,
  signOutUser,
  sendPasswordResetEmailToUser,
  sendVerificationEmail,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  reauthenticateUser,
  deleteUserAccount,
  getCurrentUserData,
  onAuthStateChangedListener,
  getCurrentUser,
  isAuthenticated,
  isEmailVerified,
  hasRole,
  isAdmin,
  isDesigner,
  isDesignProfessional,
  getAuthErrorTranslationKey
} from './auth';
export type {
  AuthResult,
  SignUpData,
  UpdateProfileData
} from './auth';

// Storage utilities
export {
  StorageService,
  ProductStorage,
  UserStorage,
  ConsultationStorage,
  STORAGE_PATHS,
  FILE_TYPES
} from './storage';
export type {
  UploadProgress,
  FileUploadOptions,
  ImageResizeOptions
} from './storage';

// Error handling utilities
export {
  ErrorHandler,
  useErrorHandler,
  ERROR_CODES
} from './errors';
export type {
  AppError,
  ErrorMessages
} from './errors';

// Validation utilities
export {
  validators,
  formValidation,
  validateData
} from './validation';
export type {
  ValidationResult
} from './validation';
export {
  UserValidator,
  ProductValidator,
  OrderValidator,
  ConsultationValidator,
  ContactValidator,
  NewsletterValidator
} from './validation';

// Collections setup
export {
  collections,
  getDocRef,
  CollectionManager,
  collectionUtils,
  FIRESTORE_SECURITY_RULES,
  FIRESTORE_INDEXES,
  STORAGE_SECURITY_RULES
} from './collections';

