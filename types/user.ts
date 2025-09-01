// User related types for EcoVibeFloors
import { BaseDocument } from './database';

// User types
export interface User extends BaseDocument {
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'customer' | 'admin' | 'designer';
  preferences: {
    language: 'en' | 'bg';
    currency: 'BGN' | 'EUR';
  };
  profile: {
    firstName: string;
    lastName: string;
    phone?: string;
    address?: Address;
    company?: string;
    isDesignProfessional: boolean;
  };
}

// Address interface
export interface Address {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
}

// Consultation related types
export interface ConsultationRequest extends BaseDocument {
  userId: string;
  type: 'design' | 'technical' | 'installation';
  status: 'requested' | 'scheduled' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  projectDetails: {
    area: number;
    roomType: string[];
    budget?: {
      min: number;
      max: number;
      currency: 'BGN' | 'EUR';
    };
    timeline: string;
    description: string;
  };
  preferredContact: {
    method: 'phone' | 'email' | 'video-call' | 'in-person';
    availability: string;
  };
  assignedConsultant?: string;
  scheduledDate?: import('firebase/firestore').Timestamp;
  notes?: string;
}