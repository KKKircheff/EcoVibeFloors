// Firebase error handling utilities

// Base error interface
export interface AppError {
    code: string;
    message: string;
    type: 'auth' | 'firestore' | 'storage' | 'validation' | 'network' | 'unknown';
    originalError?: any;
}

// Error message translations
export interface ErrorMessages {
    en: string;
    bg: string;
}

// Comprehensive error messages for all Firebase services
const ERROR_MESSAGES: Record<string, ErrorMessages> = {
    // Authentication errors
    'auth/user-not-found': {
        en: 'No account found with this email address.',
        bg: 'Няма намерен акаунт с този имейл адрес.',
    },
    'auth/wrong-password': {
        en: 'Incorrect password.',
        bg: 'Неправилна парола.',
    },
    'auth/email-already-in-use': {
        en: 'An account with this email already exists.',
        bg: 'Вече съществува акаунт с този имейл.',
    },
    'auth/weak-password': {
        en: 'Password should be at least 6 characters.',
        bg: 'Паролата трябва да бъде поне 6 символа.',
    },
    'auth/invalid-email': {
        en: 'Please enter a valid email address.',
        bg: 'Моля, въведете валиден имейл адрес.',
    },
    'auth/too-many-requests': {
        en: 'Too many failed attempts. Please try again later.',
        bg: 'Прекалено много неуспешни опити. Моля, опитайте отново по-късно.',
    },
    'auth/network-request-failed': {
        en: 'Network error. Please check your connection.',
        bg: 'Мрежова грешка. Моля, проверете връзката си.',
    },
    'auth/requires-recent-login': {
        en: 'This action requires recent authentication. Please sign in again.',
        bg: 'Това действие изисква скорошна автентикация. Моля, влезте отново.',
    },
    'auth/user-disabled': {
        en: 'This account has been disabled.',
        bg: 'Този акаунт е деактивиран.',
    },
    'auth/operation-not-allowed': {
        en: 'This sign-in method is not enabled.',
        bg: 'Този метод за вход не е разрешен.',
    },
    'auth/invalid-credential': {
        en: 'The provided credentials are invalid.',
        bg: 'Предоставените данни са невалидни.',
    },
    'auth/credential-already-in-use': {
        en: 'This credential is already associated with another account.',
        bg: 'Тези данни вече са свързани с друг акаунт.',
    },

    // Firestore errors
    'firestore/permission-denied': {
        en: 'You do not have permission to perform this action.',
        bg: 'Нямате разрешение да извършите това действие.',
    },
    'firestore/not-found': {
        en: 'The requested document was not found.',
        bg: 'Заявеният документ не беше намерен.',
    },
    'firestore/already-exists': {
        en: 'The document already exists.',
        bg: 'Документът вече съществува.',
    },
    'firestore/failed-precondition': {
        en: 'The operation failed due to a precondition failure.',
        bg: 'Операцията се провали поради неизпълнено предварително условие.',
    },
    'firestore/aborted': {
        en: 'The operation was aborted due to a conflict.',
        bg: 'Операцията беше прекратена поради конфликт.',
    },
    'firestore/out-of-range': {
        en: 'The provided value is out of range.',
        bg: 'Предоставената стойност е извън диапазона.',
    },
    'firestore/unimplemented': {
        en: 'This feature is not implemented yet.',
        bg: 'Тази функция все още не е внедрена.',
    },
    'firestore/internal': {
        en: 'An internal error occurred. Please try again.',
        bg: 'Възникна вътрешна грешка. Моля, опитайте отново.',
    },
    'firestore/unavailable': {
        en: 'The service is temporarily unavailable. Please try again.',
        bg: 'Услугата е временно недостъпна. Моля, опитайте отново.',
    },
    'firestore/data-loss': {
        en: 'Unrecoverable data loss or corruption.',
        bg: 'Невъзстановима загуба или повреда на данни.',
    },
    'firestore/unauthenticated': {
        en: 'Authentication required to perform this action.',
        bg: 'Необходима е автентикация за извършване на това действие.',
    },
    'firestore/resource-exhausted': {
        en: 'Resource quota exceeded. Please try again later.',
        bg: 'Надвишена квота за ресурси. Моля, опитайте отново по-късно.',
    },
    'firestore/cancelled': {
        en: 'The operation was cancelled.',
        bg: 'Операцията беше отменена.',
    },
    'firestore/invalid-argument': {
        en: 'Invalid argument provided.',
        bg: 'Предоставен е невалиден аргумент.',
    },
    'firestore/deadline-exceeded': {
        en: 'The operation timed out.',
        bg: 'Операцията изтече времето си.',
    },

    // Storage errors
    'storage/unknown': {
        en: 'An unknown error occurred.',
        bg: 'Възникна неизвестна грешка.',
    },
    'storage/object-not-found': {
        en: 'File not found.',
        bg: 'Файлът не е намерен.',
    },
    'storage/bucket-not-found': {
        en: 'Storage bucket not found.',
        bg: 'Хранилището не е намерено.',
    },
    'storage/project-not-found': {
        en: 'Project not found.',
        bg: 'Проектът не е намерен.',
    },
    'storage/quota-exceeded': {
        en: 'Storage quota exceeded.',
        bg: 'Надвишена квота за съхранение.',
    },
    'storage/unauthenticated': {
        en: 'Authentication required for this action.',
        bg: 'Необходима е автентикация за това действие.',
    },
    'storage/unauthorized': {
        en: 'You are not authorized to perform this action.',
        bg: 'Не сте упълномощени да извършите това действие.',
    },
    'storage/retry-limit-exceeded': {
        en: 'Maximum retry limit exceeded.',
        bg: 'Надвишен максимален лимит за повторни опити.',
    },
    'storage/invalid-checksum': {
        en: 'File checksum mismatch.',
        bg: 'Несъответствие в контролната сума на файла.',
    },
    'storage/canceled': {
        en: 'Upload was cancelled.',
        bg: 'Качването беше отменено.',
    },
    'storage/invalid-event-name': {
        en: 'Invalid event name.',
        bg: 'Невалидно име на събитие.',
    },
    'storage/invalid-url': {
        en: 'Invalid file URL.',
        bg: 'Невалиден URL на файл.',
    },
    'storage/invalid-argument': {
        en: 'Invalid argument provided.',
        bg: 'Предоставен е невалиден аргумент.',
    },
    'storage/no-default-bucket': {
        en: 'No default storage bucket configured.',
        bg: 'Няма конфигуриране хранилище по подразбиране.',
    },
    'storage/cannot-slice-blob': {
        en: 'Cannot slice file for upload.',
        bg: 'Не може да се раздели файлът за качване.',
    },

    // Validation errors
    'validation/required-field': {
        en: 'This field is required.',
        bg: 'Това поле е задължително.',
    },
    'validation/invalid-email': {
        en: 'Please enter a valid email address.',
        bg: 'Моля, въведете валиден имейл адрес.',
    },
    'validation/invalid-phone': {
        en: 'Please enter a valid phone number.',
        bg: 'Моля, въведете валиден телефонен номер.',
    },
    'validation/password-too-short': {
        en: 'Password must be at least 6 characters long.',
        bg: 'Паролата трябва да бъде поне 6 символа.',
    },
    'validation/passwords-not-match': {
        en: 'Passwords do not match.',
        bg: 'Паролите не съвпадат.',
    },
    'validation/invalid-quantity': {
        en: 'Please enter a valid quantity.',
        bg: 'Моля, въведете валидно количество.',
    },
    'validation/invalid-price': {
        en: 'Please enter a valid price.',
        bg: 'Моля, въведете валидна цена.',
    },
    'validation/file-too-large': {
        en: 'File size is too large.',
        bg: 'Размерът на файла е твърде голям.',
    },
    'validation/invalid-file-type': {
        en: 'Invalid file type.',
        bg: 'Невалиден тип файл.',
    },
    'validation/invalid-date': {
        en: 'Please enter a valid date.',
        bg: 'Моля, въведете валидна дата.',
    },

    // Network errors
    'network/offline': {
        en: 'You are offline. Please check your connection.',
        bg: 'Няма връзка с интернет. Моля, проверете връзката си.',
    },
    'network/timeout': {
        en: 'Request timed out. Please try again.',
        bg: 'Заявката изтече времето си. Моля, опитайте отново.',
    },
    'network/connection-failed': {
        en: 'Connection failed. Please check your network.',
        bg: 'Връзката се провали. Моля, проверете мрежата си.',
    },

    // Business logic errors
    'business/insufficient-stock': {
        en: 'Insufficient stock available.',
        bg: 'Няма достатъчно наличност.',
    },
    'business/product-discontinued': {
        en: 'This product has been discontinued.',
        bg: 'Този продукт е спрян от производство.',
    },
    'business/order-already-processed': {
        en: 'This order has already been processed.',
        bg: 'Тази поръчка вече е обработена.',
    },
    'business/invalid-shipping-address': {
        en: 'Invalid shipping address.',
        bg: 'Невалиден адрес за доставка.',
    },
    'business/payment-failed': {
        en: 'Payment processing failed.',
        bg: 'Обработката на плащането се провали.',
    },
    'business/consultation-not-available': {
        en: 'Consultation slot is not available.',
        bg: 'Слотът за консултация не е наличен.',
    },

    // Default fallback messages
    'unknown/error': {
        en: 'An unexpected error occurred. Please try again.',
        bg: 'Възникна неочаквана грешка. Моля, опитайте отново.',
    },
};

