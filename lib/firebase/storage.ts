// Storage utilities for Firebase Storage

import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata,
  StorageReference,
  UploadTaskSnapshot,
  StorageError,
  TaskState
} from 'firebase/storage';

import { storage } from '../firebase';
import { FirebaseResult } from './types';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  state: TaskState;
}

export interface FileUploadOptions {
  customMetadata?: Record<string, string>;
  contentType?: string;
  onProgress?: (progress: UploadProgress) => void;
  onComplete?: (downloadURL: string) => void;
  onError?: (error: string) => void;
}

export interface ImageResizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  format?: 'jpeg' | 'png' | 'webp';
}

export class StorageService {
  
  // Get storage reference
  static getRef(path: string): StorageReference {
    return ref(storage, path);
  }

  // Upload file with progress tracking
  static uploadFile(
    path: string,
    file: File | Blob,
    options?: FileUploadOptions
  ): Promise<FirebaseResult<string>> {
    return new Promise((resolve) => {
      const storageRef = ref(storage, path);
      const metadata = {
        contentType: options?.contentType || file.type,
        customMetadata: options?.customMetadata
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            state: snapshot.state
          };
          options?.onProgress?.(progress);
        },
        (error: StorageError) => {
          const errorMessage = error.message;
          options?.onError?.(errorMessage);
          resolve({
            success: false,
            error: errorMessage,
            code: error.code
          });
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            options?.onComplete?.(downloadURL);
            resolve({
              success: true,
              data: downloadURL
            });
          } catch (error) {
            resolve({
              success: false,
              error: error instanceof Error ? error.message : 'Failed to get download URL'
            });
          }
        }
      );
    });
  }

  // Simple file upload without progress tracking
  static async uploadFileSimple(
    path: string,
    file: File | Blob,
    customMetadata?: Record<string, string>
  ): Promise<FirebaseResult<string>> {
    try {
      const storageRef = ref(storage, path);
      const metadata = {
        contentType: file.type,
        customMetadata
      };

      const uploadResult = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      return {
        success: true,
        data: downloadURL
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload file',
        code: (error as StorageError)?.code
      };
    }
  }

  // Upload multiple files
  static async uploadMultipleFiles(
    files: Array<{ file: File | Blob; path: string; metadata?: Record<string, string> }>,
    onProgress?: (completedCount: number, totalCount: number) => void
  ): Promise<FirebaseResult<string[]>> {
    try {
      const uploadPromises = files.map(async ({ file, path, metadata }) => {
        const result = await this.uploadFileSimple(path, file, metadata);
        return result;
      });

      const results = [];
      let completedCount = 0;

      for (const promise of uploadPromises) {
        const result = await promise;
        if (!result.success) {
          throw new Error(result.error);
        }
        results.push(result.data!);
        completedCount++;
        onProgress?.(completedCount, files.length);
      }

      return {
        success: true,
        data: results
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload multiple files'
      };
    }
  }

  // Download file URL
  static async getDownloadURL(path: string): Promise<FirebaseResult<string>> {
    try {
      const storageRef = ref(storage, path);
      const downloadURL = await getDownloadURL(storageRef);

      return {
        success: true,
        data: downloadURL
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get download URL',
        code: (error as StorageError)?.code
      };
    }
  }

  // Delete file
  static async deleteFile(path: string): Promise<FirebaseResult<void>> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file',
        code: (error as StorageError)?.code
      };
    }
  }

  // Delete multiple files
  static async deleteMultipleFiles(paths: string[]): Promise<FirebaseResult<void>> {
    try {
      const deletePromises = paths.map(path => this.deleteFile(path));
      const results = await Promise.all(deletePromises);

      const failedDeletions = results.filter(result => !result.success);
      if (failedDeletions.length > 0) {
        throw new Error(`Failed to delete ${failedDeletions.length} files`);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete multiple files'
      };
    }
  }

  // List files in directory
  static async listFiles(path: string): Promise<FirebaseResult<string[]>> {
    try {
      const storageRef = ref(storage, path);
      const listResult = await listAll(storageRef);

      const downloadURLs = await Promise.all(
        listResult.items.map(async (itemRef) => {
          return await getDownloadURL(itemRef);
        })
      );

      return {
        success: true,
        data: downloadURLs
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list files',
        code: (error as StorageError)?.code
      };
    }
  }

  // Get file metadata
  static async getFileMetadata(path: string): Promise<FirebaseResult<object>> {
    try {
      const storageRef = ref(storage, path);
      const metadata = await getMetadata(storageRef);

      return {
        success: true,
        data: metadata
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get file metadata',
        code: (error as StorageError)?.code
      };
    }
  }

  // Update file metadata
  static async updateFileMetadata(
    path: string,
    metadata: Record<string, string>
  ): Promise<FirebaseResult<void>> {
    try {
      const storageRef = ref(storage, path);
      await updateMetadata(storageRef, { customMetadata: metadata });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update file metadata',
        code: (error as StorageError)?.code
      };
    }
  }

  // Resize image client-side before upload
  static resizeImage(
    file: File,
    options: ImageResizeOptions = {}
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const {
        maxWidth = 1920,
        maxHeight = 1080,
        quality = 0.8,
        format = 'jpeg'
      } = options;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and resize image
        ctx!.drawImage(img, 0, 0, width, height);

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to resize image'));
            }
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Upload image with automatic resizing
  static async uploadImage(
    path: string,
    file: File,
    resizeOptions?: ImageResizeOptions,
    uploadOptions?: FileUploadOptions
  ): Promise<FirebaseResult<string>> {
    try {
      let fileToUpload: File | Blob = file;

      // Resize image if options provided and file is an image
      if (resizeOptions && file.type.startsWith('image/')) {
        fileToUpload = await this.resizeImage(file, resizeOptions);
      }

      return await this.uploadFile(path, fileToUpload, uploadOptions);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image'
      };
    }
  }

  // Generate unique file path
  static generatePath(
    folder: string,
    fileName: string,
    userId?: string
  ): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    if (userId) {
      return `${folder}/${userId}/${timestamp}_${randomString}_${cleanFileName}`;
    }
    
    return `${folder}/${timestamp}_${randomString}_${cleanFileName}`;
  }

  // Get file size in human readable format
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Validate file type
  static validateFileType(
    file: File,
    allowedTypes: string[]
  ): { valid: boolean; error?: string } {
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }
    return { valid: true };
  }

  // Validate file size
  static validateFileSize(
    file: File,
    maxSizeInMB: number
  ): { valid: boolean; error?: string } {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        error: `File size ${this.formatFileSize(file.size)} exceeds maximum allowed size of ${maxSizeInMB}MB`
      };
    }
    return { valid: true };
  }
}

