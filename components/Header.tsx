import React, { useState, useEffect } from 'react';
import { User } from '../types';
import CountrySelector, { Country } from './CountrySelector';
import { AccessPlusLogo } from './icons/AccessPlusLogo';

interface HeaderProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedCountry, onCountryChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerClasses = `
    fixed top-0 left-0 right-0 z-40 transition-all duration-300
    ${isScrolled ? 'bg-black/60 backdrop-blur-xl shadow-2xl shadow-black/20' : 'bg-transparent'}
  `;

  return (
    <header className={headerClasses}>
      <div className="h-24 flex items-center justify-between px-6">
        <AccessPlusLogo className="h-6 text-white" />
        <div>
          <CountrySelector selectedCountry={selectedCountry} onCountryChange={onCountryChange} />
        </div>
      </div>
    </header>
  );
};

export default Header;