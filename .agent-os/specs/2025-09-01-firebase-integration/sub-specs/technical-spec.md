# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-01-firebase-integration/spec.md

> Created: 2025-09-01
> Version: 1.0.0

## Technical Requirements

### Firebase Project Setup and Configuration

**Project Configuration:**
- Create Firebase project with billing enabled for production features
- Enable required services: Firestore, Authentication, Storage, Hosting
- Configure project for web platform with TypeScript support
- Set up development and production environments

**Firebase SDK Integration:**
- Firebase SDK v12.2.1 (already installed)
- Initialize Firebase app in `lib/firebase.ts` with proper configuration
- Configure Firebase for Next.js 15 App Router architecture
- Implement proper error handling and connection management

### Next.js 15 Integration with Firebase SDK

**App Router Compatibility:**
- Configure Firebase for server-side rendering (SSR) and static generation
- Implement proper Firebase initialization for both client and server components
- Handle hydration properly to avoid client/server mismatch
- Use dynamic imports for client-only Firebase features where necessary

**Component Integration:**
- Create custom hooks for Firebase operations (`useAuth`, `useFirestore`, `useStorage`)
- Implement proper loading states and error boundaries
- Configure Firebase with React 19 concurrent features
- Ensure compatibility with Turbopack bundling

### Environment Variable Setup

**Client-Side Variables (NEXT_PUBLIC_):**
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

**Server-Side Variables:**
```
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_DATABASE_URL=
```

**Security Configuration:**
- Separate environment files for development and production
- Implement proper secret management for server-side credentials
- Configure Firebase Admin SDK for server-side operations

### TypeScript Types and Interfaces

**Core Data Models:**
```typescript
interface FlooringProduct {
  id: string;
  name: { en: string; bg: string };
  description: { en: string; bg: string };
  category: FlooringCategory;
  specifications: ProductSpecs;
  pricing: PricingInfo;
  availability: AvailabilityInfo;
  images: string[];
  certifications: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface User {
  uid: string;
  email: string;
  profile: UserProfile;
  preferences: UserPreferences;
  orders: string[];
  createdAt: Timestamp;
}

interface Order {
  id: string;
  userId: string;
  products: OrderItem[];
  status: OrderStatus;
  billingInfo: BillingInfo;
  shippingInfo: ShippingInfo;
  createdAt: Timestamp;
}
```

**Firebase Service Types:**
- Firestore document and collection types
- Authentication user and session types
- Storage file and metadata types
- Real-time listener and subscription types

### Firestore Security Rules Setup

**Product Collection Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - read access for all, write for admin only
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Users - owner access only
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders - owner and admin access
    match /orders/{orderId} {
      allow read, write: if isOwnerOrAdmin(resource.data.userId);
    }
  }
}
```

**Security Functions:**
- Admin role validation
- User ownership verification  
- Data validation rules
- Rate limiting and quota management

### Authentication Configuration

**Authentication Providers:**
- Email/password authentication (primary)
- Google OAuth for convenience
- Optional: Facebook OAuth for social integration
- Guest checkout without registration

**User Management:**
- Custom user profiles in Firestore
- Role-based access control (customer, admin, super-admin)
- Email verification workflow
- Password reset functionality
- Account deletion and GDPR compliance

**Session Management:**
- Configure session persistence
- Implement automatic token refresh
- Handle authentication state changes
- Secure cookie configuration for SSR

### Storage Bucket Configuration

**Bucket Structure:**
```
/products/
  /{productId}/
    /main/{imageId}.webp
    /thumbnails/{imageId}_thumb.webp
    /gallery/{imageId}.webp
/uploads/
  /users/{userId}/{fileId}
/temp/
  /{sessionId}/{fileId}
```

**Security Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Product images - public read
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // User uploads - authenticated users only
    match /uploads/users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Image Optimization:**
- Automatic WebP conversion for better performance
- Multiple size variants (thumbnail, medium, full)
- CDN integration for global delivery
- Lazy loading implementation

### Hosting Deployment Setup

**Firebase Hosting Configuration:**
```json
{
  "hosting": {
    "public": "out",
    "cleanUrls": true,
    "trailingSlash": false,
    "rewrites": [
      {
        "source": "/en/**",
        "destination": "/en/index.html"
      },
      {
        "source": "/bg/**", 
        "destination": "/bg/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(webp|jpg|jpeg|png|gif|ico|svg)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

**Deployment Strategy:**
- Automated deployment from main branch
- Preview channels for feature branches
- Production deployment with approval workflow
- Rollback capability for critical issues

### Bilingual Support Integration

**Firestore Document Structure:**
```javascript
// Products with bilingual content
{
  name: { en: "Oak Flooring", bg: "Дъбов Паркет" },
  description: { 
    en: "Premium Dutch oak flooring...", 
    bg: "Премиум холандски дъбов паркет..." 
  },
  specifications: {
    thickness: { en: "15mm", bg: "15мм" },
    finish: { en: "Natural Oil", bg: "Натурално Олио" }
  }
}
```

**Query Optimization:**
- Index on language-specific fields where needed
- Efficient filtering for Bulgarian market requirements
- Search functionality for both languages
- Consistent translation key management

### Performance and Security Considerations

**Performance Optimizations:**
- Implement Firebase caching strategies
- Use Firestore offline persistence
- Optimize bundle size with tree-shaking
- Implement proper pagination for large datasets
- Connection pooling for server-side operations

**Security Measures:**
- Enable App Check for anti-abuse protection
- Implement rate limiting on sensitive operations
- Use Firebase Security Rules testing suite
- Regular security audits and updates
- GDPR compliance for European users

**Monitoring and Analytics:**
- Firebase Performance Monitoring
- Error tracking with Firebase Crashlytics
- Custom analytics for business metrics
- Real-time monitoring dashboards
- Automated alerts for critical issues

**Data Backup and Recovery:**
- Automated daily Firestore exports
- Point-in-time recovery capability
- Cross-region replication for disaster recovery
- Data retention policies compliance

## Firebase SDK Packages Configuration

**Required Packages (Already Installed):**
- `firebase@12.2.1` - Core Firebase SDK
- Firebase services to initialize:
  - `firebase/firestore` - Database operations
  - `firebase/auth` - User authentication
  - `firebase/storage` - File storage
  - `firebase/analytics` - User analytics
  - `firebase/performance` - Performance monitoring

**Additional Configuration Needed:**
- Firebase Admin SDK for server-side operations
- Firebase Functions SDK if cloud functions are required
- Firebase Hosting CLI for deployment automation
- Firebase Emulator Suite for local development testing