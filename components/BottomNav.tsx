import React from 'react';
import { HomeIcon } from './icons/HomeIcon';
import { CardIcon } from './icons/CardIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { UserIcon } from './icons/UserIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface BottomNavProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-1/4 h-16 transition-colors duration-300 group ${isActive ? 'text-amber-400' : 'text-gray-500 hover:text-white'}`}
    aria-label={label}
  >
    <div className="relative">
      {icon}
    </div>
    <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 flex justify-center z-50 px-4">
      <div className="absolute bottom-8 z-10">
        <button
          onClick={() => setActiveScreen('card')}
          className={`w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center transition-transform duration-300 shadow-lg shadow-amber-500/30 ${activeScreen === 'card' ? 'scale-110 ring-4 ring-black' : 'hover:scale-110'}`}
          aria-label="Access Card"
        >
          <CardIcon className="w-9 h-9 text-black" />
        </button>
      </div>
      <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-around shadow-lg h-20 self-center p-2 w-full max-w-md relative">
        <div className="w-1/2 flex justify-around">
          <NavItem
            key="home"
            label="Access Club"
            icon={<HomeIcon />}
            isActive={activeScreen === 'home'}
            onClick={() => setActiveScreen('home')}
          />
          <NavItem
            key="reservations"
            label="Reservas"
            icon={<CalendarIcon />}
            isActive={activeScreen === 'reservations'}
            onClick={() => setActiveScreen('reservations')}
          />
        </div>
        <div className="w-20"></div> {/* Spacer for the central button */}
        <div className="w-1/2 flex justify-around">
           <NavItem
            key="ai-studio"
            label="AI Studio"
            icon={<SparklesIcon />}
            isActive={activeScreen === 'ai-studio'}
            onClick={() => setActiveScreen('ai-studio')}
          />
          <NavItem
            key="profile"
            label="Perfil"
            icon={<UserIcon />}
            isActive={activeScreen === 'profile'}
            onClick={() => setActiveScreen('profile')}
          />
        </div>
      </div>
    </div>
  );
};
