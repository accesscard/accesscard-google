export enum PlanLevel {
  Silver = 'Silver',
  Gold = 'Gold',
  Black = 'Black',
}

export interface Plan {
  level: PlanLevel;
  name: string;
  price: number;
  features: string[];
  color: string;
  gradient: string;
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
  password?: string; // For mock auth
  plan: Plan | null; // Can be null for new users
  memberSince: string;
  membershipExpires?: string; // New field
  cardStatus: 'activa' | 'inactiva';
  qrCodeValue: string;
  role: 'user' | 'admin' | 'venue';
  venueId?: string; // Link user to a venue if role is 'venue'
  // New detailed profile fields
  country?: string;
  address?: string;
  phone?: string;
  socialMedia?: string;
  paymentHistory?: PaymentRecord[];
}

export interface Benefit {
  description: string;
  planRequired: PlanLevel;
}

export interface Venue {
  id: string;
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
  contact?: {
    email: string;
    phone: string;
  }
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
