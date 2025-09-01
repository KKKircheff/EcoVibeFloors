# Firebase Database Usage Instructions

This document provides comprehensive examples for using the Firebase database utilities in the EcoVibeFloors project.

## Overview

The project uses a custom Firebase database wrapper that provides:
- Type safety with TypeScript interfaces
- Consistent error handling with `FirebaseResult` wrapper
- Automatic timestamps (createdAt/updatedAt)
- Collection-specific helpers for common operations
- Real-time subscriptions for live data
- Pagination support for large datasets
- Batch operations for multiple changes
- Transaction support for atomic operations

## Basic Usage

### 1. Import the utilities

```typescript
import { FirebaseDB, ProductsDB, UsersDB, OrdersDB, ConsultationsDB } from '@/lib/firebase/db';
import { Product, User, Order, ConsultationRequest } from '@/lib/firebase/types';
```

### 2. Using Collection-Specific Helpers (Recommended)

#### Products

```typescript
// Get all products
const result = await ProductsDB.getAll();
if (result.success) {
  console.log(result.data); // Product[]
}

// Get featured products
const featuredProducts = await ProductsDB.getFeatured();

// Get products by category
const hardwoodProducts = await ProductsDB.getByCategory('hardwood');

// Get specific product
const product = await ProductsDB.getById('product-id');

// Create new product
const newProduct = await ProductsDB.create({
  name: { en: 'Premium Oak Floor', bg: 'Премиум дъбов паркет' },
  description: { en: 'High-quality oak flooring', bg: 'Висококачествен дъбов паркет' },
  category: 'hardwood',
  brand: 'Dutch Premium',
  origin: 'Netherlands',
  specifications: {
    dimensions: { length: 1200, width: 180, thickness: 14, unit: 'mm' },
    surfaceFinish: 'Natural Oil',
    installation: 'click',
    janka: 1320
  },
  pricing: {
    pricePerSqm: { BGN: 85, EUR: 43.5 },
    currency: 'BGN'
  },
  availability: {
    inStock: true,
    quantity: 500,
    unit: 'sqm',
    leadTime: { min: 3, max: 7, unit: 'days' },
    supplier: 'Dutch Premium Supplier'
  },
  images: [],
  certifications: [],
  warranty: {
    years: 25,
    terms: { en: 'Full warranty', bg: 'Пълна гаранция' }
  },
  featured: false,
  status: 'active'
});

// Update product
const updateResult = await ProductsDB.update('product-id', {
  featured: true,
  status: 'active'
});

// Delete product
const deleteResult = await ProductsDB.delete('product-id');
```

#### Users

```typescript
// Create user with custom ID (useful for auth integration)
const newUser = await UsersDB.createWithId('user-auth-id', {
  email: 'user@example.com',
  displayName: 'John Doe',
  role: 'customer',
  preferences: { language: 'en', currency: 'BGN' },
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    isDesignProfessional: false
  }
});

// Get user by ID
const user = await UsersDB.getById('user-id');

// Update user
const updateResult = await UsersDB.update('user-id', {
  'profile.phone': '+359123456789',
  'preferences.language': 'bg'
});

// Get all users (admin function)
const allUsers = await UsersDB.getAll({
  orderBy: { field: 'createdAt', direction: 'desc' },
  limit: 50
});
```

#### Orders

```typescript
// Get user's orders
const userOrders = await OrdersDB.getByUser('user-id');

// Get orders by status
const pendingOrders = await OrdersDB.getByStatus('pending');

// Create new order
const newOrder = await OrdersDB.create({
  orderNumber: 'ORD-2025-001',
  userId: 'user-id',
  status: 'pending',
  items: [
    {
      productId: 'product-id',
      productName: { en: 'Premium Oak Floor', bg: 'Премиум дъбов паркет' },
      quantity: 25.5,
      unit: 'sqm',
      unitPrice: 85,
      total: 2167.5
    }
  ],
  totals: {
    subtotal: 2167.5,
    shipping: 50,
    tax: 433.5,
    discount: 0,
    total: 2651,
    currency: 'BGN'
  },
  shipping: {
    method: 'standard',
    address: {
      street: '123 Main St',
      city: 'Sofia',
      postalCode: '1000',
      country: 'Bulgaria'
    },
    estimatedDelivery: {
      min: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      max: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))
    }
  },
  billing: {
    address: {
      street: '123 Main St',
      city: 'Sofia',
      postalCode: '1000',
      country: 'Bulgaria'
    }
  },
  payment: {
    method: 'card',
    status: 'pending'
  }
});

// Update order status
const statusUpdate = await OrdersDB.update('order-id', {
  status: 'confirmed',
  'payment.status': 'completed',
  'payment.paidAt': Timestamp.now(),
  'payment.transactionId': 'txn_123456789'
});
```