export class ErrorHandler {
    // Convert Firebase errors to AppError
    static handleFirebaseError(error: any): AppError {
        let errorType: AppError['type'] = 'unknown';
        let errorCode = 'unknown/error';

        if (error?.code) {
            errorCode = error.code;

            // Determine error type based on code prefix
            if (errorCode.startsWith('auth/')) {
                errorType = 'auth';
            } else if (errorCode.startsWith('firestore/')) {
                errorType = 'firestore';
            } else if (errorCode.startsWith('storage/')) {
                errorType = 'storage';
            } else if (errorCode.startsWith('validation/')) {
                errorType = 'validation';
            } else if (errorCode.startsWith('network/')) {
                errorType = 'network';
            }
        }

        return {
            code: errorCode,
            message: error?.message || 'Unknown error',
            type: errorType,
            originalError: error,
        };
    }

    // Get user-friendly error message
    static getErrorMessage(errorCode: string, language: 'en' | 'bg' = 'en'): string {
        const messages = ERROR_MESSAGES[errorCode];
        if (messages) {
            return messages[language];
        }

        // Fallback to generic message based on error type
        const errorType = errorCode.split('/')[0];
        switch (errorType) {
            case 'auth':
                return language === 'en' ? 'Authentication error occurred.' : 'Възникна грешка при автентикацията.';
            case 'firestore':
                return language === 'en' ? 'Database operation failed.' : 'Операцията с базата данни се провали.';
            case 'storage':
                return language === 'en' ? 'File operation failed.' : 'Операцията с файла се провали.';
            case 'validation':
                return language === 'en' ? 'Please check your input.' : 'Моля, проверете въведените данни.';
            case 'network':
                return language === 'en' ? 'Network error occurred.' : 'Възникна мрежова грешка.';
            default:
                return ERROR_MESSAGES['unknown/error'][language];
        }
    }

