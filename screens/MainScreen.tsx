
import React, { useState, useEffect } from 'react';
import { User, Venue, Reservation } from '../types';
import { BottomNav } from '../components/BottomNav';
import HomeScreen from './HomeScreen';
import CardScreen from './CardScreen';
import ReservationsScreen from './ReservationsScreen';
import ProfileScreen from './ProfileScreen';
import { Country } from '../components/CountrySelector';
import VenueDetailScreen from './VenueDetailScreen';
import ReservationFormScreen from './ReservationFormScreen';
import { api } from '../services/api';
import ImageEditorScreen from './ImageEditorScreen';

interface MainScreenProps {
  user: User;
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ user, onLogout, onUpdateUser }) => {
  const [activeScreen, setActiveScreen] = useState('home');
  const [selectedCountry, setSelectedCountry] = useState<Country>('Perú');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [venueToBook, setVenueToBook] = useState<Venue | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    // Fetch initial data for the user
    const fetchData = async () => {
      // In a real app, these would be user-specific
      const userReservations = await api.getReservations();
      setReservations(userReservations);
    };
    fetchData();
  }, []);

  const handleOpenReservationForm = (venue: Venue) => {
    setVenueToBook(venue);
  };
  
  const handleCloseReservationForm = () => {
    setVenueToBook(null);
  };

  const handleConfirmReservation = async (reservationDetails: Omit<Reservation, 'id' | 'venue' | 'status'>) => {
    if (venueToBook) {
        const newReservation = await api.createReservation({
            venue: venueToBook,
            ...reservationDetails,
            status: 'pendiente',
        });
        setReservations(prev => [newReservation, ...prev]);
        setVenueToBook(null);
        setActiveScreen('reservations');
    }
  };

  const handleUpdateReservation = (updatedReservation: Reservation) => {
    setReservations(prev => prev.map(r => r.id === updatedReservation.id ? updatedReservation : r));
  };

  const renderScreen = () => {
    if (selectedVenue) {
      return <VenueDetailScreen venue={selectedVenue} onBack={() => setSelectedVenue(null)} onReserve={handleOpenReservationForm}/>;
    }
    
    switch (activeScreen) {
      case 'home':
        return <HomeScreen user={user} selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} onVenueSelect={setSelectedVenue} />;
      case 'card':
        return <CardScreen user={user} />;
      case 'reservations':
        return <ReservationsScreen reservations={reservations} onUpdateReservation={handleUpdateReservation} />;
      case 'profile':
        return <ProfileScreen user={user} onLogout={onLogout} onUpdateUser={onUpdateUser} />;
      case 'ai-studio':
        return <ImageEditorScreen />;
      default:
        return <HomeScreen user={user} selectedCountry={selectedCountry} onCountryChange={setSelectedCountry} onVenueSelect={setSelectedVenue} />;
    }
  };

  const showBottomNav = !selectedVenue;
  const isCardScreen = activeScreen === 'card';

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className={showBottomNav ? 'pb-28' : ''}>
        <main className={isCardScreen ? 'h-screen flex flex-col' : ''}>
          {renderScreen()}
        </main>
        {showBottomNav && 
          <BottomNav 
            activeScreen={activeScreen} 
            setActiveScreen={setActiveScreen}
          />
        }
        {venueToBook && (
            <ReservationFormScreen
                venue={venueToBook}
                onClose={handleCloseReservationForm}
                onConfirm={handleConfirmReservation}
            />
        )}
      </div>
    </div>
  );
};

export default MainScreen;