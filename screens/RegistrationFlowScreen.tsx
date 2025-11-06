import React, { useState, useMemo, useEffect } from 'react';
import { User, MembershipTier, AccessLevel, CardCategory } from '../types';
import { api } from '../services/api';
import { CheckIcon } from '../components/icons/CheckIcon';
import { CreditCardIcon } from '../components/icons/CreditCardIcon';
import { IdCardIcon } from '../components/icons/IdCardIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { QrCode } from '../components/QrCode';

interface RegistrationFlowScreenProps {
    onRegistrationComplete: (user: User) => void;
    onBackToLogin: () => void;
}

const ProgressIndicator: React.FC<{ currentStep: number; totalSteps: number; }> = ({ currentStep, totalSteps }) => (
    <div className="flex items-center justify-center space-x-2 my-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className={`h-1.5 rounded-full transition-all duration-300 ${index < currentStep ? 'bg-amber-400 w-12' : 'bg-white/10 w-6'}`}></div>
        ))}
    </div>
);

const RegistrationFlowScreen: React.FC<RegistrationFlowScreenProps> = ({ onRegistrationComplete, onBackToLogin }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // User data
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', country: '', city: '', document_id: '', birthdate: '', password: ''
    });
    const [cardBin, setCardBin] = useState('');
    const [cardCategory, setCardCategory] = useState<CardCategory | null>(null);
    const [selectedTier, setSelectedTier] = useState<MembershipTier | null>(null);
    const [planType, setPlanType] = useState<'monthly' | 'annual'>('annual');
    const [allTiers, setAllTiers] = useState<Record<AccessLevel, MembershipTier> | null>(null);

    useEffect(() => {
        const fetchTiers = async () => {
            if (step === 4 && !allTiers) {
                setIsLoading(true);
                const tiers = await api.getMembershipTiersObject();
                setAllTiers(tiers);
                setIsLoading(false);
            }
        };
        fetchTiers();
    }, [step, allTiers]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleStep1Submit = async () => {
        setIsLoading(true);
        setError('');
        try {
            const newUser = await api.registerUser(formData);
            setUser(newUser);
            setStep(2);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleStep2Submit = () => { // OTP verification (mock)
        setStep(3);
    };

    const handleStep3Submit = async () => { // Card validation
        setIsLoading(true);
        setError('');
        try {
            const result = await api.validateCardBIN(cardBin.substring(0, 6));
            if (result.status === 'success') {
                setCardCategory(result.category);
                setStep(4);
            } else {
                setError(result.message);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleStep4Submit = async () => { // Subscription
        if (!user || !selectedTier || !cardCategory) return;
        setIsLoading(true);
        setError('');
        try {
            const activatedUser = await api.activateSubscription(user.id, selectedTier, cardCategory);
            if (activatedUser) {
                setUser(activatedUser);
                setStep(5);
            } else {
                throw new Error("Payment rejected: Your membership cannot be activated. Check your card or try again later.");
            }
        } catch(e: any) {
             setError(e.message);
        } finally {
            setIsLoading(false);
        }
    }
    
    const eligibleTiers = useMemo((): MembershipTier[] => {
        if (!cardCategory || !allTiers) return [];
        switch(cardCategory) {
            case 'Premium': return [allTiers.Silver, allTiers.Gold];
            case 'High-End': return [allTiers.Gold, allTiers.VIP];
            case 'Ultra High-End': return [allTiers.VIP];
            default: return [];
        }
    }, [cardCategory, allTiers]);

    const renderStepContent = () => {
        switch (step) {
            case 1: // Account Creation
                return (
                    <div className="space-y-4">
                        <input name="name" value={formData.name} onChange={handleFormChange} placeholder="Nombre Completo" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg" />
                        <input name="email" type="email" value={formData.email} onChange={handleFormChange} placeholder="Email" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg" />
                        <input name="password" type="password" value={formData.password} onChange={handleFormChange} placeholder="Contraseña" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg" />
                        <input name="phone" type="tel" value={formData.phone} onChange={handleFormChange} placeholder="Teléfono" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg" />
                        <div className="flex gap-4"><input name="country" value={formData.country} onChange={handleFormChange} placeholder="País" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg" /><input name="city" value={formData.city} onChange={handleFormChange} placeholder="Ciudad" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg" /></div>
                        <div className="flex gap-4"><input name="document_id" value={formData.document_id} onChange={handleFormChange} placeholder="Nº de Documento (DNI/RUT)" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg" /><input name="birthdate" type="date" value={formData.birthdate} onChange={handleFormChange} placeholder="Fecha de Nacimiento" className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg" /></div>
                        <button onClick={handleStep1Submit} disabled={isLoading} className="w-full mt-4 py-3 bg-[#FFFEF3] text-black font-bold rounded-lg disabled:opacity-50">{isLoading ? 'Creando...' : 'Crear Cuenta'}</button>
                    </div>
                );
            case 2: // OTP Verification
                return (
                    <div className="text-center space-y-4">
                        <p>Hemos enviado un código de verificación a <span className="font-bold">{formData.email}</span>.</p>
                        <input placeholder="Ingresa el código OTP (simulado)" className="w-full text-center tracking-[0.5em] px-4 py-3 bg-white/5 border border-white/20 rounded-lg" />
                        <button onClick={handleStep2Submit} className="w-full mt-4 py-3 bg-[#FFFEF3] text-black font-bold rounded-lg">Verificar Email</button>
                    </div>
                );
            case 3: // Card Validation
                return (
                     <div className="text-center space-y-4">
                        <p className="text-white/80">“Your access is defined by your card category. Not by your bank.”</p>
                        <div className="relative">
                            <CreditCardIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input value={cardBin} onChange={e => setCardBin(e.target.value)} placeholder="Número de Tarjeta" className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg" />
                        </div>
                        <button onClick={handleStep3Submit} disabled={isLoading || cardBin.length < 6} className="w-full mt-4 py-3 bg-[#FFFEF3] text-black font-bold rounded-lg disabled:opacity-50">{isLoading ? 'Validando...' : 'Validar Tarjeta'}</button>
                    </div>
                );
            case 4: // Membership Selection
                return (
                    <div className="space-y-6">
                        <p className="text-center text-white/80">“The privilege is in the membership.”</p>
                        {isLoading && <div className="text-center">Cargando membresías...</div>}
                        {allTiers && (
                            <div className={`grid grid-cols-1 ${eligibleTiers.length > 1 ? 'md:grid-cols-2' : ''} gap-6`}>
                                {eligibleTiers.map(tier => (
                                    <button key={tier.level} onClick={() => setSelectedTier(tier)} className={`p-6 border-2 rounded-xl text-left transition-all ${selectedTier?.level === tier.level ? 'border-amber-400 bg-white/5' : 'border-white/20'}`}>
                                        <h3 className="text-xl font-bold">{tier.name}</h3>
                                        <p className="text-3xl font-black my-2">${planType === 'monthly' ? tier.priceMonthly : tier.priceAnnual}<span className="text-base font-normal text-gray-400">/{planType === 'monthly' ? 'mes' : 'año'}</span></p>
                                        <ul className="space-y-1 text-sm text-gray-300">
                                            {tier.features.map((f, i) => <li key={i} className="flex items-center gap-2"><CheckIcon className="w-4 h-4 text-green-500"/>{f}</li>)}
                                        </ul>
                                    </button>
                                ))}
                            </div>
                        )}
                        <button onClick={handleStep4Submit} disabled={isLoading || !selectedTier} className="w-full mt-4 py-3 bg-amber-500 text-black font-bold rounded-lg disabled:opacity-50">{isLoading ? 'Procesando Pago...' : 'Activar Membresía'}</button>
                    </div>
                );
            case 5: // Success
                 if (!user) return null;
                 return (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold">¡Bienvenido a ACCESS+, {user.name}!</h2>
                        <p className="text-white/80 mt-2 mb-8">Tu membresía <span className="font-bold text-amber-400">{user.access_level}</span> está activa.</p>
                        <div className="relative w-full max-w-sm mx-auto aspect-[85.6/53.98] rounded-2xl p-6 flex flex-col justify-between shadow-2xl bg-black text-white overflow-hidden" style={{ background: 'linear-gradient(145deg, #111111, #2C2C2C)' }}>
                             <div className="flex justify-between items-start">
                               <p className="text-xl font-black tracking-tighter">ACCESS+</p>
                               <div className="w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 to-amber-500"></div>
                             </div>
                             <div className="bg-white p-1 rounded-sm shadow-lg self-center">
                                 <QrCode value={user.wallet_qr || ''} />
                             </div>
                             <div className="text-left">
                               <p className="text-sm font-semibold uppercase">{user.name}</p>
                               <p className="text-lg font-bold text-amber-300">{user.access_level}</p>
                             </div>
                        </div>
                        <button onClick={() => onRegistrationComplete(user)} className="w-full mt-8 py-3 bg-[#FFFEF3] text-black font-bold rounded-lg">Ingresar al Club</button>
                    </div>
                 );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#01010C] text-[#FFFEF3] flex flex-col p-6">
            <header className="flex-shrink-0">
                 <button onClick={onBackToLogin} className="text-sm text-gray-400 hover:text-white flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Volver a Login</button>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-lg">
                    <h1 className="text-4xl font-bold text-center">ACCESS+</h1>
                    <ProgressIndicator currentStep={step} totalSteps={5} />
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-8">
                        {renderStepContent()}
                        {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegistrationFlowScreen;