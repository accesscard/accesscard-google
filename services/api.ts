import { User, Venue, Plan, Reservation, Feedback } from '../types';
import db from './database';
import { Country } from '../components/CountrySelector';

// Simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  // AUTH
  login: async (email: string, password: string): Promise<User | null> => {
    await delay(500);
    const user = db.findUserByEmail(email);
    if (user && user.password === password) {
      return user;
    }
    return null;
  },
  registerUser: async (userData: Omit<User, 'id' | 'qrCodeValue' | 'memberSince' | 'cardStatus' | 'plan' >) => {
    await delay(500);
    const newUser = db.addUser({
      ...userData,
      plan: null, // User starts without a plan
    });
    return newUser;
  },
  
  updateUserPlan: async (userId: string, plan: Plan): Promise<User | undefined> => {
      await delay(700);
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      db.addPaymentRecord(userId, plan);

      return db.updateUser(userId, { 
        plan: plan,
        cardStatus: 'activa',
        membershipExpires: expiryDate.toISOString().split('T')[0],
        qrCodeValue: `ACCESS+${userId.toUpperCase()}-${plan.level.toUpperCase()}`
      });
  },

  // USER DATA
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return db.getUsers();
  },
  updateUserStatus: async (userId: string, status: 'activa' | 'inactiva'): Promise<User | undefined> => {
    await delay(300);
    return db.updateUser(userId, { cardStatus: status });
  },
  updateUserProfile: async (userId: string, profileData: Partial<User>) => {
    await delay(400);
    return db.updateUser(userId, profileData);
  },
  getPaymentHistory: async (userId: string) => {
    await delay(300);
    return db.getPaymentHistory(userId);
  },
  createUser: async (userData: any): Promise<User> => {
    await delay(400);
    const plan = db.getPlans().find(p => p.level === userData.plan) || db.getPlans()[0];
    const newUser = db.addUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      plan: plan,
      role: 'user',
    });
    return newUser;
  },

  // VENUE DATA
  getVenues: async (): Promise<Venue[]> => {
    await delay(300);
    return db.getVenues();
  },
  getVenuesByCountry: async (country: Country): Promise<Venue[]> => {
    await delay(500);
    return db.getVenuesByCountry(country);
  },
  updateVenueStatus: async (venueId: string, status: Venue['status']): Promise<Venue | undefined> => {
    await delay(300);
    return db.updateVenue(venueId, { status });
  },
  registerVenue: async (venueData: any) => {
    await delay(600);
    const newVenue = db.addVenue({ ...venueData, status: 'pendiente' });
    return newVenue;
  },
  createVenue: async (venueData: any): Promise<Venue> => {
    await delay(400);
    const newVenue = db.addVenue({
        ...venueData,
        status: 'aprobado'
    });
    return newVenue;
  },
  
  // RESERVATIONS
  getReservations: async (): Promise<Reservation[]> => {
      await delay(200);
      return db.getReservations();
  },
  getReservationsByVenueId: async(venueId: string): Promise<Reservation[]> => {
      await delay(400);
      return db.getReservationsByVenueId(venueId);
  },
  createReservation: async (details: Omit<Reservation, 'id'>) => {
    await delay(500);
    return db.addReservation(details);
  },
  submitFeedback: async (reservationId: string, feedback: Feedback) => {
      await delay(400);
      return db.addFeedbackToReservation(reservationId, feedback);
  }
};