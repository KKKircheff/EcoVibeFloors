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
  AuthService,
  AUTH_ERROR_MESSAGES,
  getAuthErrorMessage
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

// Import services for convenience object
import { FirebaseDB } from './db';
import { AuthService } from './auth';
import { StorageService } from './storage';
import { ErrorHandler } from './errors';
import { collections } from './collections';

// Convenience exports for common operations
export const firebase = {
  // Database operations
  db: {
    create: FirebaseDB.create,
    getById: FirebaseDB.getById,
    getAll: FirebaseDB.getAll,
    getPaginated: FirebaseDB.getPaginated,
    update: FirebaseDB.update,
    delete: FirebaseDB.delete,
    batchWrite: FirebaseDB.batchWrite,
    runTransaction: FirebaseDB.runTransaction,
    subscribeToDocument: FirebaseDB.subscribeToDocument,
    subscribeToCollection: FirebaseDB.subscribeToCollection
  },
  
  // Authentication operations
  auth: {
    signUp: AuthService.signUp,
    signIn: AuthService.signIn,
    signInWithGoogle: AuthService.signInWithGoogle,
    signOut: AuthService.signOut,
    sendPasswordResetEmail: AuthService.sendPasswordResetEmail,
    sendVerificationEmail: AuthService.sendVerificationEmail,
    updateUserProfile: AuthService.updateUserProfile,
    updateUserEmail: AuthService.updateUserEmail,
    updateUserPassword: AuthService.updateUserPassword,
    deleteUserAccount: AuthService.deleteUserAccount,
    getCurrentUserData: AuthService.getCurrentUserData,
    onAuthStateChanged: AuthService.onAuthStateChanged,
    getCurrentUser: AuthService.getCurrentUser,
    isAuthenticated: AuthService.isAuthenticated,
    isEmailVerified: AuthService.isEmailVerified,
    hasRole: AuthService.hasRole,
    isAdmin: AuthService.isAdmin,
    isDesigner: AuthService.isDesigner,
    isDesignProfessional: AuthService.isDesignProfessional
  },
  
  // Storage operations
  storage: {
    uploadFile: StorageService.uploadFile,
    uploadFileSimple: StorageService.uploadFileSimple,
    uploadMultipleFiles: StorageService.uploadMultipleFiles,
    uploadImage: StorageService.uploadImage,
    getDownloadURL: StorageService.getDownloadURL,
    deleteFile: StorageService.deleteFile,
    deleteMultipleFiles: StorageService.deleteMultipleFiles,
    listFiles: StorageService.listFiles,
    getFileMetadata: StorageService.getFileMetadata,
    updateFileMetadata: StorageService.updateFileMetadata,
    resizeImage: StorageService.resizeImage,
    generatePath: StorageService.generatePath,
    formatFileSize: StorageService.formatFileSize,
    validateFileType: StorageService.validateFileType,
    validateFileSize: StorageService.validateFileSize
  },
  
  // Error handling
  errors: {
    handle: ErrorHandler.handleFirebaseError,
    getMessage: ErrorHandler.getErrorMessage,
    log: ErrorHandler.logError,
    isRetryable: ErrorHandler.isRetryable,
    requiresAuth: ErrorHandler.requiresAuth,
    isPermissionError: ErrorHandler.isPermissionError,
    retry: ErrorHandler.retry,
    handleAsync: ErrorHandler.handleAsync
  },
  
  // Collections
  collections: {
    users: collections.users,
    products: collections.products,
    orders: collections.orders,
    consultations: collections.consultations,
    reviews: collections.reviews,
    categories: collections.categories,
    suppliers: collections.suppliers
  }
};


// Export default for easy importing
export default firebase;