// Firebase collections setup and utilities

import { collection, doc, CollectionReference, DocumentReference } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  User, 
  Product, 
  Order, 
  ConsultationRequest,
  COLLECTIONS 
} from './types';

// Type-safe collection references
export const collections = {
  users: collection(db, COLLECTIONS.USERS) as CollectionReference<User>,
  products: collection(db, COLLECTIONS.PRODUCTS) as CollectionReference<Product>,
  orders: collection(db, COLLECTIONS.ORDERS) as CollectionReference<Order>,
  consultations: collection(db, COLLECTIONS.CONSULTATIONS) as CollectionReference<ConsultationRequest>,
  reviews: collection(db, COLLECTIONS.REVIEWS),
  categories: collection(db, COLLECTIONS.CATEGORIES),
  suppliers: collection(db, COLLECTIONS.SUPPLIERS)
} as const;

// Type-safe document reference helpers
export const getDocRef = {
  user: (id: string): DocumentReference<User> => 
    doc(collections.users, id),
  
  product: (id: string): DocumentReference<Product> => 
    doc(collections.products, id),
  
  order: (id: string): DocumentReference<Order> => 
    doc(collections.orders, id),
  
  consultation: (id: string): DocumentReference<ConsultationRequest> => 
    doc(collections.consultations, id),
  
  review: (id: string): DocumentReference => 
    doc(collections.reviews, id),
  
  category: (id: string): DocumentReference => 
    doc(collections.categories, id),
  
  supplier: (id: string): DocumentReference => 
    doc(collections.suppliers, id)
};

// Collection initialization and seeding
export class CollectionManager {
  
  // Initialize collections with security rules and indexes
  static async initializeCollections(): Promise<void> {
    console.log('Collections are automatically created when first document is added');
    
    // In a real application, you might want to create initial data
    // or verify that indexes are properly set up
    await this.createInitialData();
  }

  // Create initial data for development/testing
  private static async createInitialData(): Promise<void> {
    try {
      // Create sample categories
      await this.createSampleCategories();
      
      // Create sample products (optional, for development)
      if (process.env.NODE_ENV === 'development') {
        await this.createSampleProducts();
      }
    } catch (error) {
      console.error('Error creating initial data:', error);
    }
  }

  private static async createSampleCategories(): Promise<void> {
    const categories = [
      {
        id: 'hardwood',
        name: {
          en: 'Hardwood Flooring',
          bg: 'Твърди Дърва'
        },
        description: {
          en: 'Premium solid hardwood flooring from European forests',
          bg: 'Премиум масивни подове от европейски гори'
        },
        image: '/images/categories/hardwood.jpg',
        featured: true,
        order: 1
      },
      {
        id: 'engineered-wood',
        name: {
          en: 'Engineered Wood',
          bg: 'Инженерно Дърво'
        },
        description: {
          en: 'Stable engineered wood flooring for any room',
          bg: 'Стабилни инженерни подове за всяка стая'
        },
        image: '/images/categories/engineered.jpg',
        featured: true,
        order: 2
      },
      {
        id: 'luxury-vinyl',
        name: {
          en: 'Luxury Vinyl',
          bg: 'Луксозен Винил'
        },
        description: {
          en: 'Waterproof luxury vinyl with realistic wood looks',
          bg: 'Водоустойчив луксозен винил с реалистичен дървен вид'
        },
        image: '/images/categories/vinyl.jpg',
        featured: true,
        order: 3
      },
      {
        id: 'laminate',
        name: {
          en: 'Laminate',
          bg: 'Ламинат'
        },
        description: {
          en: 'Durable and affordable laminate flooring',
          bg: 'Издръжливи и достъпни ламинатни подове'
        },
        image: '/images/categories/laminate.jpg',
        featured: false,
        order: 4
      },
      {
        id: 'bamboo',
        name: {
          en: 'Bamboo',
          bg: 'Бамбук'
        },
        description: {
          en: 'Sustainable bamboo flooring solutions',
          bg: 'Устойчиви решения за подове от бамбук'
        },
        image: '/images/categories/bamboo.jpg',
        featured: false,
        order: 5
      }
    ];

    // Note: In a real implementation, you would check if categories already exist
    // before creating them to avoid duplicates
    console.log('Sample categories would be created here');
  }

