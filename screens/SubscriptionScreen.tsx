

import React, { useState, useMemo, useEffect } from 'react';
import { User, Plan, PlanLevel, AccessLevel, MembershipTier } from '../types';
import { XIcon } from '../components/icons/XIcon';
import { CheckIcon } from '../components/icons/CheckIcon';
import { CreditCardIcon } from '../components/icons/CreditCardIcon';
import { api } from '../services/api';


interface SubscriptionScreenProps {
    user: User;
    onClose?: () => void; // Optional for modal view
    onSubscriptionComplete: (user: User) => void;
    isOnboarding: boolean;
}

const PlanCard: React.FC<{ plan: Plan; isCurrent: boolean; onSelect: () => void; }> = ({ plan, isCurrent, onSelect }) => (
    <div 
        onClick={onSelect}
        className={`relative border-2 rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer bg-gradient-to-br from-[#1A1A2E] to-[#10101F]
            ${isCurrent ? 'border-gray-500 opacity-70' : 'border-gray-700 hover:border-amber-500 hover:scale-105'}`}
    >
        {isCurrent && <div className="absolute top-3 right-3 text-xs bg-gray-600 text-white font-semibold px-2 py-1 rounded-full">Actual</div>}
        <h3 className={`text-2xl font-bold ${plan.level === AccessLevel.Gold ? 'text-yellow-400' : plan.level === AccessLevel.VIP ? 'text-white' : 'text-gray-400'}`}>{plan.name}</h3>
        <p className="text-4xl font-black my-4">${plan.priceAnnual}<span className="text-lg font-normal text-gray-400">/año</span></p>
        <ul className="space-y-2 text-gray-300 text-sm mb-6 min-h-[100px] text-left">
            {plan.features.map((feature, i) => <li key={i} className="flex items-start gap-2"><CheckIcon className="w-4 h-4 mt-1 text-green-500 flex-shrink-0"/><span>{feature}</span></li>)}
        </ul>
        <button className="w-full py-2 bg-white/90 text-black font-bold rounded-lg">{isCurrent ? 'Tu Plan Actual' : 'Seleccionar'}</button>
    </div>
);


const PaymentForm: React.FC<{ selectedPlan: Plan; currentPlan: Plan | null; onBack: () => void; onConfirm: () => void, isSubmitting: boolean }> = ({ selectedPlan, currentPlan, onBack, onConfirm, isSubmitting }) => {
    const priceDifference = useMemo(() => {
        if (!currentPlan) return selectedPlan.priceAnnual;
        return selectedPlan.priceAnnual - currentPlan.priceAnnual
    }, [selectedPlan, currentPlan]);

    return (
        <div className="animate-slide-in-right">
            <button onClick={onBack} className="text-sm text-amber-400 font-semibold mb-6">&larr; Volver a planes</button>
            <h2 className="text-3xl font-bold text-center mb-2">{currentPlan ? 'Confirmar Cambio' : 'Activar Membresía'}</h2>
            <p className="text-center text-gray-400 mb-8">
                {currentPlan 
                    ? `Estás cambiando de ${currentPlan.name} a ${selectedPlan.name}.`
                    : `Estás a punto de activar tu membresía ${selectedPlan.name}.`
                }
            </p>

            <div className="bg-[#1A1A2E] border border-gray-700 rounded-xl p-4 mb-8">
                <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-300">Total a pagar hoy:</span>
                    <span className="font-bold text-white">${priceDifference > 0 ? priceDifference.toFixed(2) : '0.00'}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tu próximo cobro de ${selectedPlan.priceAnnual} será en un año.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium text-gray-400">Número de Tarjeta (simulado)</label>
                    <div className="relative mt-1">
                        <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="text" placeholder="•••• •••• •••• 4242" className="w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-sm font-medium text-gray-400">Expira (MM/YY)</label>
                        <input type="text" placeholder="12/28" className="w-full mt-1 px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-medium text-gray-400">CVC</label>
                        <input type="text" placeholder="123" className="w-full mt-1 px-3 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                </div>
            </div>

            <button
                onClick={onConfirm}
                disabled={isSubmitting}
                className="mt-8 w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
                {isSubmitting ? 'Procesando...' : (priceDifference > 0 ? `Pagar $${priceDifference.toFixed(2)} y Activar` : 'Confirmar Cambio')}
            </button>
        </div>
    );
};

const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ user, onClose, onSubscriptionComplete, isOnboarding }) => {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [step, setStep] = useState<'selection' | 'payment'>('selection');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [plans, setPlans] = useState<Record<string, Plan> | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            const fetchedPlans = await api.getPlans();
            setPlans(fetchedPlans);
        };
        fetchPlans();
    }, []);

    const handleSelectPlan = (plan: Plan) => {
        if (plan.level === user.plan?.level) return;
        setSelectedPlan(plan);
        setStep('payment');
    };
    
    const handleConfirm = async () => {
        if (selectedPlan) {
            setIsSubmitting(true);
            const updatedUser = await api.updateUserPlan(user.id, selectedPlan);
            if(updatedUser) {
                onSubscriptionComplete(updatedUser);
            }
            setIsSubmitting(false);
        }
    };
    
    const ScreenWrapper: React.FC<{children: React.ReactNode}> = ({children}) => {
        if (isOnboarding) {
            return (
                <div className="min-h-screen bg-[#05050D] text-white flex flex-col items-center justify-center p-6">
                    <div className="w-full max-w-4xl mx-auto">{children}</div>
                </div>
            )
        }
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end">
                <div className="bg-[#05050D] border-t-2 border-amber-500 rounded-t-2xl p-6 w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto animate-slide-in-up-sub">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white z-20"><XIcon /></button>
                    {children}
                </div>
            </div>
        )
    }
    
    return (
        <ScreenWrapper>
             <div className="relative">
                 {step === 'selection' ? (
                    <div className="animate-fade-in">
                        <h2 className="text-3xl font-bold text-center mb-2">
                            {isOnboarding ? `¡Bienvenido, ${user.name}!` : 'Elige tu plan ACCESS+'}
                        </h2>
                        <p className="text-center text-gray-400 mb-8">
                            {isOnboarding ? 'Para empezar, elige tu nivel de membresía.' : 'Selecciona un nuevo plan para mejorar tus beneficios.'}
                        </p>
                        {!plans ? (
                             <div className="text-center py-20">Cargando planes...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <PlanCard plan={plans.Silver} isCurrent={user.plan?.level === AccessLevel.Silver} onSelect={() => handleSelectPlan(plans.Silver)} />
                                <PlanCard plan={plans.Gold} isCurrent={user.plan?.level === AccessLevel.Gold} onSelect={() => handleSelectPlan(plans.Gold)} />
                                <PlanCard plan={plans.Black} isCurrent={user.plan?.level === AccessLevel.VIP} onSelect={() => handleSelectPlan(plans.Black)} />
                            </div>
                        )}
                    </div>
                ) : selectedPlan && (
                    <PaymentForm 
                        selectedPlan={selectedPlan} 
                        currentPlan={user.plan || null} 
                        onBack={() => setStep('selection')} 
                        onConfirm={handleConfirm}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
            <style>{`
                @keyframes slide-in-up-sub { from { transform: translateY(100%); } to { transform: translateY(0); } }
                .animate-slide-in-up-sub { animation: slide-in-up-sub 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                @keyframes slide-in-right { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                .animate-slide-in-right { animation: slide-in-right 0.3s ease-out forwards; }
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fade-in 0.3s ease-in forwards; }
            `}</style>
        </ScreenWrapper>
    );
};

export default SubscriptionScreen;