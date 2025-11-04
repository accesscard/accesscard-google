import React, { useState } from 'react';
import { Venue } from '../types';
import { XIcon } from './icons/XIcon';
import { GoogleGenAI } from '@google/genai';
import { SparklesIcon } from './icons/SparklesIcon';

interface AIConciergeModalProps {
    venues: Venue[];
    onClose: () => void;
}

const AIConciergeModal: React.FC<AIConciergeModalProps> = ({ venues, onClose }) => {
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
                Eres un "AI Concierge" para ACCESS+, una membresía de lujo. Tu tarea es ayudar a los miembros a planificar sus salidas basándote en los locales afiliados disponibles.
                
                Locales Disponibles (JSON):
                ${JSON.stringify(venues.map(v => ({name: v.name, category: v.category, description: v.description, location: v.location})), null, 2)}
                
                Basado en esta lista, responde a la siguiente solicitud del miembro. Sé creativo, sugerente y mantén un tono exclusivo y servicial. Formatea tu respuesta de manera clara.
            `;
            const fullPrompt = `${context}\n\nSOLICITUD DEL MIEMBRO: "${query}"\n\nRECOMENDACIÓN DEL CONCIERGE:`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: fullPrompt,
                config: {
                    thinkingConfig: { thinkingBudget: 32768 }
                }
            });

            setResult(response.text);

        } catch (e: any) {
            setError('Lo siento, no pude procesar tu solicitud en este momento.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div 
                className="bg-[#05050D] border-t-2 border-fuchsia-500 rounded-2xl p-6 w-full max-w-2xl mx-auto max-h-[90vh] flex flex-col animate-slide-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><SparklesIcon className="w-6 h-6 text-fuchsia-400" /> AI Concierge</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><XIcon /></button>
                </header>
                <div className="flex-grow overflow-y-auto py-6 space-y-4">
                    <p className="text-sm text-gray-400">Describe tu plan ideal. ¿Una cena romántica? ¿Una noche de fiesta? Déjame ayudarte a planificarlo.</p>
                     <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ej: 'Planifica una noche para un aniversario en Lima, empezando en un rooftop y terminando en un restaurante de alta cocina.'"
                        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 transition-all"
                        rows={4}
                    />
                    {isLoading && (
                         <div className="text-center p-8 text-gray-400 animate-pulse">
                            <SparklesIcon className="w-12 h-12 mx-auto mb-4" />
                            <p>Creando la experiencia perfecta para ti...</p>
                        </div>
                    )}
                    {result && <div className="p-4 bg-black/30 rounded-lg whitespace-pre-wrap text-sm text-gray-200">{result}</div>}
                    {error && <div className="p-4 bg-red-900/50 text-red-300 rounded-lg">{error}</div>}
                </div>
                 <footer className="flex-shrink-0 pt-4 border-t border-white/10">
                    <button onClick={handleQuery} disabled={isLoading || !query} className="w-full flex items-center justify-center gap-2 py-3 bg-fuchsia-600 text-white font-bold rounded-lg hover:bg-fuchsia-500 transition-all disabled:opacity-50">
                        {isLoading ? 'Pensando...' : 'Obtener Recomendación'}
                    </button>
                </footer>
            </div>
             <style>{`
                @keyframes slide-in-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-in-up { animation: slide-in-up 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
                @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
             `}</style>
        </div>
    );
};

export default AIConciergeModal;
