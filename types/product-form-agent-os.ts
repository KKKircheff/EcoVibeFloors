// Product related types for EcoVibeFloors
import { Timestamp } from 'firebase/firestore';
import { BaseDocument } from './database';

// Product types
export interface Product extends BaseDocument {
  name: {
    en: string;
    bg: string;
  };
  description: {
    en: string;
    bg: string;
  };
  category: ProductCategory;
  brand: string;
  origin: 'Netherlands' | 'Belgium' | 'Germany';
  specifications: ProductSpecs;
  pricing: ProductPricing;
  availability: ProductAvailability;
  images: ProductImage[];
  certifications: Certification[];
  warranty: {
    years: number;
    terms: {
      en: string;
      bg: string;
    };
  };
  featured: boolean;
  status: 'active' | 'inactive' | 'discontinued';
}

export type ProductCategory = 
  | 'hardwood'
  | 'engineered-wood' 
  | 'luxury-vinyl'
  | 'laminate'
  | 'bamboo'
  | 'cork'
  | 'accessories';

export interface ProductSpecs {
  dimensions: {
    length: number;
    width: number;
    thickness: number;
    unit: 'mm' | 'cm';
  };
  surfaceFinish: string;
  installation: 'click' | 'glue' | 'nail' | 'float';
  wearLayer?: number;
  janka?: number;
  moisture?: number;
  fireRating?: string;
}

export interface ProductPricing {
  pricePerSqm: {
    BGN: number;
    EUR: number;
  };
  currency: 'BGN' | 'EUR';
  discounts?: Discount[];
  bulkPricing?: BulkPricing[];
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  minQuantity?: number;
  validUntil?: Timestamp;
  conditions?: string;
}

export interface BulkPricing {
  minQuantity: number;
  pricePerSqm: number;
  discount: number;
}

export interface ProductAvailability {
  inStock: boolean;
  quantity: number;
  unit: 'sqm' | 'boxes' | 'pieces';
  leadTime: {
    min: number;
    max: number;
    unit: 'days' | 'weeks';
  };
  supplier: string;
}

export interface ProductImage {
  url: string;
  alt: {
    en: string;
    bg: string;
  };
  type: 'main' | 'detail' | 'installation' | 'room-scene';
  order: number;
}

export interface Certification {
  name: string;
  issuer: string;
  validUntil?: Timestamp;
  certificateUrl?: string;
}