    // Log error for debugging
    static logError(error: AppError, context?: string): void {
        const logData = {
            code: error.code,
            message: error.message,
            type: error.type,
            context,
            timestamp: new Date().toISOString(),
            originalError: error.originalError,
        };

        if (process.env.NODE_ENV === 'development') {
            console.error('Firebase Error:', logData);
        }

        // In production, you might want to send this to a logging service
        // like Sentry, LogRocket, etc.
    }

    // Check if error is retryable
    static isRetryable(errorCode: string): boolean {
        const retryableErrors = [
            'auth/network-request-failed',
            'firestore/unavailable',
            'firestore/internal',
            'firestore/deadline-exceeded',
            'storage/retry-limit-exceeded',
            'network/timeout',
            'network/connection-failed',
        ];

        return retryableErrors.includes(errorCode);
    }

    // Check if error requires authentication
    static requiresAuth(errorCode: string): boolean {
        const authRequiredErrors = [
            'auth/requires-recent-login',
            'firestore/unauthenticated',
            'storage/unauthenticated',
        ];

        return authRequiredErrors.includes(errorCode);
    }

    // Check if error is due to permissions
    static isPermissionError(errorCode: string): boolean {
        const permissionErrors = ['firestore/permission-denied', 'storage/unauthorized'];

        return permissionErrors.includes(errorCode);
    }

