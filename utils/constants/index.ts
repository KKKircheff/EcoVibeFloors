// Application constants
// Usage: import { SUPPORTED_LOCALES, CURRENCY } from '@/utils/constants'

// Internationalization constants
export const SUPPORTED_LOCALES = ['en', 'bg'] as const;
export const DEFAULT_LOCALE = 'en' as const;

// Currency and pricing constants for EcoVibeFloors
export const CURRENCY = {
  BGN: 'BGN',
  EUR: 'EUR',
  USD: 'USD',
} as const;

// Product categories
export const FLOORING_CATEGORIES = {
  NATURAL_WOOD: 'natural_wood',
  LAMINATE: 'laminate',
  VINYL: 'vinyl',
  BAMBOO: 'bamboo',
} as const;

// API endpoints (if needed)
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  USERS: '/api/users',
  AUTH: '/api/auth',
} as const;