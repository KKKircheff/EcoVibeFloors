// Order related types for EcoVibeFloors
import { Timestamp } from 'firebase/firestore';
import { BaseDocument } from './database';
import { Address } from './user';
import { ConsultationRequest } from './user';

// Order types
export interface Order extends BaseDocument {
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  totals: OrderTotals;
  shipping: ShippingInfo;
  billing: BillingInfo;
  payment: PaymentInfo;
  notes?: string;
  designConsultation?: ConsultationRequest;
}

export type OrderStatus = 
  | 'draft'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  productId: string;
  productName: {
    en: string;
    bg: string;
  };
  quantity: number;
  unit: 'sqm' | 'boxes' | 'pieces';
  unitPrice: number;
  total: number;
  specifications?: Record<string, unknown>;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: 'BGN' | 'EUR';
}

export interface ShippingInfo {
  method: 'standard' | 'express' | 'white-glove';
  address: Address;
  estimatedDelivery: {
    min: Timestamp;
    max: Timestamp;
  };
  trackingNumber?: string;
}

export interface BillingInfo {
  address: Address;
  vatNumber?: string;
  companyName?: string;
}

export interface PaymentInfo {
  method: 'card' | 'bank-transfer' | 'cash-on-delivery';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: Timestamp;
}