  private static async createSampleProducts(): Promise<void> {
    const sampleProducts = [
      {
        id: 'dutch-oak-classic',
        name: {
          en: 'Dutch Oak Classic',
          bg: 'Холандски Дъб Класик'
        },
        description: {
          en: 'Premium European oak flooring with natural oil finish',
          bg: 'Премиум европейски дъб с естествено масло'
        },
        category: 'hardwood' as const,
        brand: 'Royal Dutch Floors',
        origin: 'Netherlands' as const,
        specifications: {
          dimensions: {
            length: 1200,
            width: 120,
            thickness: 15,
            unit: 'mm' as const
          },
          surfaceFinish: 'Natural Oil',
          installation: 'click' as const,
          janka: 1360,
          moisture: 8
        },
        pricing: {
          pricePerSqm: {
            BGN: 85.00,
            EUR: 43.50
          },
          currency: 'EUR' as const
        },
        availability: {
          inStock: true,
          quantity: 500,
          unit: 'sqm' as const,
          leadTime: {
            min: 3,
            max: 7,
            unit: 'days' as const
          },
          supplier: 'Dutch Wood Experts'
        },
        images: [],
        certifications: [
          {
            name: 'FSC Certified',
            issuer: 'Forest Stewardship Council'
          },
          {
            name: 'EU Ecolabel',
            issuer: 'European Union'
          }
        ],
        warranty: {
          years: 25,
          terms: {
            en: '25-year warranty on structural integrity',
            bg: '25-годишна гаранция за структурна цялост'
          }
        },
        featured: true,
        status: 'active' as const
      }
    ];

    console.log('Sample products would be created here');
  }

  // Create sample user for testing
  static createSampleUser() {
    return {
      email: 'test@ecovibe.bg',
      displayName: 'Test User',
      role: 'customer' as const,
      preferences: {
        language: 'bg' as const,
        currency: 'BGN' as const
      },
      profile: {
        firstName: 'Test',
        lastName: 'User',
        isDesignProfessional: false
      }
    };
  }
}

// Firestore security rules (to be applied in Firebase Console)
export const FIRESTORE_SECURITY_RULES = `
// Firestore Security Rules for EcoVibeFloors
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        resource.data.role in ['admin', 'designer'];
    }
    
    // Products collection - public read, admin write
    match /products/{productId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders collection - user specific
    match /orders/{orderId} {
      allow read, write: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'designer']
      );
    }
    
    // Consultations collection - user specific
    match /consultations/{consultationId} {
      allow read, write: if request.auth != null && (
        resource.data.userId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'designer']
      );
    }
    
    // Reviews collection - authenticated users can read all, write their own
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // Categories and Suppliers - public read, admin write
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /suppliers/{supplierId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
`;

// Firestore indexes (to be created in Firebase Console)
export const FIRESTORE_INDEXES = [
  {
    collectionGroup: 'products',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'category', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'featured', order: 'DESCENDING' },
      { fieldPath: 'updatedAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionGroup: 'products',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'pricing.pricePerSqm.EUR', order: 'ASCENDING' }
    ]
  },
  {
    collectionGroup: 'orders',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  },
  {
    collectionGroup: 'consultations',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'priority', order: 'DESCENDING' },
      { fieldPath: 'createdAt', order: 'ASCENDING' }
    ]
  },
  {
    collectionGroup: 'consultations',
    queryScope: 'COLLECTION',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' }
    ]
  }
];

// Storage security rules (to be applied in Firebase Console)
export const STORAGE_SECURITY_RULES = `
// Firebase Storage Security Rules for EcoVibeFloors
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Product images - public read, admin write
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User avatars - owner and admin access
    match /users/avatars/{userId}/{allPaths=**} {
      allow read: if true; // Public read for avatars
      allow write: if request.auth != null && (
        request.auth.uid == userId ||
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
    }
    
    // User documents - owner access only
    match /users/documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Consultation files - user and admin access
    match /consultations/{allPaths=**} {
      allow read, write: if request.auth != null && (
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role in ['admin', 'designer'] ||
        // Additional check would be needed to verify consultation ownership
        true // Simplified for now
      );
    }
    
    // Certificates and guides - public read, admin write
    match /certificates/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /guides/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Room inspiration images - public read, admin write
    match /inspiration/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
`;

// Utility functions for collection management
export const collectionUtils = {
  // Check if collection exists and has data
  async checkCollectionHealth(collectionName: string): Promise<{
    exists: boolean;
    documentCount: number;
    lastUpdate?: Date;
  }> {
    try {
      const collectionRef = collection(db, collectionName);
      // This is a simplified check - in production you might want more detailed analytics
      return {
        exists: true,
        documentCount: 0, // Would need to count documents
        lastUpdate: new Date()
      };
    } catch (error) {
      return {
        exists: false,
        documentCount: 0
      };
    }
  },

  // Backup collection data (for development)
  async exportCollection(collectionName: string): Promise<any[]> {
    console.log(`Exporting collection: ${collectionName}`);
    // Implementation would depend on requirements
    return [];
  },

  // Import data to collection (for development)
  async importCollection(collectionName: string, data: any[]): Promise<void> {
    console.log(`Importing ${data.length} documents to collection: ${collectionName}`);
    // Implementation would depend on requirements
  }
};

// Export everything for easy access
export default {
  collections,
  getDocRef,
  CollectionManager,
  collectionUtils,
  FIRESTORE_SECURITY_RULES,
  FIRESTORE_INDEXES,
  STORAGE_SECURITY_RULES
};