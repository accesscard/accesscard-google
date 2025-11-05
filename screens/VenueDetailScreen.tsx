
import React from 'react';
// FIX: Import PlanLevel to use in planColors record
import { Venue, PlanLevel } from '../types';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { MapPinIcon } from '../components/icons/MapPinIcon';

interface VenueDetailScreenProps {
    venue: Venue;
    onBack: () => void;
    onReserve: (venue: Venue) => void;
}

const planColors: Record<PlanLevel, string> = {
    [PlanLevel.Black]: 'text-white bg-gray-800',
    [PlanLevel.Gold]: 'text-black bg-amber-400',
    [PlanLevel.Silver]: 'text-white bg-gray-500',
};

const VenueDetailScreen: React.FC<VenueDetailScreenProps> = ({ venue, onBack, onReserve }) => {
    return (
        <div className="min-h-screen bg-[#121212] text-white animate-fade-in pb-24">
            <div className="relative h-64">
                <img src={venue.image} alt={venue.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                <button onClick={onBack} className="absolute top-6 left-6 bg-black/50 p-2 rounded-full text-white hover:bg-black/80 transition-colors z-10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="absolute bottom-0 left-0 p-6">
                    <h1 className="text-4xl font-bold tracking-tight">{venue.name}</h1>
                    <p className="text-lg text-gray-300">{venue.category} en {venue.location}</p>
                </div>
            </div>

            <div className="p-6">
                <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-300">
                        <MapPinIcon className="w-5 h-5 mr-3 flex-shrink-0 text-gray-400"/>
                        <span>{venue.address}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-amber-400">
                            <span className="font-bold text-xl">{venue.rating.toFixed(1)}</span>
                            <span>★</span>
                        </div>
                        <p className="text-gray-400 border-l border-gray-700 pl-4">{venue.description}</p>
                    </div>
                </div>


                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Beneficios ACCESS+</h2>
                    <div className="space-y-3">
                        {venue.benefits.map((benefit, index) => (
                            <div key={index} className="bg-[#1C1C1C] border border-white/10 p-4 rounded-lg flex items-center justify-between">
                                <p className="text-gray-200">{benefit.description}</p>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${planColors[benefit.planRequired]}`}>
                                    {benefit.planRequired}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-20">
                 <button 
                    onClick={() => onReserve(venue)}
                    className="w-full py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-xl hover:opacity-90 transition-all duration-300 shadow-lg shadow-amber-500/20 text-lg"
                 >
                    Reservar
                </button>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default VenueDetailScreen;
