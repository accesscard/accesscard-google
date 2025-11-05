import React, { useState, useEffect } from 'react';
import { User, Venue, Reservation } from '../types';
import { api } from '../services/api';
import { UsersIcon } from '../components/icons/UsersIcon';
import { CalendarIcon } from '../components/icons/CalendarIcon';
import { BuildingIcon } from '../components/icons/BuildingIcon';
import { StarIcon } from '../components/icons/StarIcon';

interface VenueDashboardScreenProps {
    user: User;
    onLogout: () => void;
}

const KpiCard: React.FC<{ icon: React.ReactNode, title: string, value: string | number, color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);


const VenueDashboardScreen: React.FC<VenueDashboardScreenProps> = ({ user, onLogout }) => {
    const [venue, setVenue] = useState<Venue | null>(null);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            if (user.venueId) {
                // In a real app, we'd fetch the venue details separately
                const allVenues = await api.getVenues();
                const myVenue = allVenues.find(v => v.id === user.venueId);
                setVenue(myVenue || null);
                
                const venueReservations = await api.getReservationsByVenueId(user.venueId);
                setReservations(venueReservations);
            }
        };
        fetchData();
    }, [user.venueId]);

    const statusClasses: Record<Reservation['status'], string> = {
      confirmada: 'bg-green-500/10 text-green-400',
      pendiente: 'bg-yellow-500/10 text-yellow-400',
      cancelada: 'bg-red-500/10 text-red-400',
      completada: 'bg-blue-500/10 text-blue-400',
    };

    if (!venue) {
        return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Cargando datos del comercio...</div>;
    }

    const pendingReservations = reservations.filter(r => r.status === 'pendiente').length;
    // This is a mock value for now
    const totalVisits = reservations.filter(r => r.status === 'completada').length * 3; 

    return (
        <div className="min-h-screen bg-[#121212] text-white p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{venue.name}</h1>
                    <p className="text-gray-400">Bienvenido, {user.name}.</p>
                </div>
                <button onClick={onLogout} className="py-2 px-4 border border-red-500/50 text-red-400 font-semibold rounded-lg hover:bg-red-500/10 transition-colors text-sm">
                    Cerrar Sesión
                </button>
            </header>
            
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
               <KpiCard icon={<UsersIcon className="w-6 h-6 text-blue-400"/>} title="Total Visitas (Mes)" value={totalVisits} color="bg-blue-500/10" />
               <KpiCard icon={<CalendarIcon className="w-6 h-6 text-yellow-400"/>} title="Reservas Pendientes" value={pendingReservations} color="bg-yellow-500/10" />
               <button 
                    onClick={() => alert('Próximamente: Editar ficha del comercio')} 
                    className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 flex items-center space-x-4 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 w-full text-left"
                >
                    <div className="p-3 rounded-lg bg-gray-500/10">
                        <BuildingIcon className="w-6 h-6 text-gray-300"/>
                    </div>
                    <p className="text-white font-semibold">Ficha del Comercio</p>
                </button>
                <button 
                    onClick={() => alert('Próximamente: Gestionar beneficios')} 
                    className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 flex items-center space-x-4 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 w-full text-left"
                >
                    <div className="p-3 rounded-lg bg-amber-500/10">
                         <StarIcon className="w-6 h-6 text-amber-400"/>
                    </div>
                    <p className="text-white font-semibold">Beneficios de Miembros</p>
                </button>
            </section>

            <main>
                <section className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">Gestión de Reservas</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-gray-400 uppercase tracking-wider text-xs">
                                <tr className="border-b border-white/10">
                                    <th className="p-4 font-semibold">Fecha</th>
                                    <th className="p-4 font-semibold">Hora</th>
                                    <th className="p-4 font-semibold">Personas</th>
                                    <th className="p-4 font-semibold">Estado</th>
                                    <th className="p-4 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-gray-300 whitespace-nowrap">{new Date(res.date).toLocaleDateString('es-ES')}</td>
                                        <td className="p-4 text-gray-300 whitespace-nowrap">{res.time}</td>
                                        <td className="p-4 text-gray-300 whitespace-nowrap">{res.partySize}</td>
                                        <td className="p-4 whitespace-nowrap">
                                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full capitalize ${statusClasses[res.status]}`}>{res.status}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {res.status === 'pendiente' && (
                                                <div className="flex gap-4 justify-end">
                                                    <button className="font-semibold text-green-400 hover:text-green-300 transition-colors">Aceptar</button>
                                                    <button className="font-semibold text-red-400 hover:text-red-300 transition-colors">Rechazar</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default VenueDashboardScreen;