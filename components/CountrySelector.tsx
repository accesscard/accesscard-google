
import React, { useState, useRef, useEffect } from 'react';
import { ChileFlagIcon } from './icons/flags/ChileFlagIcon';
import { PeruFlagIcon } from './icons/flags/PeruFlagIcon';
import { ColombiaFlagIcon } from './icons/flags/ColombiaFlagIcon';
import { ArgentinaFlagIcon } from './icons/flags/ArgentinaFlagIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

export type Country = 'Chile' | 'Perú' | 'Colombia' | 'Argentina';

interface CountrySelectorProps {
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
}

const countries: Country[] = ['Chile', 'Perú', 'Colombia', 'Argentina'];

const countryFlags: Record<Country, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Chile: ChileFlagIcon,
  Perú: PeruFlagIcon,
  Colombia: ColombiaFlagIcon,
  Argentina: ArgentinaFlagIcon,
};

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onCountryChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const FlagIcon = countryFlags[selectedCountry];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const handleSelect = (country: Country) => {
    onCountryChange(country);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/20 rounded-full px-3 py-2 transition-colors"
      >
        <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
            <FlagIcon className="w-full h-full object-cover" />
        </div>
        <span className="hidden sm:inline">{selectedCountry}</span>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-[#1C1C1C] border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in-down">
            <ul>
                {countries.map((country) => {
                    const DropdownFlagIcon = countryFlags[country];
                    return (
                        <li key={country}>
                            <button 
                                onClick={() => handleSelect(country)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/10 transition-colors"
                            >
                                <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                                    <DropdownFlagIcon className="w-full h-full object-cover" />
                                </div>
                                <span>{country}</span>
                            </button>
                        </li>
                    )
                })}
            </ul>
        </div>
      )}
      <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default CountrySelector;