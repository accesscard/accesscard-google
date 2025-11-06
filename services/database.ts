import { User, Venue, Reservation, Notification, MembershipTier, AccessLevel, PaymentRecord, Feedback, Plan, CardCategory } from '../types';
import dbData from '../db.json' assert { type: 'json' };
import { Country } from '../components/CountrySelector';

// In-memory store, initialized from the JSON file
// Deep copy to ensure the original imported data is not mutated
let users: User[] = JSON.parse(JSON.stringify(dbData.users));
let venues: Venue[] = JSON.parse(JSON.stringify(dbData.venues));
type StoredReservation = Omit<Reservation, 'venue'> & { venueId: string };
let reservations: StoredReservation[] = JSON.parse(JSON.stringify(dbData.reservations));
let notifications: Notification[] = JSON.parse(JSON.stringify(dbData.notifications));


const populateReservation = (res: StoredReservation): Reservation => {
    const venue = venues.find(v => v.id === res.venueId);
    if (!venue) {
        throw new Error(`Venue with id ${res.venueId} not found for reservation ${res.id}`);
    }
    const { venueId, ...rest } = res;
    return { ...rest, venue };
};

const db = {
  // USERS
  findUserByEmail: (email: string) => users.find(u => u.email === email),
  getUsers: () => users,
  addUser: (user: Omit<User, 'id' | 'access_level' | 'card_level' | 'subscription_status' | 'wallet_qr' | 'registration_date'>) => {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}`,
      access_level: null,
      card_level: null,
      subscription_status: 'pending_verification',
      wallet_qr: null,
      registration_date: new Date().toISOString(),
      paymentHistory: [],
    };
    users.push(newUser);
    return newUser;
  },
  updateUser: (userId: string, updates: Partial<User>) => {
    users = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    return users.find(u => u.id === userId);
  },
  getPaymentHistory: (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.paymentHistory || [];
  },
  addPaymentRecord: (userId: string, tier: MembershipTier, planType: 'monthly' | 'annual') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newRecord: PaymentRecord = {
        id: `pay_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: planType === 'monthly' ? tier.priceMonthly : tier.priceAnnual,
        plan: tier.name,
        invoiceId: `INV-${Date.now()}`
    };
    if (!user.paymentHistory) user.paymentHistory = [];
    user.paymentHistory.unshift(newRecord);
  },


  // VENUES
  getVenues: () => venues,
  getVenuesByCountry: (country: Country) => {
    return venues.filter(v => v.country === country);
  },
  getVenueById: (id: string) => venues.find(v => v.id === id),
  addVenue: (venueData: Omit<Venue, 'id' | 'rating' | 'coordinates' | 'benefits'>) => {
    const newVenue: Venue = {
      ...venueData,
      id: `venue_${Date.now()}`,
      rating: Math.floor(Math.random() * 5) + 1,
      benefits: [],
      coordinates: { lat: 0, lng: 0 } // Placeholder
    };
    venues.unshift(newVenue); // Add to the beginning of the list
    return newVenue;
  },
  updateVenue: (venueId: string, updates: Partial<Venue>) => {
    venues = venues.map(v => v.id === venueId ? { ...v, ...updates } : v);
    return venues.find(v => v.id === venueId);
  },

  // RESERVATIONS
  getReservations: (): Reservation[] => reservations.map(populateReservation),
  getReservationsByVenueId: (venueId: string): Reservation[] => reservations.filter(r => r.venueId === venueId).map(populateReservation),
  addReservation: (resData: Omit<Reservation, 'id'>): Reservation => {
    const { venue, ...rest } = resData;
    const newReservationData: StoredReservation = {
      ...rest,
      id: `res_${Date.now()}`,
      venueId: venue.id,
    };
    reservations.unshift(newReservationData);
    return { ...rest, id: newReservationData.id, venue };
  },
  addFeedbackToReservation: (reservationId: string, feedback: Feedback): Reservation | undefined => {
      let updatedRes: StoredReservation | undefined;
      reservations = reservations.map(r => {
          if (r.id === reservationId) {
              updatedRes = { ...r, feedback: feedback };
              return updatedRes;
          }
          return r;
      });
      return updatedRes ? populateReservation(updatedRes) : undefined;
  },


  // NOTIFICATIONS
  getNotifications: () => notifications,
  
  // MEMBERSHIP TIERS & PLANS
  getMembershipTiers: (): MembershipTier[] => Object.values(dbData.membership_tiers),
  getMembershipTiersObject: (): Record<AccessLevel, MembershipTier> => (dbData.membership_tiers as Record<AccessLevel, MembershipTier>),
  getPlans: (): Record<string, Plan> => {
      const tiers = dbData.membership_tiers as Record<AccessLevel, MembershipTier>;
      return {
          Silver: tiers.Silver,
          Gold: tiers.Gold,
          Black: tiers.VIP,
      };
  },
  
  // CARD BINS
  getCardBins: (): Record<string, { category: CardCategory, bank: string, brand: string }> => (dbData.card_bins),
};

export default db;