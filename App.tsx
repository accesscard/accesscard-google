
import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import { User } from './types';
import AdminScreen from './screens/AdminScreen';
import VenueDashboardScreen from './screens/VenueDashboardScreen';
import VenueRegistrationScreen from './screens/VenueRegistrationScreen';
import RegistrationFlowScreen from './screens/RegistrationFlowScreen';

type View = 'login' | 'registrationFlow' | 'app' | 'venueRegistration';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('app');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  }
  
  const renderContent = () => {
    if (view === 'venueRegistration') {
      return <VenueRegistrationScreen onRegistrationComplete={() => setView('login')} />;
    }

    if (view === 'registrationFlow') {
      return <RegistrationFlowScreen onRegistrationComplete={handleLogin} onBackToLogin={() => setView('login')} />;
    }

    if (!user) {
      return <LoginScreen onLogin={handleLogin} onRegisterVenue={() => setView('venueRegistration')} onStartRegistration={() => setView('registrationFlow')} />;
    }
    
    // If a user somehow exists but has no active subscription, force them to the flow.
    // This catches users who dropped off.
    if (user.role === 'user' && user.subscription_status !== 'active') {
      return <RegistrationFlowScreen onRegistrationComplete={handleLogin} onBackToLogin={() => setView('login')} />;
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