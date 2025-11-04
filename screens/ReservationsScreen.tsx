
import React, { useState } from 'react';
import { Reservation } from '../types';
import { PlusIcon } from '../components/icons/PlusIcon';
import FeedbackModal from '../components/FeedbackModal';
import { api } from '../services/api';


const ReservationCard: React.FC<{ reservation: Reservation; onLeaveFeedback: () => void; }> = ({ reservation, onLeaveFeedback }) => {
  const statusColors = {
    confirmada: 'bg-green-500/10 text-green-400 border-green-500/20',
    pendiente: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    cancelada: 'bg-red-500/10 text-red-400 border-red-500/20',
    completada: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  const isPast = new Date(reservation.date) < new Date();
  const dateFormatted = new Date(reservation.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
  const status = isPast && reservation.status === 'confirmada' ? 'completada' : reservation.status;

  return (
    <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-4 flex flex-col space-y-4 shadow-lg shadow-black/20">
       <div className="flex items-start space-x-4">
        <img src={reservation.venue.image} alt={reservation.venue.name} className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
            <h3 className="font-bold text-lg text-white">{reservation.venue.name}</h3>
            <p className="text-sm text-gray-300">{dateFormatted} - {reservation.time}</p>
            <p className="text-sm text-gray-400 mt-1">{reservation.partySize} personas</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[status]} capitalize`}>
            {status}
        </div>
      </div>
      {status === 'completada' && (
        <div className="border-t border-white/10 pt-4">
          {reservation.feedback ? (
            <div className="text-sm text-gray-400">
                <p>Tu feedback: <span className="text-amber-400">{'★'.repeat(reservation.feedback.rating)}{'☆'.repeat(5 - reservation.feedback.rating)}</span></p>
                {reservation.feedback.comment && <p className="mt-1 italic">"{reservation.feedback.comment}"</p>}
            </div>
          ) : (
            <button onClick={onLeaveFeedback} className="w-full text-center text-sm font-semibold text-amber-400 hover:text-amber-300">
                Dejar Feedback
            </button>
          )}
        </div>
      )}
    </div>
  );
};


const ReservationsScreen: React.FC<{ reservations: Reservation[]; onUpdateReservation: (res: Reservation) => void }> = ({ reservations, onUpdateReservation }) => {
  const [feedbackModalOpenFor, setFeedbackModalOpenFor] = useState<Reservation | null>(null);
  
  const upcomingReservations = reservations
    .filter(r => new Date(r.date) >= new Date())
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  const pastReservations = reservations
    .filter(r => new Date(r.date) < new Date())
    .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleFeedbackSubmit = async (rating: number, comment: string) => {
      if (feedbackModalOpenFor) {
          const updatedReservation = await api.submitFeedback(feedbackModalOpenFor.id, { rating, comment });
          if(updatedReservation) {
            onUpdateReservation(updatedReservation);
          }
          setFeedbackModalOpenFor(null);
      }
  };

  return (
    <>
    {feedbackModalOpenFor && (
        <FeedbackModal
            venueName={feedbackModalOpenFor.venue.name}
            onClose={() => setFeedbackModalOpenFor(null)}
            onSubmit={handleFeedbackSubmit}
        />
    )}
    <div className="p-6 pt-16 text-white">
      <h1 className="text-3xl font-bold">Mis Reservas</h1>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">Próximas</h2>
        {upcomingReservations.length > 0 ? (
          <div className="space-y-4">
             {upcomingReservations.map(res => (
              <ReservationCard key={res.id} reservation={res} onLeaveFeedback={() => setFeedbackModalOpenFor(res)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-[#1C1C1C] border border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-400">No tienes reservas próximas.</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-300 mb-4">Pasadas</h2>
         {pastReservations.length > 0 ? (
            <div className="space-y-4">
                {pastReservations.map(res => (
                    <ReservationCard key={res.id} reservation={res} onLeaveFeedback={() => setFeedbackModalOpenFor(res)} />
                ))}
            </div>
         ) : (
            <div className="text-center py-12 bg-[#1C1C1C] border border-dashed border-white/10 rounded-2xl">
                <p className="text-gray-400">No tienes reservas pasadas.</p>
            </div>
         )}
      </div>
       <div className="fixed bottom-28 right-6 z-40">
        <button className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black rounded-full p-4 shadow-lg shadow-amber-500/30 hover:opacity-90 transition-all transform hover:scale-110">
          <PlusIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
    </>
  );
};

export default ReservationsScreen;
