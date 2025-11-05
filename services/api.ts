
import { User, Venue, MembershipTier, Reservation, Feedback, CardCategory } from '../types';
import db from './database';
import { Country } from '../components/CountrySelector';
import { MOCK_CARD_BINS, MEMBERSHIP_TIERS } from './mockData';

// Simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const addUserPlan = (user: User | undefined): User | undefined => {
    if (user && user.access_level) {
        user.plan = MEMBERSHIP_TIERS[user.access_level];
    }
    return user;
}

export const api = {
  // AUTH & REGISTRATION
  login: async (email: string, password: string): Promise<User | null> => {
    await delay(500);
    const user = db.findUserByEmail(email);
    if (user && user.password === password) {
      return addUserPlan(user) || null;
    }
    return null;
  },
  registerUser: async (userData: Omit<User, 'id' | 'access_level' | 'card_level' | 'subscription_status' | 'wallet_qr' | 'registration_date' | 'role'>) => {
    await delay(500);
    const existingUser = db.findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error("El correo electrónico ya está en uso.");
    }
    const newUser = db.addUser({
      ...userData,
      role: 'user',
    });
    return addUserPlan(newUser);
  },
  
  validateCardBIN: async (bin: string): Promise<{ status: 'success', category: CardCategory } | { status: 'error', message: string }> => {
    await delay(1000);
    const cardData = MOCK_CARD_BINS[bin];
    if (cardData) {
        return { status: 'success', category: cardData.category };
    }
    if(bin === '000000') {
         return { status: 'error', message: 'Tu tarjeta no cumple con el estándar de privilegio ACCESS+.' };
    }
    return { status: 'error', message: 'No pudimos validar la categoría de tu tarjeta. Por favor, intenta con otra.' };
  },

  activateSubscription: async (userId: string, tier: MembershipTier, cardCategory: CardCategory): Promise<User | undefined> => {
      await delay(1500); // Simulate payment processing
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      db.addPaymentRecord(userId, tier, 'annual'); // Assume annual for now

      const user = db.updateUser(userId, { 
        access_level: tier.level,
        card_level: cardCategory,
        subscription_status: 'active',
        membershipExpires: expiryDate.toISOString().split('T')[0],
        wallet_qr: `ACCESS+${userId.toUpperCase()}-${tier.level.toUpperCase()}`
      });
      return addUserPlan(user);
  },
  
  // FIX: Add updateUserPlan method
  updateUserPlan: async (userId: string, tier: MembershipTier): Promise<User | undefined> => {
    await delay(1000);
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    db.addPaymentRecord(userId, tier, 'annual');
    const updatedUser = db.updateUser(userId, { 
        access_level: tier.level,
        membershipExpires: expiryDate.toISOString().split('T')[0],
    });
    return addUserPlan(updatedUser);
  },

  // USER DATA
  getUsers: async (): Promise<User[]> => {
    await delay(300);
    return db.getUsers().map(u => addUserPlan(u)!);
  },
  updateUserStatus: async (userId: string, status: 'active' | 'suspended'): Promise<User | undefined> => {
    await delay(300);
    const user = db.updateUser(userId, { subscription_status: status });
    return addUserPlan(user);
  },
  updateUserProfile: async (userId: string, profileData: Partial<User>) => {
    await delay(400);
    const user = db.updateUser(userId, profileData);
    return addUserPlan(user);
  },
  getPaymentHistory: async (userId: string) => {
    await delay(300);
    return db.getPaymentHistory(userId);
  },
  createUser: async (userData: any): Promise<User> => {
    await delay(400);
    const newUser = db.addUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user',
    });
    // This is for admin creation, so we activate it directly
    const tier = db.getMembershipTiers().find(t => t.level === userData.plan) || db.getMembershipTiers()[0];
    const activatedUser = await api.activateSubscription(newUser.id, tier, 'Premium');
    return addUserPlan(activatedUser)!;
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
  updateVenueDetails: async (venueId: string, details: Partial<Venue>): Promise<Venue | undefined> => {
    await delay(500);
    return db.updateVenue(venueId, details);
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
