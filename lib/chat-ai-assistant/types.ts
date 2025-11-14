/**
 * TypeScript types for Chat AI Assistant
 */

import { Timestamp } from 'firebase-admin/firestore';

export interface KnowledgeChunk {
  id: string;
  text: string;
  embedding: number[]; // 1536-dimensional vector from Azure OpenAI

  // Metadata for filtering
  locale: 'en' | 'bg';
  contentType: 'product' | 'page' | 'document';
  category: 'hybrid-wood' | 'oak' | 'click-vinyl' | 'glue-down-vinyl' | 'general';

  // Source tracking
  sourceId: string;
  sourceUrl: string;
  sourceTitle: string;

  // Product-specific metadata (if contentType === 'product')
  productSku?: string | null;
  price?: number | null;
  imageUrl?: string | null;

  // Timestamps
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface ChunkMetadata {
  text: string;
  locale: 'en' | 'bg';
  contentType: 'product' | 'page' | 'document';
  category: string;
  sourceId: string;
  sourceUrl: string;
  sourceTitle: string;
  productSku?: string;
  price?: number;
  imageUrl?: string;
  productData?: string; // Full product object as JSON string (for AI assistant reference)
}

export interface PageToScrape {
  url: string;
  locale: 'en' | 'bg';
  type: 'home' | 'collection' | 'educational';
  category?: string;
}

export interface VectorSearchResult extends KnowledgeChunk {
  similarity?: number;
}