// Predefined storage paths for the flooring business
export const STORAGE_PATHS = {
  PRODUCTS: 'products',
  PRODUCT_IMAGES: 'products/images',
  PRODUCT_DOCUMENTS: 'products/documents',
  USER_AVATARS: 'users/avatars',
  USER_DOCUMENTS: 'users/documents',
  CONSULTATION_FILES: 'consultations/files',
  CONSULTATION_IMAGES: 'consultations/images',
  ORDERS: 'orders',
  CERTIFICATES: 'certificates',
  SAMPLES: 'samples',
  ROOM_INSPIRATION: 'inspiration/rooms',
  INSTALLATION_GUIDES: 'guides/installation'
} as const;

// File type validation presets
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ALL_DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ]
} as const;

// Convenience methods for specific use cases
export const ProductStorage = {
  uploadImage: (productId: string, file: File, options?: FileUploadOptions) => {
    const path = StorageService.generatePath(STORAGE_PATHS.PRODUCT_IMAGES, file.name, productId);
    return StorageService.uploadImage(path, file, {
      maxWidth: 1200,
      maxHeight: 900,
      quality: 0.85,
      format: 'jpeg'
    }, options);
  },

  uploadDocument: (productId: string, file: File, _options?: FileUploadOptions) => {
    const path = StorageService.generatePath(STORAGE_PATHS.PRODUCT_DOCUMENTS, file.name, productId);
    return StorageService.uploadFileSimple(path, file);
  },

  deleteProductFiles: (productId: string) => {
    // This would require listing files first, then deleting them
    // Implementation depends on how you structure your storage
    return StorageService.deleteMultipleFiles([
      `${STORAGE_PATHS.PRODUCT_IMAGES}/${productId}`,
      `${STORAGE_PATHS.PRODUCT_DOCUMENTS}/${productId}`
    ]);
  }
};

export const UserStorage = {
  uploadAvatar: (userId: string, file: File, options?: FileUploadOptions) => {
    const path = `${STORAGE_PATHS.USER_AVATARS}/${userId}/avatar.jpg`;
    return StorageService.uploadImage(path, file, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.8,
      format: 'jpeg'
    }, options);
  },

  uploadDocument: (userId: string, file: File, _options?: FileUploadOptions) => {
    const path = StorageService.generatePath(STORAGE_PATHS.USER_DOCUMENTS, file.name, userId);
    return StorageService.uploadFileSimple(path, file);
  }
};

export const ConsultationStorage = {
  uploadFile: (consultationId: string, file: File, options?: FileUploadOptions) => {
    const basePath = file.type.startsWith('image/') 
      ? STORAGE_PATHS.CONSULTATION_IMAGES 
      : STORAGE_PATHS.CONSULTATION_FILES;
    
    const path = StorageService.generatePath(basePath, file.name, consultationId);
    
    if (file.type.startsWith('image/')) {
      return StorageService.uploadImage(path, file, {
        maxWidth: 1200,
        maxHeight: 900,
        quality: 0.8
      }, options);
    } else {
      return StorageService.uploadFileSimple(path, file);
    }
  }
};