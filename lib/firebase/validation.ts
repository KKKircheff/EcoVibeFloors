// Validation utilities for Firebase data and forms

import { ErrorHandler, ERROR_CODES } from './errors';
import { 
  User, 
  Product, 
  Order, 
  ConsultationRequest,
  ProductCategory,
  OrderStatus 
} from './types';

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    code: string;
    message: string;
  }>;
}

// Base validator class
export class BaseValidator {
  protected errors: Array<{ field: string; code: string; message: string }> = [];
  protected language: 'en' | 'bg' = 'en';

  constructor(language: 'en' | 'bg' = 'en') {
    this.language = language;
  }

  protected addError(field: string, code: string) {
    this.errors.push({
      field,
      code,
      message: ErrorHandler.getErrorMessage(code, this.language)
    });
  }

  protected clearErrors() {
    this.errors = [];
  }

  getResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors]
    };
  }

  // Common validation helpers
  protected isRequired(value: any, field: string): boolean {
    if (value === null || value === undefined || value === '') {
      this.addError(field, ERROR_CODES.VALIDATION.REQUIRED_FIELD);
      return false;
    }
    return true;
  }

  protected isValidEmail(email: string, field: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.addError(field, ERROR_CODES.VALIDATION.INVALID_EMAIL);
      return false;
    }
    return true;
  }

  protected isValidPhone(phone: string, field: string): boolean {
    // Bulgarian phone number validation (basic)
    const phoneRegex = /^(\+359|0)[0-9]{8,9}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      this.addError(field, ERROR_CODES.VALIDATION.INVALID_PHONE);
      return false;
    }
    return true;
  }

  protected isValidPassword(password: string, field: string): boolean {
    if (password.length < 6) {
      this.addError(field, ERROR_CODES.VALIDATION.PASSWORD_TOO_SHORT);
      return false;
    }
    return true;
  }

  protected isPositiveNumber(value: number, field: string): boolean {
    if (isNaN(value) || value <= 0) {
      this.addError(field, ERROR_CODES.VALIDATION.INVALID_PRICE);
      return false;
    }
    return true;
  }

  protected isValidQuantity(value: number, field: string): boolean {
    if (isNaN(value) || value <= 0 || !Number.isInteger(value)) {
      this.addError(field, ERROR_CODES.VALIDATION.INVALID_QUANTITY);
      return false;
    }
    return true;
  }

  protected isValidDate(date: Date, field: string): boolean {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      this.addError(field, ERROR_CODES.VALIDATION.INVALID_DATE);
      return false;
    }
    return true;
  }

  protected isInEnum<T>(value: T, enumValues: T[], field: string): boolean {
    if (!enumValues.includes(value)) {
      this.addError(field, 'validation/invalid-enum-value');
      return false;
    }
    return true;
  }

  protected isValidUrl(url: string, field: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      this.addError(field, 'validation/invalid-url');
      return false;
    }
  }

  protected isValidFileSize(file: File, maxSizeMB: number, field: string): boolean {
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      this.addError(field, ERROR_CODES.VALIDATION.FILE_TOO_LARGE);
      return false;
    }
    return true;
  }

  protected isValidFileType(file: File, allowedTypes: string[], field: string): boolean {
    if (!allowedTypes.includes(file.type)) {
      this.addError(field, 'validation/invalid-file-type');
      return false;
    }
    return true;
  }
}

// User validation
export class UserValidator extends BaseValidator {
  validateRegistration(data: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): ValidationResult {
    this.clearErrors();

    // Required fields
    this.isRequired(data.email, 'email');
    this.isRequired(data.password, 'password');
    this.isRequired(data.confirmPassword, 'confirmPassword');
    this.isRequired(data.firstName, 'firstName');
    this.isRequired(data.lastName, 'lastName');

    // Email validation
    if (data.email) {
      this.isValidEmail(data.email, 'email');
    }

    // Password validation
    if (data.password) {
      this.isValidPassword(data.password, 'password');
    }

    // Password confirmation
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      this.addError('confirmPassword', ERROR_CODES.VALIDATION.PASSWORDS_NOT_MATCH);
    }

    // Phone validation (optional)
    if (data.phone && data.phone.trim()) {
      this.isValidPhone(data.phone, 'phone');
    }

