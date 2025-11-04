import React, { useState, useEffect } from 'react';
import { User, Plan } from '../types';
import SubscriptionScreen from './SubscriptionScreen';
import { api } from '../services/api';
import PaymentHistoryScreen from './PaymentHistoryScreen';
import { ChevronRightIcon } from '../components/icons/ChevronRightIcon';

const ProfileInfoForm: React.FC<{ user: User; onUpdateUser: (user: User) => void }> = ({ user, onUpdateUser }) => {
    const [formData, setFormData] = useState({
        country: user.country || '',
        address: user.address || '',
        phone: user.phone || '',
        socialMedia: user.socialMedia || '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        setFormData({
            country: user.country || '',
            address: user.address || '',
            phone: user.phone || '',
            socialMedia: user.socialMedia || '',
        });
    }, [user]);

    const handleSave = async () => {
        setIsSaving(true);
        const updatedUser = await api.updateUserProfile(user.id, formData);
        if (updatedUser) {
            onUpdateUser(updatedUser);
        }
        setIsSaving(false);
        setIsEditing(false);
    };

    return (
        <div className="mt-6 bg-[#1C1C1C] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-lg font-semibold">Información Personal</h3>
                 {!isEditing && <button onClick={() => setIsEditing(true)} className="text-sm font-semibold text-amber-400">Editar</button>}
            </div>
            <div className="space-y-4 text-sm">
                {isEditing ? (
                    <>
                        <div>
                            <label className="text-xs text-gray-400">País</label>
                            <input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full mt-1 p-2 bg-white/5 rounded"/>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400">Dirección</label>
                            <input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full mt-1 p-2 bg-white/5 rounded"/>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400">Teléfono</label>
                            <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full mt-1 p-2 bg-white/5 rounded"/>
                        </div>
                         <div>
                            <label className="text-xs text-gray-400">Red Social (ej. @usuario)</label>
                            <input value={formData.socialMedia} onChange={e => setFormData({...formData, socialMedia: e.target.value})} className="w-full mt-1 p-2 bg-white/5 rounded"/>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setIsEditing(false)} className="w-full py-2 bg-white/10 rounded-lg">Cancelar</button>
                            <button onClick={handleSave} disabled={isSaving} className="w-full py-2 bg-amber-500 text-black font-bold rounded-lg disabled:opacity-50">{isSaving ? 'Guardando...' : 'Guardar'}</button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-between"><span className="text-gray-400">País:</span><span className="font-semibold">{user.country || 'No especificado'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Dirección:</span><span className="font-semibold">{user.address || 'No especificado'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Teléfono:</span><span className="font-semibold">{user.phone || 'No especificado'}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Red Social:</span><span className="font-semibold">{user.socialMedia || 'No especificado'}</span></div>
                    </>
                )}
            </div>
        </div>
    );
};


const ProfileScreen: React.FC<{ user: User; onLogout: () => void, onUpdateUser: (user: User) => void; }> = ({ user, onLogout, onUpdateUser }) => {
    const [activeModal, setActiveModal] = useState<'subscription' | 'payments' | null>(null);
    
    const handlePlanSelected = (updatedUser: User) => {
        onUpdateUser(updatedUser);
        setActiveModal(null);
    };

    return (
        <div className="p-6 pt-16 text-white">
            {activeModal === 'subscription' && user.plan && (
                <SubscriptionScreen
                    user={user}
                    onClose={() => setActiveModal(null)}
                    onSubscriptionComplete={handlePlanSelected}
                    isOnboarding={false}
                />
            )}
            {activeModal === 'payments' && (
                <PaymentHistoryScreen
                    userId={user.id}
                    onClose={() => setActiveModal(null)}
                />
            )}
            
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center mb-4 ring-4 ring-white/10">
                    <span className="text-4xl font-bold text-white">{user.name.charAt(0)}</span>
                </div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
            </div>
            
            <div className="mt-8 bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 shadow-lg shadow-black/20">
                <h3 className="text-lg font-semibold mb-4">Detalles de Membresía</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Plan Actual:</span>
                        <span className={`font-semibold text-amber-300`}>{user.plan?.name || 'N/A'}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Miembro desde:</span>
                        <span className="font-semibold">{user.memberSince}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Expira el:</span>
                        <span className="font-semibold">{user.membershipExpires ? new Date(user.membershipExpires).toLocaleDateString() : 'N/A'}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Estado:</span>
                        <span className="font-semibold text-green-400 capitalize">{user.cardStatus}</span>
                    </div>
                </div>
                <button 
                    onClick={() => setActiveModal('subscription')}
                    className="mt-6 w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-amber-500/20"
                >
                    Cambiar de Plan
                </button>
            </div>

            <ProfileInfoForm user={user} onUpdateUser={onUpdateUser} />
            
             <div className="mt-6 bg-[#1C1C1C] border border-white/10 rounded-2xl p-2">
                <button onClick={() => setActiveModal('payments')} className="w-full flex justify-between items-center font-medium text-gray-300 hover:text-white p-3 rounded-lg hover:bg-white/10">
                    <span>Historial de Pagos</span>
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
                 <div className="h-px bg-white/10"></div>
                <button className="w-full flex justify-between items-center font-medium text-gray-300 hover:text-white p-3 rounded-lg hover:bg-white/10">
                    <span>Soporte</span>
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
             </div>
            
            <div className="mt-8">
                 <button onClick={onLogout} className="w-full py-3 border border-red-500/50 text-red-400 font-semibold rounded-lg hover:bg-red-500/10 transition-colors">
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default ProfileScreen;
