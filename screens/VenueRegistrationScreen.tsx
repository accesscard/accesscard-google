import React, { useState } from 'react';
import { api } from '../services/api';
import { Venue } from '../types';
import { CheckIcon } from '../components/icons/CheckIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';

interface VenueRegistrationScreenProps {
    onRegistrationComplete: () => void;
}

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number; }> = ({ currentStep, totalSteps }) => (
    <div className="flex items-center justify-center space-x-2 mb-8">
        {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className={`w-12 h-1.5 rounded-full ${index < currentStep ? 'bg-amber-400' : 'bg-gray-700'}`}></div>
        ))}
    </div>
);

const VenueRegistrationScreen: React.FC<VenueRegistrationScreenProps> = ({ onRegistrationComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Restaurante' as Venue['category'],
        description: '',
        address: '',
        location: '',
        contact: { email: '', phone: '' },
        image: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'email' || name === 'phone') {
            setFormData(prev => ({...prev, contact: {...prev.contact, [name]: value}}))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            await api.registerVenue({
                ...formData,
                image: `https://picsum.photos/seed/${formData.name.toLowerCase()}/400/400` // Mock image
            });
            handleNext(); // Go to success screen
        } catch(e: any) {
            setError(e.message || 'Ocurrió un error al registrar el local.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <h2 className="text-2xl font-bold mb-6">1. Información del Local</h2>
                        <div className="space-y-4">
                           {/* Form fields */}
                           <div>
                               <label className="text-sm font-medium text-gray-400">Nombre del Local</label>
                               <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                           </div>
                            <div>
                               <label className="text-sm font-medium text-gray-400">Categoría</label>
                               <select name="category" value={formData.category} onChange={handleChange} className="w-full mt-1 px-4 py-2 bg-[#1C1C1C] border border-white/10 rounded-lg text-white">
                                    <option>Restaurante</option>
                                    <option>Bar</option>
                                    <option>Rooftop</option>
                                    <option>Discoteca</option>
                                </select>
                           </div>
                           <div>
                               <label className="text-sm font-medium text-gray-400">Descripción Corta</label>
                               <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                           </div>
                        </div>
                        <button onClick={handleNext} className="mt-8 w-full py-3 bg-white text-black font-bold rounded-xl">Siguiente</button>
                    </>
                );
            case 2:
                return (
                     <>
                        <h2 className="text-2xl font-bold mb-6">2. Ubicación y Contacto</h2>
                        <div className="space-y-4">
                           <div>
                               <label className="text-sm font-medium text-gray-400">Dirección Completa</label>
                               <input name="address" value={formData.address} onChange={handleChange} type="text" className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                           </div>
                           <div>
                               <label className="text-sm font-medium text-gray-400">Ciudad</label>
                               <input name="location" value={formData.location} onChange={handleChange} type="text" className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                           </div>
                            <div>
                               <label className="text-sm font-medium text-gray-400">Email de Contacto</label>
                               <input name="email" value={formData.contact.email} onChange={handleChange} type="email" className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                           </div>
                           <div>
                               <label className="text-sm font-medium text-gray-400">Teléfono</label>
                               <input name="phone" value={formData.contact.phone} onChange={handleChange} type="tel" className="w-full mt-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white" />
                           </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={handleBack} className="w-full py-3 bg-white/10 text-white font-bold rounded-xl">Atrás</button>
                            <button onClick={handleNext} className="w-full py-3 bg-white text-black font-bold rounded-xl">Siguiente</button>
                        </div>
                    </>
                );
            case 3:
                return (
                     <>
                        <h2 className="text-2xl font-bold mb-6">3. Galería de Fotos</h2>
                         <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center hover:border-amber-400 bg-white/5 transition-colors cursor-pointer">
                            <p className="text-gray-400">Haz clic para subir imágenes (simulado)</p>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={handleBack} className="w-full py-3 bg-white/10 text-white font-bold rounded-xl">Atrás</button>
                            <button onClick={handleSubmit} disabled={isSubmitting} className="w-full py-3 bg-amber-500 text-black font-bold rounded-xl disabled:opacity-50">
                               {isSubmitting ? 'Enviando...' : 'Finalizar y Enviar'}
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
                    </>
                );
            case 4:
                return (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckIcon className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">¡Solicitud Recibida!</h2>
                        <p className="text-gray-400 mt-2">Gracias por registrar tu local. Nuestro equipo revisará la información y te contactará pronto.</p>
                        <button onClick={onRegistrationComplete} className="mt-6 w-full py-3 bg-white text-black font-bold rounded-lg">Volver al Inicio</button>
                    </div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col">
            <header className="flex-shrink-0">
                 {step < 4 && <button onClick={onRegistrationComplete} className="text-sm text-gray-400 hover:text-white flex items-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Salir del registro</button>}
            </header>
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md">
                     <h1 className="text-3xl font-bold text-center mb-4">Registra tu Local</h1>
                     {step < 4 && <StepIndicator currentStep={step} totalSteps={3} />}
                     {renderStep()}
                </div>
            </main>
        </div>
    )
};

export default VenueRegistrationScreen;