    return this.getResult();
  }

  validateLogin(data: { email: string; password: string }): ValidationResult {
    this.clearErrors();

    this.isRequired(data.email, 'email');
    this.isRequired(data.password, 'password');

    if (data.email) {
      this.isValidEmail(data.email, 'email');
    }

    return this.getResult();
  }

  validateProfileUpdate(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  }): ValidationResult {
    this.clearErrors();

    if (data.email) {
      this.isValidEmail(data.email, 'email');
    }

    if (data.phone && data.phone.trim()) {
      this.isValidPhone(data.phone, 'phone');
    }

    return this.getResult();
  }
}

// Product validation
export class ProductValidator extends BaseValidator {
  validateProduct(data: Partial<Product>): ValidationResult {
    this.clearErrors();

    // Required fields
    if (!data.name?.en) this.addError('name.en', ERROR_CODES.VALIDATION.REQUIRED_FIELD);
    if (!data.name?.bg) this.addError('name.bg', ERROR_CODES.VALIDATION.REQUIRED_FIELD);
    if (!data.description?.en) this.addError('description.en', ERROR_CODES.VALIDATION.REQUIRED_FIELD);
    if (!data.description?.bg) this.addError('description.bg', ERROR_CODES.VALIDATION.REQUIRED_FIELD);
    
    this.isRequired(data.category, 'category');
    this.isRequired(data.brand, 'brand');
    this.isRequired(data.origin, 'origin');

    // Category validation
    if (data.category) {
      const validCategories: ProductCategory[] = [
        'hardwood', 'engineered-wood', 'luxury-vinyl', 
        'laminate', 'bamboo', 'cork', 'accessories'
      ];
      this.isInEnum(data.category, validCategories, 'category');
    }

    // Origin validation
    if (data.origin) {
      const validOrigins = ['Netherlands', 'Belgium', 'Germany'];
      this.isInEnum(data.origin, validOrigins, 'origin');
    }

    // Pricing validation
    if (data.pricing) {
      if (data.pricing.pricePerSqm?.BGN) {
        this.isPositiveNumber(data.pricing.pricePerSqm.BGN, 'pricing.pricePerSqm.BGN');
      }
      if (data.pricing.pricePerSqm?.EUR) {
        this.isPositiveNumber(data.pricing.pricePerSqm.EUR, 'pricing.pricePerSqm.EUR');
      }
    }

    // Specifications validation
    if (data.specifications) {
      const specs = data.specifications;
      if (specs.dimensions) {
        if (specs.dimensions.length) {
          this.isPositiveNumber(specs.dimensions.length, 'specifications.dimensions.length');
        }
        if (specs.dimensions.width) {
          this.isPositiveNumber(specs.dimensions.width, 'specifications.dimensions.width');
        }
        if (specs.dimensions.thickness) {
          this.isPositiveNumber(specs.dimensions.thickness, 'specifications.dimensions.thickness');
        }
      }
    }

    // Availability validation
    if (data.availability) {
      if (data.availability.quantity !== undefined) {
        this.isValidQuantity(data.availability.quantity, 'availability.quantity');
      }
    }

    // Images validation
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((image, index) => {
        if (!image.url) {
          this.addError(`images.${index}.url`, ERROR_CODES.VALIDATION.REQUIRED_FIELD);
        } else {
          this.isValidUrl(image.url, `images.${index}.url`);
        }
        
        if (!image.alt?.en) {
          this.addError(`images.${index}.alt.en`, ERROR_CODES.VALIDATION.REQUIRED_FIELD);
        }
        if (!image.alt?.bg) {
          this.addError(`images.${index}.alt.bg`, ERROR_CODES.VALIDATION.REQUIRED_FIELD);
        }
      });
    }

    return this.getResult();
  }

  validateProductImage(file: File): ValidationResult {
    this.clearErrors();

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSizeMB = 5; // 5MB max for product images

    this.isValidFileType(file, allowedTypes, 'image');
    this.isValidFileSize(file, maxSizeMB, 'image');

    return this.getResult();
  }
}

