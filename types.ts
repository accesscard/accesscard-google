

export enum AccessLevel {
  Silver = 'Silver',
  Gold = 'Gold',
  VIP = 'VIP',
}

export type CardCategory = 'Premium' | 'High-End' | 'Ultra High-End';

export interface MembershipTier {
  level: AccessLevel;
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  color: string;
  gradient: string;
}

// FIX: Export Plan type alias for MembershipTier
export type Plan = MembershipTier;

// FIX: Export PlanLevel enum for use in subscription and UI components
export enum PlanLevel {
  Silver = 'Silver',
  Gold = 'Gold',
  Black = 'VIP',
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  plan: string;
  invoiceId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  country?: string;
  city?: string;
  document_id?: string; // DNI/RUT
  birthdate?: string;
  // FIX: Add missing optional properties to User interface
  address?: string;
  socialMedia?: string;
  memberSince?: string;
  plan?: Plan;
  
  access_level: AccessLevel | null;
  card_level: CardCategory | null;
  subscription_status: 'active' | 'suspended' | 'canceled' | 'pending_verification' | null;
  wallet_qr: string | null;
  registration_date: string;
  
  role: 'user' | 'admin' | 'venue';
  venueId?: string;
  
  // Kept for legacy compatibility where needed, but should be phased out
  membershipExpires?: string;
  paymentHistory?: PaymentRecord[];
}

export interface Benefit {
  description: string;
  planRequired: AccessLevel;
}

export interface Venue {
  id:string;
  name: string;
  category: 'Restaurante' | 'Bar' | 'Rooftop' | 'Discoteca';
  location: string;
  address: string;
  image: string;
  rating: number;
  benefits: Benefit[];
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: 'aprobado' | 'pendiente' | 'suspendido';
  country: string;
  contact?: {
    email: string;
    phone: string;
  }
  hours?: { day: string; time: string }[];
}

export interface Feedback {
  rating: number; // 1-5
  comment?: string;
}

export interface Reservation {
  id: string;
  venue: Venue;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmada' | 'pendiente' | 'cancelada' | 'completada';
  feedback?: Feedback;
}

export interface Notification {
  id: string;
  type: 'reservation' | 'offer' | 'system';
  title: string;
  message: string;
  timestamp: string; // ISO string for simplicity in mock
  read: boolean;
}