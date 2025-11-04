import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Venue, User } from '../types';
import CountrySelector, { Country } from '../components/CountrySelector';
import { StarIcon } from '../components/icons/StarIcon';
import { api } from '../services/api';
import AIConciergeModal from '../components/AIConciergeModal';
import { SparklesIcon } from '../components/icons/SparklesIcon';

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

interface HomeScreenProps {
  user: User;
  selectedCountry: Country;
  onCountryChange: (country: Country) => void;
  onVenueSelect: (venue: Venue) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, selectedCountry, onCountryChange, onVenueSelect }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isConciergeOpen, setConciergeOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const loadVenues = useCallback(async (country: Country, pageNum: number) => {
    setIsLoading(true);
    const { venues: newVenues, hasMore: newHasMore } = await api.getVenuesByCountry(country, pageNum, 10);
    if(newVenues) {
      setVenues(prev => pageNum === 1 ? newVenues : [...prev, ...newVenues]);
    }
    setHasMore(newHasMore);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setVenues([]);
    setPage(1);
    setHasMore(true);
    loadVenues(selectedCountry, 1);
  }, [selectedCountry, loadVenues]);


  const lastVenueElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (page > 1) {
        loadVenues(selectedCountry, page);
    }
  }, [page, selectedCountry, loadVenues])

  const handleCountryChange = (country: Country) => {
    if(country !== selectedCountry) {
        onCountryChange(country);
    }
  }

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
        <div className="my-6 p-5 bg-black border border-amber-400/30 rounded-2xl relative">
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

      {venues.length === 0 && !isLoading && !hasMore ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center p-4 bg-white/5 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Próximamente</h2>
            <p className="text-gray-400 max-w-md">Estamos trabajando para expandir ACCESS+ a {selectedCountry}. ¡Vuelve pronto!</p>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-2">
            <div className="flex justify-between items-center mb-2 px-2">
              <h2 className="font-bold text-lg">Locales Destacados</h2>
            </div>
            <div className="flex flex-col">
                {venues.map((venue, index) => (
                    <div ref={venues.length === index + 1 ? lastVenueElementRef : null} key={venue.id}>
                      <VenueListItem 
                        venue={venue} 
                        onSelect={() => onVenueSelect(venue)}
                      />
                    </div>
                ))}
            </div>
            {isLoading && <p className="text-center p-4 text-gray-400">Cargando más locales...</p>}
            {!hasMore && venues.length > 0 && <p className="text-center p-4 text-gray-500">Has llegado al final.</p>}
        </div>
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
    </>
  );
};

export default HomeScreen;
