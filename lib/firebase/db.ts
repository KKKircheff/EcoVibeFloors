// Database utilities for Firestore operations

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  writeBatch,
  runTransaction,
  onSnapshot,
  QueryConstraint,
  DocumentSnapshot,
  FirestoreError,
  Transaction
} from 'firebase/firestore';

import { db } from '../firebase';
import { 
  BaseDocument, 
  FirebaseResult, 
  PaginatedResult, 
  QueryOptions,
  COLLECTIONS 
} from './types';
import { User, Product, Order, ConsultationRequest } from '../../types';

// Generic CRUD operations
export class FirebaseDB {
  
  // Create a new document
  static async create<T extends Omit<BaseDocument, 'id' | 'createdAt' | 'updatedAt'>>(
    collectionName: string,
    data: T
  ): Promise<FirebaseResult<BaseDocument & T>> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, collectionName), docData);
      
      return {
        success: true,
        data: {
          ...docData,
          id: docRef.id
        } as BaseDocument & T
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create document',
        code: (error as FirestoreError)?.code
      };
    }
  }

  // Create document with custom ID
  static async createWithId<T extends Omit<BaseDocument, 'id' | 'createdAt' | 'updatedAt'>>(
    collectionName: string,
    id: string,
    data: T
  ): Promise<FirebaseResult<BaseDocument & T>> {
    try {
      const now = Timestamp.now();
      const docData = {
        ...data,
        createdAt: now,
        updatedAt: now
      };

      await setDoc(doc(db, collectionName, id), docData);

      return {
        success: true,
        data: {
          ...docData,
          id
        } as BaseDocument & T
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create document',
        code: (error as FirestoreError)?.code
      };
    }
  }

  // Get document by ID
  static async getById<T extends BaseDocument>(
    collectionName: string,
    id: string
  ): Promise<FirebaseResult<T>> {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return {
          success: false,
          error: 'Document not found'
        };
      }

      const data = { ...docSnap.data(), id: docSnap.id } as T;
      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get document',
        code: (error as FirestoreError)?.code
      };
    }
  }

  // Get all documents from collection
  static async getAll<T extends BaseDocument>(
    collectionName: string,
    options?: QueryOptions
  ): Promise<FirebaseResult<T[]>> {
    try {
      const constraints: QueryConstraint[] = [];

      if (options?.where) {
        options.where.forEach(condition => {
          constraints.push(where(condition.field, condition.operator, condition.value));
        });
      }

      if (options?.orderBy) {
        constraints.push(orderBy(options.orderBy.field, options.orderBy.direction));
      }

      if (options?.limit) {
        constraints.push(limit(options.limit));
      }

      if (options?.startAfter) {
        constraints.push(startAfter(options.startAfter));
      }

      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const documents = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as T[];

      return {
        success: true,
        data: documents
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get documents',
        code: (error as FirestoreError)?.code
      };
    }
  }

  // Get paginated results
  static async getPaginated<T extends BaseDocument>(
    collectionName: string,
    pageSize: number = 10,
    lastDoc?: DocumentSnapshot,
    options?: Omit<QueryOptions, 'limit' | 'startAfter'>
  ): Promise<FirebaseResult<PaginatedResult<T>>> {
    try {
      const constraints: QueryConstraint[] = [];

      if (options?.where) {
        options.where.forEach(condition => {
          constraints.push(where(condition.field, condition.operator, condition.value));
        });
      }

      if (options?.orderBy) {
        constraints.push(orderBy(options.orderBy.field, options.orderBy.direction));
      }

      constraints.push(limit(pageSize + 1)); // Get one extra to check if there are more

      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(collection(db, collectionName), ...constraints);
      const querySnapshot = await getDocs(q);

      const documents = querySnapshot.docs.slice(0, pageSize).map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as T[];

      const hasMore = querySnapshot.docs.length > pageSize;
      const newLastDoc = documents.length > 0 ? querySnapshot.docs[documents.length - 1] : undefined;

      return {
        success: true,
        data: {
          items: documents,
          total: documents.length,
          hasMore,
          lastDoc: newLastDoc
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get paginated documents',
        code: (error as FirestoreError)?.code
      };
    }
  }

  // Update document
  static async update<T extends BaseDocument>(
    collectionName: string,
    id: string,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<FirebaseResult<void>> {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update document',
        code: (error as FirestoreError)?.code
      };
    }
  }

  // Delete document
  static async delete(
    collectionName: string,
    id: string
  ): Promise<FirebaseResult<void>> {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete document',
        code: (error as FirestoreError)?.code
      };
    }
  }

  // Batch operations
  static async batchWrite(
    operations: Array<{
      type: 'create' | 'update' | 'delete';
      collection: string;
      id?: string;
      data?: Record<string, unknown>;
    }>
  ): Promise<FirebaseResult<void>> {
    try {
      const batch = writeBatch(db);
      const now = Timestamp.now();

      operations.forEach(op => {
        const docRef = op.id 
          ? doc(db, op.collection, op.id)
          : doc(collection(db, op.collection));

        switch (op.type) {
          case 'create':
            batch.set(docRef, {
              ...op.data,
              createdAt: now,
              updatedAt: now
            });
            break;
          case 'update':
            batch.update(docRef, {
              ...op.data,
              updatedAt: now
            });
            break;
          case 'delete':
            batch.delete(docRef);
            break;
        }
      });

      await batch.commit();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to execute batch operation',
        code: (error as FirestoreError)?.code
      };
    }
  }

  // Transaction
  static async runTransaction<T>(
    transactionFn: (transaction: Transaction) => Promise<T>
  ): Promise<FirebaseResult<T>> {
    try {
      const result = await runTransaction(db, transactionFn);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction failed',
        code: (error as FirestoreError)?.code
      };
    }
  }

  // Real-time listener
  static subscribeToDocument<T extends BaseDocument>(
    collectionName: string,
    id: string,
    callback: (data: T | null, error?: string) => void
  ): () => void {
    const docRef = doc(db, collectionName, id);
    
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = { ...docSnap.data(), id: docSnap.id } as T;
          callback(data);
        } else {
          callback(null);
        }
      },
      (error) => {
        callback(null, error.message);
      }
    );
  }

  // Real-time collection listener
  static subscribeToCollection<T extends BaseDocument>(
    collectionName: string,
    callback: (data: T[], error?: string) => void,
    options?: QueryOptions
  ): () => void {
    const constraints: QueryConstraint[] = [];

    if (options?.where) {
      options.where.forEach(condition => {
        constraints.push(where(condition.field, condition.operator, condition.value));
      });
    }

    if (options?.orderBy) {
      constraints.push(orderBy(options.orderBy.field, options.orderBy.direction));
    }

    if (options?.limit) {
      constraints.push(limit(options.limit));
    }

    const q = query(collection(db, collectionName), ...constraints);
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as T[];
        callback(documents);
      },
      (error) => {
        callback([], error.message);
      }
    );
  }
}

