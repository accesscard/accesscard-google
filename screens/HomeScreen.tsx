import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Venue, User } from '../types';
import CountrySelector, { Country } from '../components/CountrySelector';
import { StarIcon } from '../components/icons/StarIcon';
import { api } from '../services/api';
import AIConciergeModal from '../components/AIConciergeModal';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { ListIcon } from '../components/icons/ListIcon';
import { MapIcon } from '../components/icons/MapIcon';
import MapView from '../components/MapView';
import { XIcon } from '../components/icons/XIcon';
import { SearchIcon } from '../components/icons/SearchIcon';

const VenueListItem: React.FC<{ venue: Venue, onSelect: () => void; }> = ({ venue, onSelect }) => (
  <div className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
    <button onClick={onSelect} className="flex items-center gap-4 flex-grow text-left">
      <img src={venue.image} alt={venue.name} className="w-12 h-12 rounded-lg object-cover" />
      <div>
        <p className="font-bold text-white">{venue.name}</p>
        <p className="text-sm text-gray-400">{venue.category}</p>
      </div>
    </button>
    <div className="flex items-center gap-4">
      <div className="font-semibold text-white flex items-center gap-1">
        <StarIcon className="w-4 h-4 text-amber-400"/> 
        {venue.rating.toFixed(1)}
      </div>
    </div>
  </div>
);

const SelectedVenueCard: React.FC<{ venue: Venue; onSelect: (venue: Venue) => void; onClose: () => void; }> = ({ venue, onSelect, onClose }) => (
    <div className="fixed bottom-28 left-0 right-0 p-4 z-30 flex justify-center animate-slide-in-up">
        <div className="w-full max-w-md bg-[#1C1C1C] border border-white/10 rounded-2xl p-4 flex items-center space-x-4 shadow-lg shadow-black/50 relative">
             <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-white">
                <XIcon className="w-5 h-5" />
            </button>
            <img src={venue.image} alt={venue.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-grow">
                <p className="font-bold text-white">{venue.name}</p>
                <p className="text-sm text-gray-400">{venue.category}</p>
                 <div className="font-semibold text-white flex items-center gap-1 text-sm mt-1">
                    <StarIcon className="w-4 h-4 text-amber-400"/> 
                    {venue.rating.toFixed(1)}
                 </div>
            </div>
            <button
                onClick={() => onSelect(venue)}
                className="bg-amber-500 text-black font-bold px-4 py-2 rounded-lg text-sm hover:bg-amber-400"
            >
                Detalles
            </button>
        </div>
        <style>{`
            @keyframes slide-in-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
            .animate-slide-in-up { animation: slide-in-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        `}</style>
    </div>
);


interface HomeScreenProps {
  user: User;
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  onVenueSelect: (venue: Venue) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, selectedCountry, onCountryChange, onVenueSelect }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConciergeOpen, setConciergeOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedMapVenue, setSelectedMapVenue] = useState<Venue | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');


  const loadVenues = useCallback(async (country: Country) => {
    setIsLoading(true);
    setSelectedMapVenue(null);
    const venuesData = await api.getVenuesByCountry(country);
    setVenues(venuesData || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadVenues(selectedCountry);
  }, [selectedCountry, loadVenues]);

  const handleCountryChange = (country: Country) => {
    if(country !== selectedCountry) {
        setSearchTerm('');
        setActiveCategory('Todos');
        onCountryChange(country);
    }
  }
  
  const handleMapMarkerClick = (venue: Venue) => {
      setSelectedMapVenue(venue);
  }
  
  const handleSelectFromCard = (venue: Venue) => {
      onVenueSelect(venue);
      setSelectedMapVenue(null);
  }
  
  const categories: Array<Venue['category'] | 'Todos'> = ['Todos', 'Restaurante', 'Bar', 'Rooftop', 'Discoteca'];

  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      const matchesCategory = activeCategory === 'Todos' || venue.category === activeCategory;
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [venues, searchTerm, activeCategory]);

  return (
    <>
    {isConciergeOpen && <AIConciergeModal venues={venues} onClose={() => setConciergeOpen(false)} />}
    <div className="px-6 pt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{user.name}</h1>
        </div>
        <CountrySelector selectedCountry={selectedCountry} onCountryChange={handleCountryChange} />
      </div>
      
      {user.plan && (
        <div className="mb-6 p-5 bg-black border border-amber-400/30 rounded-2xl relative">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-white/70">Membresía</p>
                    <p className="text-xl font-bold text-amber-300">{user.plan.name}</p>
                </div>
                <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 to-amber-500"></div>
            </div>
            <div className="absolute inset-0 border-4 border-black rounded-2xl pointer-events-none"></div>
        </div>
      )}

       <div className="my-6 space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
            <input 
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1C1C1C] border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === category 
                  ? 'bg-amber-500 text-black' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

      <div className="mb-6 flex justify-center">
          <div className="bg-black/50 p-1 rounded-full flex items-center border border-white/10">
              <button
                  onClick={() => { setViewMode('list'); setSelectedMapVenue(null); }}
                  className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors w-28 ${viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                  <ListIcon className="w-5 h-5" />
                  Lista
              </button>
              <button
                  onClick={() => setViewMode('map')}
                  className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors w-28 ${viewMode === 'map' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                  <MapIcon className="w-5 h-5" />
                  Mapa
              </button>
          </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-48"><p className="text-gray-400">Cargando locales...</p></div>
      ) : filteredVenues.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center p-4 bg-white/5 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">{venues.length === 0 ? 'Próximamente' : 'Sin Resultados'}</h2>
            <p className="text-gray-400 max-w-md">
                {venues.length === 0
                    ? `Estamos trabajando para expandir ACCESS+ a ${selectedCountry}. ¡Vuelve pronto!`
                    : `No se encontraron locales que coincidan con tus filtros.`
                }
            </p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-2">
            <div className="flex justify-between items-center mb-2 px-2">
              <h2 className="font-bold text-lg">Locales Destacados</h2>
            </div>
            <div className="flex flex-col">
                {filteredVenues.map((venue) => (
                    <VenueListItem 
                        key={venue.id}
                        venue={venue} 
                        onSelect={() => onVenueSelect(venue)}
                    />
                ))}
            </div>
        </div>
      ) : (
          <MapView venues={filteredVenues} onMarkerClick={handleMapMarkerClick} country={selectedCountry}/>
      )}

      <div className="fixed bottom-28 right-6 z-40">
        <button 
            onClick={() => setConciergeOpen(true)}
            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white rounded-full p-4 shadow-lg shadow-purple-500/30 hover:opacity-90 transition-all transform hover:scale-110"
            aria-label="AI Concierge"
        >
          <SparklesIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
    {selectedMapVenue && <SelectedVenueCard venue={selectedMapVenue} onSelect={handleSelectFromCard} onClose={() => setSelectedMapVenue(null)} />}
    <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
    `}</style>
    </>
  );
};

export default HomeScreen;