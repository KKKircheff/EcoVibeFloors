# Firebase Utilities for EcoVibeFloors

This directory contains comprehensive Firebase utilities for the EcoVibeFloors luxury flooring platform.

## 📁 File Structure

```
lib/firebase/
├── index.ts          # Main export file - import everything from here
├── types.ts          # TypeScript types and interfaces
├── db.ts             # Firestore database utilities
├── auth.ts           # Firebase Authentication utilities
├── storage.ts        # Firebase Storage utilities
├── errors.ts         # Error handling utilities
├── validation.ts     # Data validation utilities
├── collections.ts    # Collection setup and management
└── README.md         # This file
```

## 🚀 Quick Start

### Basic Import
```typescript
import { firebase } from '@/lib/firebase';

// Or import specific utilities
import { FirebaseDB, AuthService, StorageService } from '@/lib/firebase';
```

### Database Operations
```typescript
import { ProductsDB, firebase } from '@/lib/firebase';

// Create a product
const result = await ProductsDB.create(productData);

// Get all products
const products = await ProductsDB.getAll();

// Get featured products
const featured = await ProductsDB.getFeatured();

// Generic database operations
const user = await firebase.db.getById('users', userId);
```

### Authentication
```typescript
import { firebase } from '@/lib/firebase';

// Sign up
const result = await firebase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});

// Sign in
const signInResult = await firebase.auth.signIn('user@example.com', 'password123');

// Get current user data
const userData = await firebase.auth.getCurrentUserData();
```

### Storage Operations
```typescript
import { firebase, ProductStorage } from '@/lib/firebase';

// Upload product image with automatic resizing
const result = await ProductStorage.uploadImage(productId, imageFile);

// Generic file upload
const uploadResult = await firebase.storage.uploadFile('path/to/file', file, {
  onProgress: (progress) => console.log(`${progress.percentage}% uploaded`),
  onComplete: (url) => console.log('Upload complete:', url)
});
```

### Validation
```typescript
import { validators } from '@/lib/firebase';

// Validate user registration
const validator = validators.user('en');
const result = validator.validateRegistration({
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'password123',
  firstName: 'John',
  lastName: 'Doe'
});

if (!result.isValid) {
  console.log('Validation errors:', result.errors);
}
```

### Error Handling
```typescript
import { firebase, useErrorHandler } from '@/lib/firebase';

// In a React component
const errorHandler = useErrorHandler('en'); // or 'bg'

try {
  const result = await firebase.db.create('products', productData);
} catch (error) {
  const message = errorHandler.handleError(error, 'Creating product');
  console.error(message);
}

// With automatic retry
const result = await firebase.errors.retry(
  () => firebase.db.getById('products', productId),
  3, // max attempts
  1000, // delay in ms
  'Getting product'
);
```

## 🔧 Configuration

### Environment Variables
Ensure these environment variables are set in your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Firebase Console Setup

1. **Firestore Security Rules**: Copy rules from `FIRESTORE_SECURITY_RULES` in `collections.ts`
2. **Storage Security Rules**: Copy rules from `STORAGE_SECURITY_RULES` in `collections.ts`
3. **Firestore Indexes**: Create indexes from `FIRESTORE_INDEXES` in `collections.ts`

## 📚 Available Utilities

### Database (db.ts)
- Generic CRUD operations
- Pagination support
- Real-time subscriptions
- Batch operations
- Transactions
- Collection-specific helpers

### Authentication (auth.ts)
- Email/password authentication
- Google Sign-In
- User profile management
- Role-based access control
- Error handling with bilingual messages

### Storage (storage.ts)
- File upload with progress tracking
- Image resizing and optimization
- Multiple file uploads
- File validation
- Predefined storage paths

### Error Handling (errors.ts)
- Firebase error translation
- Bilingual error messages (EN/BG)
- Error logging and analytics
- Retry mechanisms
- Error categorization

### Validation (validation.ts)
- Form validation for all data types
- Real-time field validation
- File validation
- Business rule validation
- Bilingual error messages

### Collections (collections.ts)
- Type-safe collection references
- Security rules templates
- Index configuration
- Sample data creation

## 🌐 Internationalization

All utilities support both English and Bulgarian:

```typescript
import { validators, useErrorHandler } from '@/lib/firebase';

// Bulgarian validation
const validator = validators.user('bg');
const errorHandler = useErrorHandler('bg');
```

## 🎯 Business-Specific Features

### Product Management
```typescript
import { ProductsDB, ProductValidator, ProductStorage } from '@/lib/firebase';

// Complete product workflow
const validator = new ProductValidator('en');
const validation = validator.validateProduct(productData);

if (validation.isValid) {
  const product = await ProductsDB.create(productData);
  const imageUrl = await ProductStorage.uploadImage(product.data!.id, imageFile);
}
```

### Order Processing
```typescript
import { OrdersDB, OrderValidator } from '@/lib/firebase';

const validator = new OrderValidator('bg');
const validation = validator.validateOrder(orderData);

if (validation.isValid) {
  const order = await OrdersDB.create(orderData);
}
```

### User Management
```typescript
import { firebase } from '@/lib/firebase';

// Check user permissions
const isAdmin = await firebase.auth.isAdmin();
const isDesignProfessional = await firebase.auth.isDesignProfessional();
```

## 🔒 Security Features

- Type-safe operations
- Input validation
- Error handling
- Permission checks
- File upload restrictions
- Bilingual error messages

## 📊 Performance Features

- Pagination support
- Image optimization
- Batch operations
- Real-time subscriptions
- Retry mechanisms
- Caching support

## 🛠️ Development Tips

1. **Always validate data** before database operations
2. **Use type-safe collections** for better development experience
3. **Handle errors gracefully** with user-friendly messages
4. **Implement proper loading states** for async operations
5. **Use real-time subscriptions** for dynamic data
6. **Optimize images** before upload to save storage costs
7. **Test with both languages** (EN/BG) for complete coverage

## 📝 Examples

See the individual utility files for comprehensive examples and documentation.

## 🔍 Troubleshooting

1. **Firebase connection issues**: Check environment variables
2. **Permission errors**: Verify Firestore security rules
3. **Validation errors**: Check validation results and error messages
4. **Upload failures**: Verify file types and sizes
5. **Authentication issues**: Check user state and permissions

For more detailed examples and advanced usage, refer to the individual utility files.