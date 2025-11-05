
import React, { useState } from 'react';
import { api } from '../services/api';
// FIX: Import PlanLevel for use in form state and select options
import { PlanLevel } from '../types';

interface CreateUserFormProps {
    onUserCreated: () => void;
    onCancel: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onUserCreated, onCancel }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [plan, setPlan] = useState<PlanLevel>(PlanLevel.Silver);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await api.createUser({ name, email, password, plan });
            onUserCreated();
        } catch (err: any) {
            setError(err.message || 'Error al crear el usuario.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-400">Nombre Completo</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-400">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-400">Contraseña</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-400">Plan</label>
                <select value={plan} onChange={e => setPlan(e.target.value as PlanLevel)} className="w-full mt-1 px-4 py-2 bg-[#1C1C1C] border border-white/10 rounded-lg text-white">
                    <option value={PlanLevel.Silver}>Silver</option>
                    <option value={PlanLevel.Gold}>Gold</option>
                    <option value={PlanLevel.Black}>Black</option>
                </select>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <footer className="flex-shrink-0 pt-4 flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="py-2 px-4 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:bg-gray-800">Cancelar</button>
                <button type="submit" disabled={isLoading} className="py-2 px-4 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 disabled:opacity-50">
                    {isLoading ? 'Creando...' : 'Crear Usuario'}
                </button>
            </footer>
        </form>
    );
};

export default CreateUserForm;