// Order validation
export class OrderValidator extends BaseValidator {
  validateOrder(data: Partial<Order>): ValidationResult {
    this.clearErrors();

    // Required fields
    this.isRequired(data.userId, 'userId');
    this.isRequired(data.items, 'items');

    // Items validation
    if (data.items && Array.isArray(data.items)) {
      if (data.items.length === 0) {
        this.addError('items', 'validation/empty-cart');
      }

      data.items.forEach((item, index) => {
        this.isRequired(item.productId, `items.${index}.productId`);
        this.isRequired(item.quantity, `items.${index}.quantity`);
        
        if (item.quantity) {
          this.isValidQuantity(item.quantity, `items.${index}.quantity`);
        }
        
        if (item.unitPrice) {
          this.isPositiveNumber(item.unitPrice, `items.${index}.unitPrice`);
        }
        
        if (item.total) {
          this.isPositiveNumber(item.total, `items.${index}.total`);
        }
      });
    }

    // Shipping address validation
    if (data.shipping?.address) {
      this.validateAddress(data.shipping.address, 'shipping.address');
    }

    // Billing address validation
    if (data.billing?.address) {
      this.validateAddress(data.billing.address, 'billing.address');
    }

    // Status validation
    if (data.status) {
      const validStatuses: OrderStatus[] = [
        'draft', 'pending', 'confirmed', 'processing', 
        'shipping', 'delivered', 'completed', 'cancelled', 'refunded'
      ];
      this.isInEnum(data.status, validStatuses, 'status');
    }

    return this.getResult();
  }

  private validateAddress(address: any, fieldPrefix: string): void {
    this.isRequired(address.street, `${fieldPrefix}.street`);
    this.isRequired(address.city, `${fieldPrefix}.city`);
    this.isRequired(address.postalCode, `${fieldPrefix}.postalCode`);
    this.isRequired(address.country, `${fieldPrefix}.country`);

    // Bulgarian postal code validation
    if (address.postalCode && address.country === 'Bulgaria') {
      const postalCodeRegex = /^[0-9]{4}$/;
      if (!postalCodeRegex.test(address.postalCode)) {
        this.addError(`${fieldPrefix}.postalCode`, 'validation/invalid-postal-code');
      }
    }
  }

  validatePayment(data: {
    method: 'card' | 'bank-transfer' | 'cash-on-delivery';
    amount: number;
    currency: 'BGN' | 'EUR';
  }): ValidationResult {
    this.clearErrors();

    this.isRequired(data.method, 'method');
    this.isRequired(data.amount, 'amount');
    this.isRequired(data.currency, 'currency');

    if (data.amount) {
      this.isPositiveNumber(data.amount, 'amount');
    }

    if (data.method) {
      const validMethods = ['card', 'bank-transfer', 'cash-on-delivery'];
      this.isInEnum(data.method, validMethods, 'method');
    }

    if (data.currency) {
      const validCurrencies = ['BGN', 'EUR'];
      this.isInEnum(data.currency, validCurrencies, 'currency');
    }

    return this.getResult();
  }
}

// Consultation validation
export class ConsultationValidator extends BaseValidator {
  validateConsultationRequest(data: Partial<ConsultationRequest>): ValidationResult {
    this.clearErrors();

    // Required fields
    this.isRequired(data.userId, 'userId');
    this.isRequired(data.type, 'type');

    // Type validation
    if (data.type) {
      const validTypes = ['design', 'technical', 'installation'];
      this.isInEnum(data.type, validTypes, 'type');
    }

    // Project details validation
    if (data.projectDetails) {
      this.isRequired(data.projectDetails.area, 'projectDetails.area');
      this.isRequired(data.projectDetails.roomType, 'projectDetails.roomType');
      this.isRequired(data.projectDetails.description, 'projectDetails.description');

      if (data.projectDetails.area) {
        this.isPositiveNumber(data.projectDetails.area, 'projectDetails.area');
      }

      if (data.projectDetails.roomType && !Array.isArray(data.projectDetails.roomType)) {
        this.addError('projectDetails.roomType', 'validation/invalid-room-type');
      }

      // Budget validation (optional)
      if (data.projectDetails.budget) {
        if (data.projectDetails.budget.min) {
          this.isPositiveNumber(data.projectDetails.budget.min, 'projectDetails.budget.min');
        }
        if (data.projectDetails.budget.max) {
          this.isPositiveNumber(data.projectDetails.budget.max, 'projectDetails.budget.max');
        }
        if (data.projectDetails.budget.min && data.projectDetails.budget.max) {
          if (data.projectDetails.budget.min > data.projectDetails.budget.max) {
            this.addError('projectDetails.budget.max', 'validation/invalid-budget-range');
          }
        }
      }
    }

    // Preferred contact validation
    if (data.preferredContact) {
      this.isRequired(data.preferredContact.method, 'preferredContact.method');
      this.isRequired(data.preferredContact.availability, 'preferredContact.availability');

      if (data.preferredContact.method) {
        const validMethods = ['phone', 'email', 'video-call', 'in-person'];
        this.isInEnum(data.preferredContact.method, validMethods, 'preferredContact.method');
      }
    }

    return this.getResult();
  }

