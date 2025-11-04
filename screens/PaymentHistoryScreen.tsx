import React, { useState, useEffect } from 'react';
import { PaymentRecord } from '../types';
import { api } from '../services/api';
import { XIcon } from '../components/icons/XIcon';

interface PaymentHistoryScreenProps {
    userId: string;
    onClose: () => void;
}

const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({ userId, onClose }) => {
    const [history, setHistory] = useState<PaymentRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            const data = await api.getPaymentHistory(userId);
            setHistory(data);
            setIsLoading(false);
        };
        fetchHistory();
    }, [userId]);

    return (
        <div className="fixed inset-0 bg-[#05050D] z-50 flex flex-col animate-slide-in">
            <header className="flex-shrink-0 h-20 bg-[#05050D]/80 backdrop-blur-lg border-b border-gray-800 flex items-center justify-between px-4">
                <h1 className="text-xl font-bold text-white uppercase tracking-wider">Historial de Pagos</h1>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <XIcon />
                </button>
            </header>

            <div className="flex-grow overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full"><p>Cargando...</p></div>
                ) : history.length > 0 ? (
                    <table className="w-full text-sm text-left">
                        <thead className="text-gray-400">
                            <tr className="border-b border-white/10">
                                <th className="p-3 font-medium">Fecha</th>
                                <th className="p-3 font-medium">Plan</th>
                                <th className="p-3 font-medium text-right">Monto</th>
                                <th className="p-3 font-medium text-right">Factura</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {history.map(record => (
                                <tr key={record.id} className="hover:bg-white/5">
                                    <td className="p-3">{new Date(record.date).toLocaleDateString('es-ES')}</td>
                                    <td className="p-3">{record.plan}</td>
                                    <td className="p-3 text-right font-semibold">${record.amount.toFixed(2)}</td>
                                    <td className="p-3 text-right text-gray-500 font-mono">{record.invoiceId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-center text-gray-500 p-8">No tienes pagos registrados.</p>
                    </div>
                )}
            </div>
             <style>{`
              @keyframes slide-in-from-right {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
              .animate-slide-in { animation: slide-in-from-right 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default PaymentHistoryScreen;