// Collection-specific helper functions
export const ProductsDB = {
  getAll: (options?: QueryOptions) => FirebaseDB.getAll(COLLECTIONS.PRODUCTS, options),
  getById: (id: string) => FirebaseDB.getById(COLLECTIONS.PRODUCTS, id),
  create: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => FirebaseDB.create(COLLECTIONS.PRODUCTS, data),
  update: (id: string, data: Partial<Product>) => FirebaseDB.update(COLLECTIONS.PRODUCTS, id, data),
  delete: (id: string) => FirebaseDB.delete(COLLECTIONS.PRODUCTS, id),
  
  // Product-specific methods
  getFeatured: () => FirebaseDB.getAll(COLLECTIONS.PRODUCTS, {
    where: [{ field: 'featured', operator: '==', value: true }],
    orderBy: { field: 'updatedAt', direction: 'desc' }
  }),
  
  getByCategory: (category: string) => FirebaseDB.getAll(COLLECTIONS.PRODUCTS, {
    where: [
      { field: 'category', operator: '==', value: category },
      { field: 'status', operator: '==', value: 'active' }
    ]
  }),
  
  search: (searchTerm: string, options?: QueryOptions) => {
    // Note: For full-text search, consider using Algolia or similar service
    // This is a basic implementation
    return FirebaseDB.getAll(COLLECTIONS.PRODUCTS, {
      ...options,
      where: [
        { field: 'status', operator: '==', value: 'active' },
        ...(options?.where || [])
      ]
    });
  }
};

export const UsersDB = {
  getAll: (options?: QueryOptions) => FirebaseDB.getAll(COLLECTIONS.USERS, options),
  getById: (id: string) => FirebaseDB.getById(COLLECTIONS.USERS, id),
  create: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => FirebaseDB.create(COLLECTIONS.USERS, data),
  createWithId: (id: string, data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => FirebaseDB.createWithId(COLLECTIONS.USERS, id, data),
  update: (id: string, data: Partial<User>) => FirebaseDB.update(COLLECTIONS.USERS, id, data),
  delete: (id: string) => FirebaseDB.delete(COLLECTIONS.USERS, id),
};

export const OrdersDB = {
  getAll: (options?: QueryOptions) => FirebaseDB.getAll(COLLECTIONS.ORDERS, options),
  getById: (id: string) => FirebaseDB.getById(COLLECTIONS.ORDERS, id),
  create: (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => FirebaseDB.create(COLLECTIONS.ORDERS, data),
  update: (id: string, data: Partial<Order>) => FirebaseDB.update(COLLECTIONS.ORDERS, id, data),
  delete: (id: string) => FirebaseDB.delete(COLLECTIONS.ORDERS, id),
  
  // Order-specific methods
  getByUser: (userId: string) => FirebaseDB.getAll(COLLECTIONS.ORDERS, {
    where: [{ field: 'userId', operator: '==', value: userId }],
    orderBy: { field: 'createdAt', direction: 'desc' }
  }),
  
  getByStatus: (status: string) => FirebaseDB.getAll(COLLECTIONS.ORDERS, {
    where: [{ field: 'status', operator: '==', value: status }],
    orderBy: { field: 'updatedAt', direction: 'desc' }
  })
};

export const ConsultationsDB = {
  getAll: (options?: QueryOptions) => FirebaseDB.getAll(COLLECTIONS.CONSULTATIONS, options),
  getById: (id: string) => FirebaseDB.getById(COLLECTIONS.CONSULTATIONS, id),
  create: (data: Omit<ConsultationRequest, 'id' | 'createdAt' | 'updatedAt'>) => FirebaseDB.create(COLLECTIONS.CONSULTATIONS, data),
  update: (id: string, data: Partial<ConsultationRequest>) => FirebaseDB.update(COLLECTIONS.CONSULTATIONS, id, data),
  delete: (id: string) => FirebaseDB.delete(COLLECTIONS.CONSULTATIONS, id),
  
  // Consultation-specific methods
  getByUser: (userId: string) => FirebaseDB.getAll(COLLECTIONS.CONSULTATIONS, {
    where: [{ field: 'userId', operator: '==', value: userId }],
    orderBy: { field: 'createdAt', direction: 'desc' }
  }),
  
  getPending: () => FirebaseDB.getAll(COLLECTIONS.CONSULTATIONS, {
    where: [{ field: 'status', operator: '==', value: 'requested' }],
    orderBy: { field: 'createdAt', direction: 'asc' }
  })
};