    // Create validation error
    static createValidationError(field: string, type: string): AppError {
        return {
            code: `validation/${type}`,
            message: `Validation failed for field: ${field}`,
            type: 'validation',
        };
    }

    // Create business logic error
    static createBusinessError(code: string, message?: string): AppError {
        return {
            code: `business/${code}`,
            message: message || `Business logic error: ${code}`,
            type: 'unknown',
        };
    }

    // Handle async operations with error catching
    static async handleAsync<T>(operation: () => Promise<T>, context?: string): Promise<{data?: T; error?: AppError}> {
        try {
            const data = await operation();
            return {data};
        } catch (error) {
            const appError = this.handleFirebaseError(error);
            this.logError(appError, context);
            return {error: appError};
        }
    }

    // Retry failed operations
    static async retry<T>(
        operation: () => Promise<T>,
        maxAttempts: number = 3,
        delayMs: number = 1000,
        context?: string
    ): Promise<{data?: T; error?: AppError}> {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            const result = await this.handleAsync(operation, context);

            if (result.data || !result.error) {
                return result;
            }

            // Don't retry if error is not retryable or on last attempt
            if (!this.isRetryable(result.error.code) || attempt === maxAttempts) {
                return result;
            }

            // Wait before next attempt
            await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
        }

        return {error: this.createBusinessError('max-retries-exceeded')};
    }
}

// Utility function for error handling in components
export function useErrorHandler(language: 'en' | 'bg' = 'en') {
    return {
        handleError: (error: any, context?: string) => {
            const appError = ErrorHandler.handleFirebaseError(error);
            ErrorHandler.logError(appError, context);
            return ErrorHandler.getErrorMessage(appError.code, language);
        },

        getErrorMessage: (code: string) => {
            return ErrorHandler.getErrorMessage(code, language);
        },

        isRetryable: ErrorHandler.isRetryable,
        requiresAuth: ErrorHandler.requiresAuth,
        isPermissionError: ErrorHandler.isPermissionError,
    };
}

// Export error codes for reference
export const ERROR_CODES = {
    AUTH: {
        USER_NOT_FOUND: 'auth/user-not-found',
        WRONG_PASSWORD: 'auth/wrong-password',
        EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
        WEAK_PASSWORD: 'auth/weak-password',
        INVALID_EMAIL: 'auth/invalid-email',
        TOO_MANY_REQUESTS: 'auth/too-many-requests',
        REQUIRES_RECENT_LOGIN: 'auth/requires-recent-login',
    },
    FIRESTORE: {
        PERMISSION_DENIED: 'firestore/permission-denied',
        NOT_FOUND: 'firestore/not-found',
        UNAVAILABLE: 'firestore/unavailable',
        UNAUTHENTICATED: 'firestore/unauthenticated',
    },
    STORAGE: {
        OBJECT_NOT_FOUND: 'storage/object-not-found',
        UNAUTHORIZED: 'storage/unauthorized',
        QUOTA_EXCEEDED: 'storage/quota-exceeded',
        CANCELED: 'storage/canceled',
    },
    VALIDATION: {
        REQUIRED_FIELD: 'validation/required-field',
        INVALID_EMAIL: 'validation/invalid-email',
        INVALID_PHONE: 'validation/invalid-phone',
        PASSWORD_TOO_SHORT: 'validation/password-too-short',
        FILE_TOO_LARGE: 'validation/file-too-large',
    },
    BUSINESS: {
        INSUFFICIENT_STOCK: 'business/insufficient-stock',
        PRODUCT_DISCONTINUED: 'business/product-discontinued',
        ORDER_ALREADY_PROCESSED: 'business/order-already-processed',
        PAYMENT_FAILED: 'business/payment-failed',
    },
} as const;
