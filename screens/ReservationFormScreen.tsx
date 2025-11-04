
import React, { useState, useMemo } from 'react';
import { Venue } from '../types';
import { XIcon } from '../components/icons/XIcon';
import { UsersIcon } from '../components/icons/UsersIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { CheckIcon } from '../components/icons/CheckIcon';

interface ReservationFormScreenProps {
  venue: Venue;
  onClose: () => void;
  onConfirm: (details: { date: string; time: string; partySize: number }) => void;
}

const ReservationFormScreen: React.FC<ReservationFormScreenProps> = ({ venue, onClose, onConfirm }) => {
  const [partySize, setPartySize] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const availableDates = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return date;
    });
  }, []);

  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    // Mock time slots
    return ['19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
  }, [selectedDate]);

  const canConfirm = partySize !== null && selectedDate !== null && selectedTime !== null;

  const handleConfirm = () => {
    if (canConfirm) {
        onConfirm({
            date: selectedDate.toISOString(),
            time: selectedTime,
            partySize: partySize,
        });
        setIsConfirmed(true);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };
  
  if (isConfirmed) {
      return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end">
            <div className="bg-[#05050D] border-t-2 border-green-500 rounded-t-2xl p-8 w-full max-w-lg mx-auto text-center animate-slide-in-up">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">¡Solicitud Enviada!</h2>
                <p className="text-gray-400 mt-2">Tu solicitud de reserva en {venue.name} ha sido enviada. Recibirás una notificación cuando sea confirmada.</p>
                <button onClick={onClose} className="mt-6 w-full py-3 bg-white/90 text-black font-bold rounded-lg hover:bg-white transition-all">
                    Entendido
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end">
      <div className="bg-[#05050D] border-t-2 border-amber-500 rounded-t-2xl p-6 w-full max-w-lg mx-auto max-h-[90vh] flex flex-col animate-slide-in-up">
        <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-white/10">
          <div>
             <h2 className="text-xl font-bold text-white">Reservar en {venue.name}</h2>
             <p className="text-sm text-gray-400">{venue.location}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white z-20"><XIcon /></button>
        </header>

        <div className="flex-grow overflow-y-auto py-6 space-y-6">
            {/* Party Size */}
            <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-3"><UsersIcon className="w-5 h-5 text-amber-400" /> ¿Cuántas personas?</h3>
                <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                        <button key={size} onClick={() => setPartySize(size)} className={`px-4 py-2 rounded-lg font-bold transition-colors ${partySize === size ? 'bg-amber-400 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* Date */}
            <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-3"><CalendarIcon className="w-5 h-5 text-amber-400" /> Elige una fecha</h3>
                <div className="flex overflow-x-auto space-x-3 pb-3 -mx-6 px-6 scrollbar-hide">
                    {availableDates.map(date => (
                        <button key={date.toISOString()} onClick={() => setSelectedDate(date)} className={`flex-shrink-0 text-center px-4 py-3 rounded-lg border transition-colors ${selectedDate?.toDateString() === date.toDateString() ? 'bg-amber-400 text-black border-amber-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}>
                            <p className="font-bold text-sm">{date.toLocaleDateString('es-ES', { weekday: 'short' })}</p>
                            <p className="text-2xl font-bold">{date.getDate()}</p>
                             <p className="text-xs opacity-80">{date.toLocaleDateString('es-ES', { month: 'short' })}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time */}
            {selectedDate && (
                <div className="animate-fade-in">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-3"><ClockIcon className="w-5 h-5 text-amber-400" /> Elige una hora</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {availableTimes.map(time => (
                           <button key={time} onClick={() => setSelectedTime(time)} className={`px-4 py-3 rounded-lg font-bold transition-colors text-center ${selectedTime === time ? 'bg-amber-400 text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <footer className="flex-shrink-0 pt-4 border-t border-white/10">
            <button 
                onClick={handleConfirm}
                disabled={!canConfirm}
                className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Confirmar Reserva
            </button>
        </footer>
      </div>
      <style>{`
        @keyframes slide-in-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-in-up { animation: slide-in-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ReservationFormScreen;