#### Consultations

```typescript
// Get pending consultations
const pendingConsultations = await ConsultationsDB.getPending();

// Get user's consultations
const userConsultations = await ConsultationsDB.getByUser('user-id');

// Create consultation request
const newConsultation = await ConsultationsDB.create({
  userId: 'user-id',
  type: 'design',
  status: 'requested',
  priority: 'medium',
  projectDetails: {
    area: 45.5,
    roomType: ['living-room', 'bedroom'],
    budget: { min: 3000, max: 5000, currency: 'BGN' },
    timeline: '2 months',
    description: 'Looking for premium hardwood flooring for apartment renovation'
  },
  preferredContact: {
    method: 'phone',
    availability: 'Weekdays 9-17'
  }
});

// Assign consultant and schedule
const scheduleUpdate = await ConsultationsDB.update('consultation-id', {
  status: 'scheduled',
  assignedConsultant: 'consultant-id',
  scheduledDate: Timestamp.fromDate(new Date('2025-01-15T10:00:00')),
  notes: 'Initial design consultation scheduled'
});
```

### 3. Using Generic FirebaseDB Class

For more complex queries or custom collections:

```typescript
// Custom queries with options
const recentProducts = await FirebaseDB.getAll<Product>('products', {
  where: [
    { field: 'status', operator: '==', value: 'active' },
    { field: 'featured', operator: '==', value: true }
  ],
  orderBy: { field: 'createdAt', direction: 'desc' },
  limit: 10
});

// Complex filtering
const premiumProducts = await FirebaseDB.getAll<Product>('products', {
  where: [
    { field: 'status', operator: '==', value: 'active' },
    { field: 'category', operator: 'in', value: ['hardwood', 'engineered-wood'] },
    { field: 'pricing.pricePerSqm.BGN', operator: '>', value: 80 }
  ],
  orderBy: { field: 'pricing.pricePerSqm.BGN', direction: 'desc' }
});

// Pagination
const paginatedResult = await FirebaseDB.getPaginated<Product>(
  'products', 
  10, // page size
  lastDocument, // from previous page
  {
    where: [{ field: 'category', operator: '==', value: 'hardwood' }],
    orderBy: { field: 'updatedAt', direction: 'desc' }
  }
);

if (paginatedResult.success) {
  const { items, hasMore, lastDoc } = paginatedResult.data;
  console.log('Products:', items);
  console.log('Has more pages:', hasMore);
  // Use lastDoc for next page
}
```

### 4. Real-time Subscriptions

For live updates in components:

```typescript
import { useEffect, useState } from 'react';

function ProductDetails({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Subscribe to document changes
    const unsubscribe = FirebaseDB.subscribeToDocument<Product>(
      'products',
      productId,
      (updatedProduct, error) => {
        if (error) {
          setError(error);
        } else if (updatedProduct) {
          setProduct(updatedProduct);
          setError('');
        } else {
          setProduct(null);
          setError('Product not found');
        }
      }
    );

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [productId]);

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.name.en}</h1>
      <p>Status: {product.status}</p>
      <p>Price: {product.pricing.pricePerSqm.BGN} BGN/m²</p>
    </div>
  );
}

function OrdersList({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Subscribe to collection changes
    const unsubscribe = FirebaseDB.subscribeToCollection<Order>(
      'orders',
      (updatedOrders, error) => {
        if (error) {
          console.error('Orders subscription error:', error);
        } else {
          setOrders(updatedOrders);
        }
      },
      {
        where: [{ field: 'userId', operator: '==', value: userId }],
        orderBy: { field: 'createdAt', direction: 'desc' }
      }
    );

    return unsubscribe;
  }, [userId]);

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.map(order => (
        <div key={order.id}>
          <p>Order: {order.orderNumber}</p>
          <p>Status: {order.status}</p>
          <p>Total: {order.totals.total} {order.totals.currency}</p>
        </div>
      ))}
    </div>
  );
}
```

