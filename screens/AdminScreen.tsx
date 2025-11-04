import React, { useState, useEffect, useCallback } from 'react';
import { User, Venue } from '../types';
import { api } from '../services/api';
import { UsersIcon } from '../components/icons/UsersIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { BuildingIcon } from '../components/icons/BuildingIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import Modal from '../components/Modal';
import CreateUserForm from './CreateUserForm';
import CreateVenueForm from './CreateVenueForm';

interface AdminScreenProps {
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

const AIAnalytics: React.FC<{ users: User[], venues: Venue[] }> = ({ users, venues }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleQuery = async () => {
        if (!query) return;
        setIsLoading(true);
        setResult('');
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const context = `
                CONTEXT:
                - Total Users: ${users.length}
                - Users Data (sample): ${JSON.stringify(users.slice(0, 5), null, 2)}
                - Total Venues: ${venues.length}
                - Venues Data (sample): ${JSON.stringify(venues.slice(0, 5), null, 2)}
            `;
            const fullPrompt = `${context}\n\nQUESTION: ${query}\n\nANALYSIS:`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: fullPrompt,
                config: {
                    thinkingConfig: { thinkingBudget: 32768 }
                }
            });

            setResult(response.text);

        } catch (e: any) {
            setError('Error al contactar la IA. Verifica la configuración.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-fuchsia-400"/>
                AI Analytics (Thinking Mode)
            </h2>
            <p className="text-sm text-gray-400 mb-4">Haz preguntas complejas sobre los datos de la plataforma. Ej: "Analiza el crecimiento de usuarios por plan y sugiere una estrategia de marketing."</p>
            <div className="space-y-4">
                <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Escribe tu pregunta aquí..."
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition-all"
                    rows={3}
                />
                <button onClick={handleQuery} disabled={isLoading || !query} className="w-full flex items-center justify-center gap-2 py-2 bg-fuchsia-600 text-white font-bold rounded-lg hover:bg-fuchsia-500 transition-all disabled:opacity-50">
                    {isLoading ? 'Pensando...' : 'Generar Análisis'}
                </button>
            </div>
            {result && <div className="mt-4 p-4 bg-black/30 rounded-lg whitespace-pre-wrap font-mono text-sm overflow-x-auto">{result}</div>}
            {error && <div className="mt-4 p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}
        </section>
    );
};

const AdminScreen: React.FC<AdminScreenProps> = ({ user, onLogout }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isCreateUserModalOpen, setCreateUserModalOpen] = useState(false);
    const [isCreateVenueModalOpen, setCreateVenueModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        const [usersData, venuesData] = await Promise.all([
            api.getUsers(),
            api.getVenues()
        ]);
        setUsers(usersData);
        setVenues(venuesData);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleToggleUserStatus = async (userId: string, currentStatus: 'activa' | 'inactiva') => {
        const newStatus = currentStatus === 'activa' ? 'inactiva' : 'activa';
        await api.updateUserStatus(userId, newStatus);
        fetchData(); // Refetch data to show changes
    };

    const handleVenueStatusChange = async (venueId: string, status: Venue['status']) => {
        await api.updateVenueStatus(venueId, status);
        fetchData();
    }
    
    const statusClasses: Record<User['cardStatus'], string> = {
        activa: 'bg-green-500/10 text-green-400',
        inactiva: 'bg-red-500/10 text-red-400',
    };
    
    const venueStatusClasses: Record<Venue['status'], string> = {
        aprobado: 'bg-green-500/10 text-green-400',
        pendiente: 'bg-yellow-500/10 text-yellow-400',
        suspendido: 'bg-red-500/10 text-red-400',
    };
    
    const getInitials = (name: string) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    
    const totalUsers = users.length;
    const activeMemberships = users.filter(u => u.cardStatus === 'activa' && u.role === 'user').length;
    const totalVenues = venues.length;
    const pendingVenues = venues.filter(v => v.status === 'pendiente').length;

    return (
        <div className="min-h-screen bg-[#121212] text-white p-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-400">Bienvenido, {user.name}.</p>
                </div>
                <button onClick={onLogout} className="py-2 px-4 border border-red-500/50 text-red-400 font-semibold rounded-lg hover:bg-red-500/10 transition-colors text-sm">
                    Cerrar Sesión
                </button>
            </header>
            
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KpiCard icon={<UsersIcon className="w-6 h-6 text-blue-400"/>} title="Total Usuarios" value={totalUsers} color="bg-blue-500/10" />
                <KpiCard icon={<CheckCircleIcon className="w-6 h-6 text-green-400"/>} title="Membresías Activas" value={activeMemberships} color="bg-green-500/10" />
                <KpiCard icon={<BuildingIcon className="w-6 h-6 text-purple-400"/>} title="Total Comercios" value={totalVenues} color="bg-purple-500/10" />
                <KpiCard icon={<ClockIcon className="w-6 h-6 text-yellow-400"/>} title="Pendientes" value={pendingVenues} color="bg-yellow-500/10" />
            </section>
            
            <AIAnalytics users={users} venues={venues} />

            <main className="grid grid-cols-1 gap-8 mt-8">
                <section className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
                        <button onClick={() => setCreateUserModalOpen(true)} className="py-2 px-4 bg-amber-500 text-black font-bold rounded-lg text-sm hover:bg-amber-400">Crear Usuario</button>
                    </div>
                    <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left table-auto">
                           <thead className="sticky top-0 bg-[#1C1C1C]">
                                <tr className="border-b border-white/10 text-gray-400">
                                    <th className="p-3 font-medium whitespace-nowrap">Usuario</th>
                                    <th className="p-3 font-medium whitespace-nowrap">Email</th>
                                    <th className="p-3 font-medium whitespace-nowrap">Plan</th>
                                    <th className="p-3 font-medium whitespace-nowrap">Expira</th>
                                    <th className="p-3 font-medium whitespace-nowrap">País</th>
                                    <th className="p-3 font-medium whitespace-nowrap">Teléfono</th>
                                    <th className="p-3 font-medium whitespace-nowrap">Estado</th>
                                    <th className="p-3 font-medium whitespace-nowrap text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.filter(u => u.role === 'user').map(u => (
                                    <tr key={u.id} className="hover:bg-white/5">
                                        <td className="p-3 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center font-bold text-xs">{getInitials(u.name)}</div>
                                                <span>{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 whitespace-nowrap text-gray-300">{u.email}</td>
                                        <td className="p-3 whitespace-nowrap">{u.plan?.name || 'N/A'}</td>
                                        <td className="p-3 whitespace-nowrap text-gray-300">{u.membershipExpires ? new Date(u.membershipExpires).toLocaleDateString() : 'N/A'}</td>
                                        <td className="p-3 whitespace-nowrap text-gray-300">{u.country || '-'}</td>
                                        <td className="p-3 whitespace-nowrap text-gray-300">{u.phone || '-'}</td>
                                        <td className="p-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusClasses[u.cardStatus]}`}>{u.cardStatus}</span>
                                        </td>
                                        <td className="p-3 whitespace-nowrap text-right">
                                            <button onClick={() => handleToggleUserStatus(u.id, u.cardStatus)} className="font-semibold text-amber-400 hover:text-amber-300">
                                                {u.cardStatus === 'activa' ? 'Desactivar' : 'Activar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Gestión de Comercios</h2>
                         <button onClick={() => setCreateVenueModalOpen(true)} className="py-2 px-4 bg-amber-500 text-black font-bold rounded-lg text-sm hover:bg-amber-400">Crear Comercio</button>
                    </div>
                     <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm text-left table-auto">
                            <thead className="sticky top-0 bg-[#1C1C1C]">
                                <tr className="border-b border-white/10 text-gray-400">
                                    <th className="p-3 font-medium whitespace-nowrap">Comercio</th>
                                    <th className="p-3 font-medium whitespace-nowrap">Categoría</th>
                                    <th className="p-3 font-medium whitespace-nowrap">Ubicación</th>
                                    <th className="p-3 font-medium whitespace-nowrap">Estado</th>
                                    <th className="p-3 font-medium whitespace-nowrap text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {venues.map(v => (
                                    <tr key={v.id} className="hover:bg-white/5">
                                        <td className="p-3 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <img src={v.image} alt={v.name} className="w-8 h-8 rounded-md object-cover"/>
                                                <span>{v.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 whitespace-nowrap text-gray-300">{v.category}</td>
                                        <td className="p-3 whitespace-nowrap text-gray-300">{v.location}</td>
                                        <td className="p-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${venueStatusClasses[v.status]}`}>{v.status}</span>
                                        </td>
                                        <td className="p-3 whitespace-nowrap text-right">
                                            {v.status === 'pendiente' && (
                                                <button onClick={() => handleVenueStatusChange(v.id, 'aprobado')} className="font-semibold text-green-400 hover:text-green-300">Aprobar</button>
                                            )}
                                            {v.status === 'aprobado' && (
                                                <button onClick={() => handleVenueStatusChange(v.id, 'suspendido')} className="font-semibold text-red-400 hover:text-red-300">Suspender</button>
                                            )}
                                            {v.status === 'suspendido' && (
                                                <button onClick={() => handleVenueStatusChange(v.id, 'aprobado')} className="font-semibold text-green-400 hover:text-green-300">Reactivar</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            
            {isCreateUserModalOpen && (
                <Modal title="Crear Nuevo Usuario" onClose={() => setCreateUserModalOpen(false)}>
                    <CreateUserForm
                        onUserCreated={() => {
                            setCreateUserModalOpen(false);
                            fetchData();
                        }}
                        onCancel={() => setCreateUserModalOpen(false)}
                    />
                </Modal>
            )}
            
            {isCreateVenueModalOpen && (
                <Modal title="Crear Nuevo Comercio" onClose={() => setCreateVenueModalOpen(false)}>
                    <CreateVenueForm
                        onVenueCreated={() => {
                            setCreateVenueModalOpen(false);
                            fetchData();
                        }}
                        onCancel={() => setCreateVenueModalOpen(false)}
                    />
                </Modal>
            )}
        </div>
    );
};

export default AdminScreen;
