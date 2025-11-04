
import React from 'react';
import { Notification } from '../types';
import { XIcon } from '../components/icons/XIcon';

interface NotificationsScreenProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `hace un momento`;
    const intervals: { [key: string]: number } = {
        año: 31536000,
        mes: 2592000,
        día: 86400,
        hora: 3600,
        minuto: 60,
    };
    for (const key in intervals) {
        const interval = Math.floor(seconds / intervals[key]);
        if (interval >= 1) {
            const plural = interval > 1 ? 's' : '';
            return `hace ${interval} ${key}${plural}`;
        }
    }
    return `hace ${Math.floor(seconds)} segundos`;
}


const NotificationItem: React.FC<{ notification: Notification; onMarkAsRead: (id: string) => void; }> = ({ notification, onMarkAsRead }) => {
    return (
        <div 
            className={`p-4 border-b border-gray-800 flex items-start space-x-4 cursor-pointer hover:bg-gray-800/50 transition-colors ${!notification.read ? 'bg-amber-500/10' : ''}`}
            onClick={() => onMarkAsRead(notification.id)}
        >
            {!notification.read && <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 flex-shrink-0"></div>}
            <div className={`flex-grow ${notification.read ? 'pl-6' : ''}`}>
                <p className="font-semibold text-white">{notification.title}</p>
                <p className="text-sm text-gray-300">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{timeSince(new Date(notification.timestamp))}</p>
            </div>
        </div>
    );
};


const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ notifications, onClose, onMarkAsRead, onMarkAllAsRead }) => {
  const sortedNotifications = [...notifications].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="fixed inset-0 bg-[#05050D] z-50 flex flex-col animate-slide-in">
        <header className="flex-shrink-0 h-20 bg-[#05050D]/80 backdrop-blur-lg border-b border-gray-800 flex items-center justify-between px-4">
            <h1 className="text-xl font-bold text-white uppercase tracking-wider">Notificaciones</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <XIcon />
            </button>
        </header>

        <div className="flex-grow overflow-y-auto">
            {sortedNotifications.length > 0 ? (
                 sortedNotifications.map(n => <NotificationItem key={n.id} notification={n} onMarkAsRead={onMarkAsRead} />)
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-center text-gray-500 p-8">No tienes notificaciones.</p>
                </div>
            )}
        </div>

        <footer className="flex-shrink-0 p-4 border-t border-gray-800 bg-[#05050D]">
            <button 
                onClick={onMarkAllAsRead} 
                className="w-full py-2 text-sm text-amber-500 font-semibold rounded-lg hover:bg-amber-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={notifications.every(n => n.read)}
            >
                Marcar todas como leídas
            </button>
        </footer>
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

export default NotificationsScreen;