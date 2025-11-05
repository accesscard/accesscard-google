
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

const VenueCard: React.FC<{ venue: Venue, onSelect: () => void, style?: React.CSSProperties }> = ({ venue, onSelect, style }) => (
  <div 
    className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group cursor-pointer animate-fade-in-stagger"
    onClick={onSelect}
    style={style}
  >
    <div className="relative h-40">
      <img src={venue.image} alt={venue.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div className="absolute bottom-3 left-4 text-white">
        <h3 className="font-bold text-lg">{venue.name}</h3>
        <p className="text-sm text-gray-300">{venue.location}</p>
      </div>
      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-bold text-white flex items-center gap-1">
        <StarIcon className="w-3 h-3 text-amber-400"/> 
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

const FeaturedCarouselCard: React.FC<{ venue: Venue; onSelect: (venue: Venue) => void; }> = ({ venue, onSelect }) => (
  <div onClick={() => onSelect(venue)} className="relative w-full h-48 rounded-2xl overflow-hidden cursor-pointer group">
    <img src={venue.image} alt={venue.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-4">
      <p className="text-xs font-bold uppercase text-amber-400">Destacado</p>
      <h3 className="text-xl font-bold text-white">{venue.name}</h3>
      <p className="text-sm text-gray-300">{venue.location}</p>
    </div>
  </div>
);

const HorizontalVenueCard: React.FC<{ venue: Venue; onSelect: (venue: Venue) => void; }> = ({ venue, onSelect }) => (
  <div onClick={() => onSelect(venue)} className="flex-shrink-0 w-40 space-y-2 group cursor-pointer">
    <img src={venue.image} alt={venue.name} className="w-full h-24 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105" />
    <div>
      <p className="font-semibold text-sm text-white truncate">{venue.name}</p>
      <p className="text-xs text-gray-400">{venue.category}</p>
    </div>
  </div>
);

const HorizontalVenueList: React.FC<{ title: string; venues: Venue[]; onSelect: (venue: Venue) => void; }> = ({ title, venues, onSelect }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
    <div className="flex space-x-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
      {venues.map(venue => <HorizontalVenueCard key={venue.id} venue={venue} onSelect={onSelect} />)}
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

  const featuredVenues = useMemo(() => {
    if (venues.length === 0) return [];
    return [...venues].sort((a, b) => b.rating - a.rating).slice(0, 3);
  }, [venues]);

  const newVenues = useMemo(() => venues.slice(0, 5), [venues]);
  const rooftopVenues = useMemo(() => venues.filter(v => v.category === 'Rooftop').slice(0, 5), [venues]);

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
      
      <div className="mb-6 flex justify-center">
          <div className="bg-black/50 p-1 rounded-full flex items-center border border-white/10">
              <button
                  onClick={() => { setViewMode('list'); setSelectedMapVenue(null); }}
                  className={`flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors w-28 ${viewMode === 'list' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'}`}
              >
                  <ListIcon className="w-5 h-5" />
                  Feed
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
      ) : venues.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-center p-4 bg-white/5 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Próximamente</h2>
            <p className="text-gray-400 max-w-md">
                {`Estamos trabajando para expandir ACCESS+ a ${selectedCountry}. ¡Vuelve pronto!`}
            </p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="animate-fade-in-slow">
            {featuredVenues.length > 0 && (
              <div className="flex space-x-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory mb-8">
                {featuredVenues.map((venue, index) => (
                  <div key={venue.id} className="w-5/6 sm:w-2/3 flex-shrink-0 snap-center animate-fade-in-stagger" style={{animationDelay: `${index * 100}ms`, opacity: 0}}>
                     <FeaturedCarouselCard venue={venue} onSelect={onVenueSelect} />
                  </div>
                ))}
              </div>
            )}

            {newVenues.length > 0 && <HorizontalVenueList title={`Nuevos en ${selectedCountry}`} venues={newVenues} onSelect={onVenueSelect} />}
            {rooftopVenues.length > 0 && <HorizontalVenueList title="Rooftops con Vistas" venues={rooftopVenues} onSelect={onVenueSelect} />}
            
            <div className="my-8 space-y-4">
              <h2 className="text-xl font-bold text-white">Explorar Todo</h2>
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

            {filteredVenues.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {filteredVenues.map((venue, index) => (
                        <VenueCard 
                            key={venue.id}
                            venue={venue} 
                            onSelect={() => onVenueSelect(venue)}
                            style={{ animationDelay: `${index * 80}ms`, opacity: 0 }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white/5 rounded-2xl">
                    <p className="text-gray-400">No se encontraron locales.</p>
                </div>
            )}
        </div>
      ) : (
          <MapView venues={venues} onMarkerClick={handleMapMarkerClick} country={selectedCountry}/>
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
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .snap-x { scroll-snap-type: x mandatory; }
        .snap-center { scroll-snap-align: center; }

        @keyframes fadeInStagger { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in-stagger { 
          animation: fadeInStagger 0.5s ease-out forwards; 
        }

        @keyframes fadeInSlow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-slow {
          animation: fadeInSlow 0.5s ease-in-out forwards;
        }
    `}</style>
    </>
  );
};

export default HomeScreen;
