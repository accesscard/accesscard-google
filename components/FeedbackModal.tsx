import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { StarIcon } from './icons/StarIcon';

interface FeedbackModalProps {
    venueName: string;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ venueName, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit(rating, comment);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div 
                className="bg-[#05050D] border-t-2 border-amber-500 rounded-2xl p-6 w-full max-w-md mx-auto flex flex-col animate-slide-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Deja tu Feedback</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><XIcon /></button>
                </header>
                <div className="flex-grow overflow-y-auto py-6 space-y-6">
                    <p className="text-center text-gray-300">¿Qué tal fue tu experiencia en <span className="font-bold">{venueName}</span>?</p>
                    
                    {/* Star Rating */}
                    <div className="flex justify-center items-center space-x-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <StarIcon className={`w-10 h-10 transition-colors ${(hoverRating || rating) >= star ? 'text-amber-400' : 'text-gray-600'}`} />
                            </button>
                        ))}
                    </div>
                    
                    {/* Comment */}
                    <div>
                         <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Escribe un comentario (opcional)..."
                            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                            rows={4}
                        />
                    </div>
                </div>
                 <footer className="flex-shrink-0 pt-4 border-t border-white/10">
                    <button onClick={handleSubmit} disabled={rating === 0} className="w-full py-3 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-400 disabled:opacity-50">
                        Enviar Feedback
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

export default FeedbackModal;