### 5. Batch Operations

For multiple operations in a single transaction:

```typescript
// Create multiple related documents
const batchResult = await FirebaseDB.batchWrite([
  {
    type: 'create',
    collection: 'products',
    data: {
      name: { en: 'Oak Plank A', bg: 'Дъбова дъска A' },
      category: 'hardwood',
      status: 'active'
    }
  },
  {
    type: 'create',
    collection: 'products',
    data: {
      name: { en: 'Oak Plank B', bg: 'Дъбова дъска B' },
      category: 'hardwood',
      status: 'active'
    }
  },
  {
    type: 'update',
    collection: 'products',
    id: 'existing-product-id',
    data: { featured: false }
  }
]);

if (batchResult.success) {
  console.log('All operations completed successfully');
} else {
  console.error('Batch operation failed:', batchResult.error);
}
```

### 6. Transaction Support

For operations that need to be atomic:

```typescript
// Transfer inventory between products
const transferResult = await FirebaseDB.runTransaction(async (transaction) => {
  const sourceDoc = await transaction.get(doc(db, 'products', 'source-id'));
  const targetDoc = await transaction.get(doc(db, 'products', 'target-id'));

  if (!sourceDoc.exists() || !targetDoc.exists()) {
    throw new Error('Product not found');
  }

  const sourceData = sourceDoc.data();
  const targetData = targetDoc.data();

  const transferAmount = 10;

  if (sourceData.availability.quantity < transferAmount) {
    throw new Error('Insufficient inventory');
  }

  // Update both documents
  transaction.update(sourceDoc.ref, {
    'availability.quantity': sourceData.availability.quantity - transferAmount,
    updatedAt: Timestamp.now()
  });

  transaction.update(targetDoc.ref, {
    'availability.quantity': targetData.availability.quantity + transferAmount,
    updatedAt: Timestamp.now()
  });

  return { transferred: transferAmount };
});

if (transferResult.success) {
  console.log('Transfer completed:', transferResult.data);
} else {
  console.error('Transfer failed:', transferResult.error);
}
```

## Error Handling

All operations return a `FirebaseResult<T>` object:

```typescript
const result = await ProductsDB.getById('product-id');

if (result.success) {
  // Operation succeeded
  const product = result.data; // Product object
  console.log('Product loaded:', product);
} else {
  // Operation failed
  console.error('Error:', result.error);
  console.error('Firebase error code:', result.code);
  
  // Handle specific error codes
  switch (result.code) {
    case 'permission-denied':
      console.error('User does not have permission');
      break;
    case 'not-found':
      console.error('Product not found');
      break;
    case 'unavailable':
      console.error('Firebase service unavailable');
      break;
    default:
      console.error('Unknown error occurred');
  }
}
```

## Best Practices

1. **Always handle errors**: Check `result.success` before accessing `result.data`

2. **Use collection helpers**: Prefer `ProductsDB.getById()` over `FirebaseDB.getById('products', id)`

3. **Cleanup subscriptions**: Always return unsubscribe functions in `useEffect`

4. **Use pagination**: For large datasets, use `getPaginated()` instead of `getAll()`

5. **Batch related operations**: Use `batchWrite()` for multiple operations

6. **Use transactions for atomic updates**: When updating related documents

7. **Optimize queries**: Add appropriate indexes in Firebase Console for complex queries

8. **Type safety**: Always specify generic types for better TypeScript support

## Available Collections

- `COLLECTIONS.PRODUCTS` - Product catalog
- `COLLECTIONS.USERS` - User accounts and profiles  
- `COLLECTIONS.ORDERS` - Customer orders
- `COLLECTIONS.CONSULTATIONS` - Design consultations
- `COLLECTIONS.REVIEWS` - Product reviews
- `COLLECTIONS.CATEGORIES` - Product categories
- `COLLECTIONS.SUPPLIERS` - Supplier information

## Environment Setup

Make sure your `.env.local` file contains the Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```