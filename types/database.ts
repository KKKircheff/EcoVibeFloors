// Database and Firebase infrastructure types
import { Timestamp, DocumentSnapshot } from 'firebase/firestore';

// Base interface for all documents
export interface BaseDocument {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CONSULTATIONS: 'consultations',
  REVIEWS: 'reviews',
  CATEGORIES: 'categories',
  SUPPLIERS: 'suppliers'
} as const;

// Firebase operation result types
export interface FirebaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  lastDoc?: DocumentSnapshot;
}

// Query options
export interface QueryOptions {
  limit?: number;
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  where?: {
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'not-in';
    value: unknown;
  }[];
  startAfter?: DocumentSnapshot;
}