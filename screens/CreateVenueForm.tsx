import React, { useState } from 'react';
import { api } from '../services/api';
import { Venue } from '../types';

interface CreateVenueFormProps {
    onVenueCreated: () => void;
    onCancel: () => void;
}

const CreateVenueForm: React.FC<CreateVenueFormProps> = ({ onVenueCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState<Venue['category']>('Restaurante');
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !location || !address) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await api.createVenue({ name, category, location, address, image: `https://picsum.photos/seed/${name.toLowerCase()}/400/400`, description: 'Nuevo local agregado por admin.' });
            onVenueCreated();
        } catch (err: any) {
            setError(err.message || 'Error al crear el comercio.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="text-sm font-medium text-gray-400">Nombre del Comercio</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
            </div>
             <div>
                <label className="text-sm font-medium text-gray-400">Categoría</label>
                <select value={category} onChange={e => setCategory(e.target.value as Venue['category'])} className="w-full mt-1 px-4 py-2 bg-[#1C1C1C] border border-white/10 rounded-lg text-white">
                    <option>Restaurante</option>
                    <option>Bar</option>
                    <option>Rooftop</option>
                    <option>Discoteca</option>
                </select>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-400">Ubicación (Ciudad)</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-400">Dirección</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <footer className="flex-shrink-0 pt-4 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="py-2 px-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800">Cancelar</button>
                <button type="submit" disabled={isLoading} className="py-2 px-4 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 disabled:opacity-50">
                    {isLoading ? 'Creando...' : 'Crear Comercio'}
                </button>
            </footer>
        </form>
    );
};

export default CreateVenueForm;
