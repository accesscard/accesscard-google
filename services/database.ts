import { User, Venue, Reservation, Notification, Plan, PlanLevel, PaymentRecord, Feedback } from '../types';
import { MOCK_ADMIN_USER, MOCK_USER, MOCK_VENUE_USER, MOCK_VENUES, MOCK_RESERVATIONS, MOCK_NOTIFICATIONS, PLANS, MOCK_VENUES_BY_COUNTRY } from './mockData';
import { Country } from '../components/CountrySelector';

// In-memory store
let users: User[] = [MOCK_ADMIN_USER, MOCK_USER, MOCK_VENUE_USER];
let venues: Venue[] = MOCK_VENUES;
let reservations: Reservation[] = MOCK_RESERVATIONS;
let notifications: Notification[] = MOCK_NOTIFICATIONS;

const db = {
  // USERS
  findUserByEmail: (email: string) => users.find(u => u.email === email),
  getUsers: () => users,
  addUser: (user: Omit<User, 'id' | 'qrCodeValue' | 'plan' | 'memberSince' | 'cardStatus'> & { plan: Plan | null }) => {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}`,
      qrCodeValue: `ACCESS+USR${Date.now()}`,
      memberSince: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric'}),
      cardStatus: 'inactiva',
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
  addPaymentRecord: (userId: string, plan: Plan) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newRecord: PaymentRecord = {
        id: `pay_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        amount: plan.price,
        plan: plan.name,
        invoiceId: `INV-${Date.now()}`
    };
    if (!user.paymentHistory) user.paymentHistory = [];
    user.paymentHistory.unshift(newRecord);
  },


  // VENUES
  getVenues: () => venues,
  getVenuesByCountry: (country: Country) => {
    return MOCK_VENUES_BY_COUNTRY[country] || [];
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
  getReservations: () => reservations,
  getReservationsByVenueId: (venueId: string) => reservations.filter(r => r.venue.id === venueId),
  addReservation: (resData: Omit<Reservation, 'id'>) => {
    const newRes: Reservation = {
      ...resData,
      id: `res_${Date.now()}`
    };
    reservations.unshift(newRes);
    return newRes;
  },
  addFeedbackToReservation: (reservationId: string, feedback: Feedback) => {
      reservations = reservations.map(r => r.id === reservationId ? { ...r, feedback: feedback } : r);
      return reservations.find(r => r.id === reservationId);
  },


  // NOTIFICATIONS
  getNotifications: () => notifications,
  
  // PLANS
  getPlans: () => Object.values(PLANS),
};

export default db;