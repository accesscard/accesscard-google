
import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import { User } from './types';
import AdminScreen from './screens/AdminScreen';
import VenueDashboardScreen from './screens/VenueDashboardScreen';
import VenueRegistrationScreen from './screens/VenueRegistrationScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';

type View = 'login' | 'app' | 'venueRegistration';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    // After a successful login, always switch to the main app view.
    // The renderContent function will then route to the correct screen based on the user's role and state.
    setView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  }

  const handleSubscriptionComplete = (subscribedUser: User) => {
    setUser(subscribedUser);
    setView('app'); // Now unlock the app
  }

  const renderContent = () => {
    if (view === 'venueRegistration') {
      return <VenueRegistrationScreen onRegistrationComplete={() => setView('login')} />;
    }

    if (!user || view === 'login') {
      return <LoginScreen onLogin={handleLogin} onRegisterVenue={() => setView('venueRegistration')} />;
    }

    // New User Onboarding Flow: Force subscription if no plan exists.
    if (user.role === 'user' && !user.plan) {
        return <SubscriptionScreen 
            user={user} 
            onSubscriptionComplete={handleSubscriptionComplete}
            isOnboarding={true}
        />
    }
    
    switch (user.role) {
      case 'admin':
        return <AdminScreen user={user} onLogout={handleLogout} />;
      case 'venue':
        return <VenueDashboardScreen user={user} onLogout={handleLogout} />;
      case 'user':
      default:
        return <MainScreen user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
    }
  }

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default App;
