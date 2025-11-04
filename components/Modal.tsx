import React from 'react';
import { XIcon } from './icons/XIcon';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div 
                className="bg-[#05050D] border-t-2 border-amber-500 rounded-2xl p-6 w-full max-w-lg mx-auto max-h-[90vh] flex flex-col animate-slide-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white"><XIcon /></button>
                </header>
                <div className="flex-grow overflow-y-auto py-6">
                    {children}
                </div>
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

export default Modal;
