
import React from 'react';
import { Venue } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { Country } from './CountrySelector';

interface MapViewProps {
  venues: Venue[];
  onMarkerClick: (venue: Venue) => void;
  country: Country;
}

const MapView: React.FC<MapViewProps> = ({ venues, onMarkerClick, country }) => {
  // Bounding box for our mock map areas
  const boundsByCountry: Record<Country, { latMin: number; latMax: number; lngMin: number; lngMax: number; }> = {
    'Chile': { latMin: -33.45, latMax: -33.38, lngMin: -70.65, lngMax: -70.55 },
    'Perú': { latMin: -12.15, latMax: -12.09, lngMin: -77.05, lngMax: -77.02 },
    'Argentina': { latMin: -34.62, latMax: -34.58, lngMin: -58.45, lngMax: -58.35 },
    'Colombia': { latMin: 4.6, latMax: 4.7, lngMin: -74.1, lngMax: -74.0 },
  };

  const bounds = boundsByCountry[country];

  const getPosition = (coords: { lat: number; lng: number }) => {
    const y = ((bounds.latMax - coords.lat) / (bounds.latMax - bounds.latMin)) * 100;
    const x = ((coords.lng - bounds.lngMin) / (bounds.lngMax - bounds.lngMin)) * 100;
    return { top: `${y}%`, left: `${x}%` };
  };

  return (
    <div className="relative w-full h-[60vh] bg-[#0D0D18] border border-gray-800 rounded-lg overflow-hidden">
      {/* Fake map background */}
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(107, 114, 128, 0.1)" strokeWidth="1"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="rgba(107, 114, 128, 0.3)" fontSize="14" fontFamily="Inter, sans-serif">
            Mapa de locaciones (simulado)
        </text>
      </svg>
      
      {venues.map(venue => {
        const position = getPosition(venue.coordinates);
        // Add a check to only render venues within the map bounds
        if (position.top < '0%' || position.top > '100%' || position.left < '0%' || position.left > '100%') {
          return null;
        }
        return (
          <button
            key={venue.id}
            onClick={() => onMarkerClick(venue)}
            className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center group"
            style={{ top: position.top, left: position.left }}
            aria-label={`Ver detalles de ${venue.name}`}
          >
            <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-black text-white text-xs rounded py-1 px-2">
              {venue.name}
            </div>
            <MapPinIcon className="w-8 h-8 text-amber-500 fill-amber-500/30 drop-shadow-lg transition-transform group-hover:scale-125" />
          </button>
        );
      })}
    </div>
  );
};

export default MapView;