  validateConsultationFile(file: File): ValidationResult {
    this.clearErrors();

    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    const maxSizeMB = 10; // 10MB max for consultation files

    this.isValidFileType(file, allowedTypes, 'file');
    this.isValidFileSize(file, maxSizeMB, 'file');

    return this.getResult();
  }
}

// Contact form validation
export class ContactValidator extends BaseValidator {
  validateContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): ValidationResult {
    this.clearErrors();

    // Required fields
    this.isRequired(data.name, 'name');
    this.isRequired(data.email, 'email');
    this.isRequired(data.subject, 'subject');
    this.isRequired(data.message, 'message');

    // Email validation
    if (data.email) {
      this.isValidEmail(data.email, 'email');
    }

    // Phone validation (optional)
    if (data.phone && data.phone.trim()) {
      this.isValidPhone(data.phone, 'phone');
    }

    // Message length validation
    if (data.message && data.message.length < 10) {
      this.addError('message', 'validation/message-too-short');
    }

    return this.getResult();
  }
}

// Newsletter subscription validation
export class NewsletterValidator extends BaseValidator {
  validateSubscription(data: {
    email: string;
    language?: 'en' | 'bg';
  }): ValidationResult {
    this.clearErrors();

    this.isRequired(data.email, 'email');
    
    if (data.email) {
      this.isValidEmail(data.email, 'email');
    }

    if (data.language) {
      const validLanguages = ['en', 'bg'];
      this.isInEnum(data.language, validLanguages, 'language');
    }

    return this.getResult();
  }
}

// Export validator instances for easy use
export const validators = {
  user: (language: 'en' | 'bg' = 'en') => new UserValidator(language),
  product: (language: 'en' | 'bg' = 'en') => new ProductValidator(language),
  order: (language: 'en' | 'bg' = 'en') => new OrderValidator(language),
  consultation: (language: 'en' | 'bg' = 'en') => new ConsultationValidator(language),
  contact: (language: 'en' | 'bg' = 'en') => new ContactValidator(language),
  newsletter: (language: 'en' | 'bg' = 'en') => new NewsletterValidator(language)
};

// Utility function for quick validation
export function validateData<T>(
  data: T,
  validatorFn: (validator: BaseValidator) => ValidationResult,
  language: 'en' | 'bg' = 'en'
): ValidationResult {
  const validator = new BaseValidator(language);
  return validatorFn(validator);
}

// Form validation helpers
export const formValidation = {
  // Real-time field validation
  validateField: (
    value: any,
    rules: Array<{
      type: 'required' | 'email' | 'phone' | 'password' | 'number' | 'positive' | 'url';
      message?: string;
    }>,
    language: 'en' | 'bg' = 'en'
  ): string | null => {
    const validator = new BaseValidator(language);
    
    for (const rule of rules) {
      switch (rule.type) {
        case 'required':
          if (!validator.isRequired(value, 'field')) return validator.errors[validator.errors.length - 1].message;
          break;
        case 'email':
          if (value && !validator.isValidEmail(value, 'field')) return validator.errors[validator.errors.length - 1].message;
          break;
        case 'phone':
          if (value && !validator.isValidPhone(value, 'field')) return validator.errors[validator.errors.length - 1].message;
          break;
        case 'password':
          if (value && !validator.isValidPassword(value, 'field')) return validator.errors[validator.errors.length - 1].message;
          break;
        case 'number':
          if (value && (isNaN(Number(value)))) {
            validator.addError('field', 'validation/invalid-number');
            return validator.errors[validator.errors.length - 1].message;
          }
          break;
        case 'positive':
          if (value && !validator.isPositiveNumber(Number(value), 'field')) return validator.errors[validator.errors.length - 1].message;
          break;
        case 'url':
          if (value && !validator.isValidUrl(value, 'field')) return validator.errors[validator.errors.length - 1].message;
          break;
      }
    }
    
    return null;
  }
};